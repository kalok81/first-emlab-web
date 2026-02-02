export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';


export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare('SELECT * FROM works ORDER BY created_at DESC').all();
    return Response.json(results);
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
    const slug = searchParams.get('slug');
    if (!id && !slug) return Response.json({ error: 'Missing id or slug' }, { status: 400 });

    const db = getRequestContext().env.DB;
    if (id) {
      await db.prepare('DELETE FROM works WHERE id = ?').bind(id).run();
    } else {
      await db.prepare('DELETE FROM works WHERE slug = ?').bind(slug).run();
    }
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
