import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const ADMIN_PASSWORD = 'admin';

export async function GET() {
  try {
    const context = getRequestContext();
    if (!context || !context.env || !context.env.DB) {
      return Response.json([], { status: 200 });
    }

    const db = context.env.DB;
    const { results } = await db.prepare("SELECT * FROM categories ORDER BY name ASC").all();
    return Response.json(results);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const password = request.headers.get('X-Admin-Password');
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug } = await request.json();
    if (!name || !slug) {
      return Response.json({ error: 'Missing name or slug' }, { status: 400 });
    }

    const context = getRequestContext();
    if (!context || !context.env || !context.env.DB) {
      return Response.json({ error: 'DB not found' }, { status: 500 });
    }

    const db = context.env.DB;
    await db.prepare(
      "INSERT INTO categories (name, slug) VALUES (?, ?)"
    ).bind(name, slug).run();

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const password = request.headers.get('X-Admin-Password');
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 });
    }

    const context = getRequestContext();
    if (!context || !context.env || !context.env.DB) {
      return Response.json({ error: 'DB not found' }, { status: 500 });
    }

    const db = context.env.DB;
    await db.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
