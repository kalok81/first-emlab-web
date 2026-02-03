import { getRequestContext } from '@cloudflare/next-on-pages';

export async function verifyAuth(request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth) return false;

  const db = (getRequestContext().env as any).DB;
  const result = await db.prepare('SELECT value FROM admin_config WHERE key = ?')
    .bind('password')
    .first();

  return result && result.value === auth;
}
