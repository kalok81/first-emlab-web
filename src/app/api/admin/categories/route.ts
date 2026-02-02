export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';


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
    const auth = request.headers.get('Authorization');
    if (auth !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug: providedSlug } = await request.json();
    if (!name) return Response.json({ error: 'Missing name' }, { status: 400 });

    // Generate slug from name if not provided
    const slug = providedSlug || name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const db = getRequestContext().env.DB;
    await db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)')
      .bind(name, slug)
      .run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = request.headers.get('Authorization');
    if (auth !== 'admin') {
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
    const auth = request.headers.get('Authorization');
    if (auth !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
