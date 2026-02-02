export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare('SELECT * FROM products ORDER BY id DESC').all();
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

    const body = await request.json();
    const { title, price, description, image_url, buy_link } = body as any;

    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare(
      'INSERT INTO products (title, price, description, image_url, buy_link) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(title, price, description, image_url, buy_link)
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

    const body = await request.json();
    const { id, title, price, description, image_url, buy_link } = body as any;

    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare(
      'UPDATE products SET title = ?, price = ?, description = ?, image_url = ?, buy_link = ? WHERE id = ?'
    )
      .bind(title, price, description, image_url, buy_link, id)
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
    await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
