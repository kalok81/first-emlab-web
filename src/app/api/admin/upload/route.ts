import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const ADMIN_PASSWORD = 'admin';

export async function POST(request: Request) {
  try {
    const password = request.headers.get('X-Admin-Password');
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, image } = await request.json();

    if (!category || !image) {
      return Response.json({ error: 'Missing category or image' }, { status: 400 });
    }

    const context = getRequestContext();
    if (!context || !context.env || !context.env.DB) {
      return Response.json({ error: 'DB not found' }, { status: 500 });
    }

    const db = context.env.DB;
    await db.prepare(
      "INSERT INTO works (category, image_data) VALUES (?, ?)"
    ).bind(category, image).run();

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
