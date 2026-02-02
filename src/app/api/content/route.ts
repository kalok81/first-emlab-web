export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';


export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare('SELECT * FROM site_content').all();
    // Convert array to object for easier consumption
    const content = results.reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    return Response.json(content);
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
    const items = body as Record<string, string>;

    const db = getRequestContext().env.DB;
    
    // Batch update
    const statements = Object.entries(items).map(([key, value]) => {
      return db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP')
        .bind(key, value);
    });

    await db.batch(statements);

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
