export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { verifyAuth } from '@/lib/auth';


export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(`
      SELECT w.*, wk.image_data as work_image 
      FROM workshops w 
      LEFT JOIN works wk ON w.work_id = wk.id 
      ORDER BY w.id DESC
    `).all();
    
    const workshops = results.map((w: any) => ({
      ...w,
      image_url: w.work_image || w.image_url
    }));

    return Response.json(workshops);
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
    const { title, description, price, duration, image_url, work_id, form_url } = body as any;

    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    
    const storedImageUrl = work_id ? null : image_url;

    await db.prepare(
      'INSERT INTO workshops (title, description, price, duration, image_url, work_id, form_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(title, description, price, duration, storedImageUrl, work_id, form_url)
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
    const { id, title, description, price, duration, image_url, work_id, form_url } = body as any;

    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    const db = getRequestContext().env.DB;
    
    const storedImageUrl = work_id ? null : image_url;

    await db.prepare(
      'UPDATE workshops SET title = ?, description = ?, price = ?, duration = ?, image_url = ?, work_id = ?, form_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(title, description, price, duration, storedImageUrl, work_id, form_url, id)
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
    await db.prepare('DELETE FROM workshops WHERE id = ?').bind(id).run();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
