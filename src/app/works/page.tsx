'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { client, urlFor } from '@/lib/sanity';

type WorkItem = {
  src: string;
  category: string;
  title: string;
  date: string;
};

interface SanityWork {
  _id: string;
  title: string;
  image: any;
  category: {
    name: string;
    slug: {
      current: string;
    }
  };
  date: string;
}

interface SanityCategory {
  _id: string;
  name: string;
  slug: {
    current: string;
  }
}

export default function Works() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [dynamicWorks, setDynamicWorks] = useState<WorkItem[]>([]);
  const [dbCategories, setDbCategories] = useState<{label: string, value: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [worksData, catsData] = await Promise.all([
          client.fetch<SanityWork[]>(`*[_type == "work"]{
            _id,
            title,
            image,
            category->{
              name,
              slug
            },
            date
          }`),
          client.fetch<SanityCategory[]>(`*[_type == "category"]{
            _id,
            name,
            slug
          }`)
        ]);
        
        const formatted: WorkItem[] = worksData.map(item => ({
          src: item.image ? urlFor(item.image).url() : '',
          category: item.category?.slug?.current || '',
          title: item.title,
          date: item.date || ''
        }));
        setDynamicWorks(formatted);

        const cats = catsData.map(c => ({
          label: c.name,
          value: c.slug.current
        }));
        setDbCategories(cats);
      } catch (e) {
        console.error('Failed to fetch data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { label: '全部', value: '全部' },
    ...dbCategories
  ];

  const filteredWorks = activeCategory === '全部' 
    ? dynamicWorks 
    : dynamicWorks.filter(w => w.category === activeCategory);

  return (
    <main className="min-h-screen">
      <Header />
      <section className="bg-accent/10 py-24 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-serif tracking-tight">作品集 Gallery</h1>
        <p className="opacity-60 text-lg">每一針，都記錄著溫慢的時光</p>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(c => (
            <button 
              key={c.value} 
              onClick={() => setActiveCategory(c.value)}
              className={`px-8 py-2 rounded-full border transition-all duration-300 text-sm font-medium ${
                activeCategory === c.value 
                ? 'bg-accent border-accent text-white shadow-lg scale-105' 
                : 'border-accent/20 text-accent hover:border-accent hover:bg-accent/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
             <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 opacity-40">載入中...</p>
          </div>
        ) : (
          <>
            {/* Works Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredWorks.map((work, i) => (
                <div key={i} className="group animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="aspect-[4/5] overflow-hidden mb-6 rounded-2xl shadow-sm relative bg-gray-50">
                    {work.src && (
                      <img 
                        src={work.src} 
                        alt={work.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">{work.title}</h3>
                  <div className="flex items-center gap-3 opacity-60 text-sm">
                    <span>{work.date}</span>
                    <span className="w-1 h-1 bg-current rounded-full" />
                    <span>手工刺繡</span>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredWorks.length === 0 && (
              <div className="text-center py-20">
                <p className="opacity-40">此分類暫無作品</p>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </main>
  );
}
