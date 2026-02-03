import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const db = (getRequestContext().env as any).DB;
    
    const result = await db.prepare('SELECT value FROM admin_config WHERE key = ?')
      .bind('password')
      .first();
    
    if (result && result.value === password) {
      return Response.json({ success: true, token: password });
    } else {
      return Response.json({ error: '密碼錯誤' }, { status: 401 });
    }
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
