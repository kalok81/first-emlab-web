import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorksGallery from '@/components/WorksGallery';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export default async function Works() {
  // 1. Fetch from File System (Legacy) - This might fail on Edge if not careful, 
  // but next-on-pages handles some fs in build time or if using specific configs.
  // Actually, on Edge, fs is not available. 
  // If we want to keep markdown, we should have processed them at build time or use a different approach.
  // For this D1 CMS, we'll focus on D1 data.

  let d1Works: any[] = [];
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare('SELECT works.*, categories.name as category_name FROM works LEFT JOIN categories ON works.category = categories.id ORDER BY works.created_at DESC').all();
    d1Works = results.map(w => ({
      src: w.image_data,
      category: w.category_name || w.category,
      title: `作品 #${w.id}`,
      date: w.created_at,
    }));
  } catch (e) {
    console.error('D1 fetch failed:', e);
  }

  // To avoid breaking existing site if D1 is empty, we can try to merge or just use D1
  const works = d1Works;

  // Extract unique categories
  const categories = Array.from(new Set(works.map((work) => work.category))).map((cat) => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: cat,
  }));

  return (
    <main className="min-h-screen">
      <Header />
      <section className="bg-accent/10 py-24 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-serif tracking-tight">作品集 Gallery</h1>
        <p className="opacity-60 text-lg">每一針，都記錄著溫慢的時光</p>
      </section>

      <WorksGallery works={works} categories={categories} />

      <Footer />
    </main>
  );
}
