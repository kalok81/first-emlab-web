import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const context = getRequestContext();
    if (!context || !context.env || !context.env.DB) {
      return Response.json([], { status: 200 });
    }

    const db = context.env.DB;
    const { results } = await db.prepare("SELECT * FROM works ORDER BY created_at DESC").all();
    return Response.json(results);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
