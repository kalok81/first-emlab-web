import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const auth = request.headers.get('Authorization');
    if (auth !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, image_data } = await request.json();

    if (!image_data) {
      return Response.json({ error: 'Missing image data' }, { status: 400 });
    }

    const db = getRequestContext().env.DB;
    await db.prepare('INSERT INTO works (category, image_data) VALUES (?, ?)')
      .bind(category || 'default', image_data)
      .run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
