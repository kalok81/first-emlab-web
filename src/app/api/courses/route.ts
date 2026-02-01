import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const context = getRequestContext();
    if (!context || !context.env || !context.env.DB) {
      // Fallback for local development or missing binding
      return Response.json([
        {
          id: 1,
          title: "基礎刺繡入門課 (Mock)",
          level: "Level 1",
          duration: "3小時",
          price: "HK$480",
          description: "適合完全零基礎，學習8種基礎針法，完成一個精美杯墊。",
          image_url: "https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=800"
        }
      ]);
    }

    const db = context.env.DB;
    const { results } = await db.prepare("SELECT * FROM courses").all();
    return Response.json(results);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
