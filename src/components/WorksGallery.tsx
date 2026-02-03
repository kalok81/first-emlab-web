'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type WorkItem = {
  src: string;
  category: string;
  title: string;
  date: string;
};

type Category = {
  label: string;
  value: string;
};

function WorksGalleryContent({ works, categories }: { works: WorkItem[], categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const filterOptions = [
    { label: '全部', value: '全部' },
    ...categories
  ];

  useEffect(() => {
    if (categoryParam) {
      const match = filterOptions.find(o => o.value.toLowerCase() === categoryParam.toLowerCase());
      if (match) {
        setActiveCategory(match.value);
      }
    }
  }, [categoryParam, categories]);

  const filteredWorks = activeCategory === '全部' 
    ? works 
    : works.filter(w => w.category === activeCategory);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 washi-texture">
      {/* Category Filter - Refined Japanese Style */}
      <div className="flex flex-wrap justify-center gap-6 mb-24">
        {filterOptions.map(c => (
          <button 
            key={c.value} 
            onClick={() => setActiveCategory(c.value)}
            className={`px-10 py-2.5 rounded-full border tracking-[0.2em] text-xs uppercase transition-all duration-500 font-bold ${
              activeCategory === c.value 
              ? 'bg-primary border-primary text-white shadow-japanese scale-105' 
              : 'border-accent/10 text-accent hover:border-accent hover:bg-accent/5'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Works Grid - Masonry-like spacing */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
        {filteredWorks.map((work, i) => (
          <div 
            key={i} 
            className="break-inside-avoid group animate-fade-up" 
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="jp-card mb-4 relative group">
              {work.src && (
                <img 
                  src={work.src} 
                  alt={work.title} 
                  className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                 <div className="bg-white/90 px-6 py-2 rounded-full text-primary text-xs tracking-widest scale-90 group-hover:scale-100 transition-all duration-500">
                    ZOOM VIEW
                 </div>
              </div>
            </div>
            <div className="px-2 space-y-2">
              <h3 className="font-serif text-xl text-primary tracking-wide group-hover:text-accent transition-colors">{work.title}</h3>
              <div className="flex items-center gap-4 opacity-50 text-[10px] uppercase tracking-widest font-bold">
                <span>{work.date}</span>
                <span className="w-8 h-[1px] bg-accent/30" />
                <span>Handmade Embroidery</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredWorks.length === 0 && (
        <div className="text-center py-32 border-2 border-dashed border-accent/10 rounded-3xl">
          <p className="opacity-40 italic tracking-widest">此分類暫無作品 NO WORKS IN THIS CATEGORY</p>
        </div>
      )}
    </section>
  );
}

export default function WorksGallery(props: { works: WorkItem[], categories: Category[] }) {
  return (
    <Suspense fallback={<div className="py-24 text-center opacity-50">Loading gallery...</div>}>
      <WorksGalleryContent {...props} />
    </Suspense>
  );
}
