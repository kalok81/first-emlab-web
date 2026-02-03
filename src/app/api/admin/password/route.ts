import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const auth = request.headers.get('Authorization');
    const db = (getRequestContext().env as any).DB;
    
    const currentPasswordRow = await db.prepare('SELECT value FROM admin_config WHERE key = ?')
      .bind('password')
      .first();

    if (!currentPasswordRow || auth !== currentPasswordRow.value) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 1) {
      return Response.json({ error: 'Missing new password' }, { status: 400 });
    }

    await db.prepare('UPDATE admin_config SET value = ? WHERE key = ?')
      .bind(newPassword, 'password')
      .run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
