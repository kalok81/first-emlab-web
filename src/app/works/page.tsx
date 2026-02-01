import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Works() {
  const categories = ["人像刺繡", "寵物系列", "植物花卉", "風景畫作"];
  
  return (
    <main>
      <Header />
      <section className="bg-accent/10 py-20 text-center">
        <h1 className="text-4xl mb-4">作品集 Gallery</h1>
        <p className="opacity-60">細看每一針的溫柔</p>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(c => (
            <button key={c} className="px-6 py-2 rounded-full border border-accent/30 text-sm hover:bg-accent hover:text-white transition-colors">
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div key={i} className="group">
              <div className="aspect-[4/5] overflow-hidden mb-4 rounded-lg shadow-sm relative">
                <Image 
                  src={`/images/works/work-${String(i).padStart(2, '0')}.jpg`} 
                  alt={`Work ${i}`} 
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-lg mb-1">初刺作品 #{i}</h3>
              <p className="text-sm opacity-60">2024 · 手工刺繡 · 原創設計</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
