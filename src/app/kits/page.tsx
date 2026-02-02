'use client';

export const runtime = 'edge';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

type KitItem = {
  src: string;
  title: string;
  price: string;
  description: string;
};

export default function Kits() {
  const kits: KitItem[] = [
    { src: '/images/works/products/01.jpg', title: '刺繡材料包 - 森林系列 #01', price: 'HK$ 280', description: '包含完整針法說明與高品質繡線' },
    { src: '/images/works/products/02.jpg', title: '臘腸狗刺繡材料包', price: 'HK$ 180', description: '適合新手的可愛動物扣針系列' },
    { src: '/images/works/products/03.jpg', title: 'Fing尾貓刺繡材料包', price: 'HK$ 180', description: '動態感十足的貓咪刺繡設計' },
    { src: '/images/works/products/04.jpg', title: '煎餃刺繡材料包', price: 'HK$ 150', description: '趣味十足的微型刺繡小物' },
    { src: '/images/works/products/05.jpg', title: '狐狸刺繡材料包', price: 'HK$ 180', description: '精緻的層次感針法練習' },
    { src: '/images/works/products/06.jpg', title: '刺繡材料包 - 森林系列 #02', price: 'HK$ 280', description: '包含完整針法說明與高品質繡線' },
    { src: '/images/works/products/07.jpg', title: '刺繡材料包 - 森林系列 #03', price: 'HK$ 280', description: '包含完整針法說明與高品質繡線' },
    { src: '/images/works/products/08.jpg', title: '刺繡材料包 - 森林系列 #04', price: 'HK$ 280', description: '包含完整針法說明與高品質繡線' },
    { src: '/images/works/products/09.jpg', title: '刺繡材料包 - 森林系列 #05', price: 'HK$ 280', description: '包含完整針法說明與高品質繡線' },
  ];

  return (
    <main className="min-h-screen">
      <Header />
      <section className="bg-accent/10 py-24 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-serif tracking-tight">刺繡材料包 Kits</h1>
        <p className="opacity-60 text-lg">在家也能體驗刺繡的樂趣</p>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        {/* Kits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {kits.map((kit, i) => (
            <div key={i} className="group animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-[4/5] overflow-hidden mb-6 rounded-2xl shadow-sm relative bg-gray-50">
                <img 
                  src={kit.src} 
                  alt={kit.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">{kit.title}</h3>
              <p className="text-accent font-medium mb-2">{kit.price}</p>
              <p className="opacity-60 text-sm leading-relaxed">{kit.description}</p>
            </div>
          ))}
        </div>
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
