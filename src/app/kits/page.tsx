'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type KitItem = {
  id: number;
  image_url: string;
  title: string;
  price: string;
  description: string;
  buy_link: string;
};

export default function Kits() {
  const [kits, setKits] = useState<KitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setKits(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      <section className="bg-secondary/10 py-32 text-center washi-texture">
        <div className="animate-fade-up">
          <span className="text-accent uppercase tracking-[0.5em] text-xs font-bold mb-6 block">DIY KITS</span>
          <h1 className="text-5xl md:text-6xl mb-8 font-serif text-primary tracking-wider">刺繡材料包</h1>
          <p className="text-xl text-primary/60 max-w-2xl mx-auto px-6 font-light leading-relaxed">
            嚴選優質材料，將溫暖帶回家延續。<br />即使在家，也能享受刺繡的靜謐時光。
          </p>
        </div>
      </section>

      <section className="py-32 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {kits.map((kit, i) => (
              <div 
                key={kit.id} 
                className="animate-fade-up" 
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <a href={kit.buy_link} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="jp-card mb-8 aspect-[4/5] relative">
                    <img 
                      src={kit.image_url} 
                      alt={kit.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full shadow-sm">
                       <span className="text-xs font-bold text-accent tracking-widest">{kit.price}</span>
                    </div>
                  </div>
                  <div className="space-y-4 px-2">
                    <h3 className="font-serif text-2xl text-primary tracking-wide group-hover:text-accent transition-colors leading-tight">{kit.title}</h3>
                    <p className="text-primary/60 text-sm leading-loose font-light line-clamp-3">{kit.description}</p>
                    <div className="pt-4 flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase">
                       <span>View Details</span>
                       <span className="w-12 h-px bg-accent/30 group-hover:w-20 transition-all duration-500" />
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
        {!loading && kits.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-accent/10 rounded-3xl">
            <p className="opacity-40 italic tracking-widest uppercase">尚無材料包 COMING SOON</p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
