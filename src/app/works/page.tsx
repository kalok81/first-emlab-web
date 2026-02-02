import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorksGallery from '@/components/WorksGallery';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function Works() {
  const worksDirectory = path.join(process.cwd(), 'src/content/works');
  
  // Ensure directory exists
  if (!fs.existsSync(worksDirectory)) {
    fs.mkdirSync(worksDirectory, { recursive: true });
  }

  const filenames = fs.readdirSync(worksDirectory);
  
  const works = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(worksDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        src: data.image || '',
        category: data.category || 'other',
        title: data.title || filename.replace('.md', ''),
        date: data.date ? new Date(data.date).toISOString() : '',
      };
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  // Extract unique categories
  const categories = Array.from(new Set(works.map((work) => work.category))).map((cat) => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: cat,
  }));

  // Add "All" category if not present (handled by Gallery usually, but let's check)
  // Actually, WorksGallery might handle it.
  
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
