import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const ADMIN_PASSWORD = 'admin';

export async function POST(request: Request) {
  try {
    const password = request.headers.get('X-Admin-Password');
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = getRequestContext();
    if (!context || !context.env || !context.env.DB) {
      return Response.json({ error: 'DB not found' }, { status: 500 });
    }
    const db = context.env.DB;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      const items = Array.isArray(body) ? body : [body];

      const stmt = db.prepare("INSERT INTO works (category, image_data) VALUES (?, ?)");
      const batch = items.map(item => stmt.bind(item.category, item.image));
      await db.batch(batch);

      return Response.json({ success: true, count: items.length });
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const category = formData.get('category') as string;
      const files = formData.getAll('files') as File[];

      if (!category || files.length === 0) {
        return Response.json({ error: 'Missing category or files' }, { status: 400 });
      }

      const stmt = db.prepare("INSERT INTO works (category, image_data) VALUES (?, ?)");
      const batch = [];

      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const dataUrl = `data:${file.type};base64,${base64}`;
        batch.push(stmt.bind(category, dataUrl));
      }

      await db.batch(batch);
      return Response.json({ success: true, count: files.length });
    }

    return Response.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
