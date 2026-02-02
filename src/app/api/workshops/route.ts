import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare('SELECT * FROM workshops ORDER BY id DESC').all();
    return Response.json(results);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, duration, image_url, form_url } = body as any;

    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare(
      'INSERT INTO workshops (title, description, price, duration, image_url, form_url) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(title, description, price, duration, image_url, form_url)
      .run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, price, duration, image_url, form_url } = body as any;

    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare(
      'UPDATE workshops SET title = ?, description = ?, price = ?, duration = ?, image_url = ?, form_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(title, description, price, duration, image_url, form_url, id)
      .run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare('DELETE FROM workshops WHERE id = ?').bind(id).run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
