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
      <section className="bg-accent/10 py-24 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-serif tracking-tight">刺繡材料包 Kits</h1>
        <p className="opacity-60 text-lg">在家也能體驗刺繡的樂趣</p>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20 opacity-40">載入中...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {kits.map((kit, i) => (
              <div key={kit.id} className="group animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                <a href={kit.buy_link} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="aspect-[4/5] overflow-hidden mb-6 rounded-2xl shadow-sm relative bg-gray-50">
                    <img 
                      src={kit.image_url} 
                      alt={kit.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">{kit.title}</h3>
                  <p className="text-accent font-medium mb-2">{kit.price}</p>
                  <p className="opacity-60 text-sm leading-relaxed">{kit.description}</p>
                </a>
              </div>
            ))}
          </div>
        )}
        {!loading && kits.length === 0 && (
          <div className="text-center py-20 opacity-40">尚無材料包</div>
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
