'use client';

import { useState } from 'react';

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

export default function WorksGallery({ works, categories }: { works: WorkItem[], categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState('全部');

  const filterOptions = [
    { label: '全部', value: '全部' },
    ...categories
  ];

  const filteredWorks = activeCategory === '全部' 
    ? works 
    : works.filter(w => w.category === activeCategory);

  return (
    <section className="py-20 max-w-6xl mx-auto px-4">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {filterOptions.map(c => (
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </section>
  );
}
