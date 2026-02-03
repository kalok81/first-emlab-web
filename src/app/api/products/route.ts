export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(`
      SELECT p.*, w.image_data as work_image 
      FROM products p 
      LEFT JOIN works w ON p.work_id = w.id 
      ORDER BY p.id DESC
    `).all();
    
    // Map work_image to image_url if work_id is present
    const products = results.map((p: any) => ({
      ...p,
      image_url: p.work_image || p.image_url
    }));

    return Response.json(products);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth(request))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, price, description, image_url, work_id, buy_link } = body as any;

    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    
    // If work_id is provided, we don't store the potentially large image_url (base64)
    const storedImageUrl = work_id ? null : image_url;

    await db.prepare(
      'INSERT INTO products (title, price, description, image_url, work_id, buy_link) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(title, price, description, storedImageUrl, work_id, buy_link)
      .run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAuth(request))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, price, description, image_url, work_id, buy_link } = body as any;

    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    
    const storedImageUrl = work_id ? null : image_url;

    await db.prepare(
      'UPDATE products SET title = ?, price = ?, description = ?, image_url = ?, work_id = ?, buy_link = ? WHERE id = ?'
    )
      .bind(title, price, description, storedImageUrl, work_id, buy_link, id)
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
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const db = getRequestContext().env.DB;
    await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
