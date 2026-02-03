export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { verifyAuth } from '@/lib/auth';


export async function POST(request: Request) {
  try {
    if (!(await verifyAuth(request))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, image_data } = await request.json();

    if (!image_data) {
      return Response.json({ error: 'Missing image data' }, { status: 400 });
    }

    // Payload size check (D1 has a limit of 1MB per statement)
    if (image_data.length > 800 * 1024) { 
       return Response.json({ error: 'Payload Too Large (Max 800KB Base64)' }, { status: 413 });
    }

    const db = getRequestContext().env.DB;
    try {
      await db.prepare('INSERT INTO works (category, image_data) VALUES (?, ?)')
        .bind(category || 'default', image_data)
        .run();
    } catch (dbError: any) {
      console.error('D1 Error:', dbError);
      if (dbError.message.includes('too large') || dbError.message.includes('limit exceeded')) {
        return Response.json({ error: 'Payload Too Large' }, { status: 413 });
      }
      return Response.json({ error: `Database Error: ${dbError.message}` }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
