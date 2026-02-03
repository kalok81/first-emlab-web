export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { verifyAuth } from '@/lib/auth';


export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare('SELECT * FROM categories ORDER BY created_at ASC').all();
    return Response.json(results);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth(request))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug: providedSlug } = await request.json();
    if (!name) return Response.json({ error: 'Missing name' }, { status: 400 });

    // Generate slug from name if not provided
    // Support non-ASCII characters by using a safer slug generation or just the name
    let slug = providedSlug || name
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // If slug is empty (e.g. only symbols), use a default
    if (!slug) slug = 'cat';

    const db = getRequestContext().env.DB;

    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await db.prepare('SELECT id FROM categories WHERE slug = ?').bind(finalSlug).first();
      if (!existing) break;
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    await db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)')
      .bind(name, finalSlug)
      .run();
    return Response.json({ success: true, slug: finalSlug });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAuth(request))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name } = await request.json();
    if (!id || !name) return Response.json({ error: 'Missing id or name' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare('UPDATE categories SET name = ? WHERE id = ?')
      .bind(name, id)
      .run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAuth(request))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    if (!id && !slug) return Response.json({ error: 'Missing id or slug' }, { status: 400 });

    const db = getRequestContext().env.DB;
    if (id) {
      await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    } else {
      await db.prepare('DELETE FROM categories WHERE slug = ?').bind(slug).run();
    }
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
