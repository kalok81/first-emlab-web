import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const ADMIN_PASSWORD = 'admin';

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
    await db.prepare("DELETE FROM works WHERE id = ?").bind(id).run();

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
