import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

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

    const { name, slug } = await request.json();
    if (!name || !slug) return Response.json({ error: 'Missing name or slug' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)')
      .bind(name, slug)
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
