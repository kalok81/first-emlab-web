'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

type WorkItem = {
  src: string;
  category: string;
  title: string;
  date: string;
};

interface DynamicWork {
  id: number;
  category: string;
  image_data: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Works() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [dynamicWorks, setDynamicWorks] = useState<WorkItem[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [worksRes, catsRes] = await Promise.all([
          fetch('/api/works'),
          fetch('/api/categories')
        ]);
        
        const worksData: DynamicWork[] = await worksRes.json();
        const formatted: WorkItem[] = worksData.map(item => ({
          src: item.image_data,
          category: item.category,
          title: `作品 #${item.id}`,
          date: new Date(item.created_at).getFullYear().toString()
        }));
        setDynamicWorks(formatted);

        const catsData: Category[] = await catsRes.json();
        setDbCategories(catsData);
      } catch (e) {
        console.error('Failed to fetch data:', e);
      }
    };

    fetchData();
  }, []);

  // Map DB categories to the UI format
  const uiCategories = [
    { label: '全部', value: '全部' },
    ...dbCategories.map(c => ({ label: c.name, value: c.slug }))
  ];

  // If dbCategories is empty (e.g. before migration or first run), fallback to defaults
  const categories = uiCategories.length > 1 ? uiCategories : [
    { label: '全部', value: '全部' },
    { label: '學生作品', value: 'student' },
    { label: '刺繡包/商品', value: 'products' },
    { label: '工作坊', value: 'workshop' },
  ];

  const staticWorks: WorkItem[] = [
    // STUDENT
    { src: '/images/works/student/01.jpg', category: 'student', title: '學生刺繡作品 #01', date: '2024' },
    { src: '/images/works/student/02.jpg', category: 'student', title: '學生刺繡作品 #02', date: '2024' },
    { src: '/images/works/student/03.jpg', category: 'student', title: '學生刺繡作品 #03', date: '2024' },
    { src: '/images/works/student/04.jpg', category: 'student', title: '學生刺繡作品 #04', date: '2024' },
    { src: '/images/works/student/05.jpg', category: 'student', title: '學生刺繡作品 #05', date: '2024' },
    { src: '/images/works/student/06.jpg', category: 'student', title: '學生刺繡作品 #06', date: '2024' },
    { src: '/images/works/student/07.jpg', category: 'student', title: '學生刺繡作品 #07', date: '2024' },
    { src: '/images/works/student/08.jpg', category: 'student', title: '學生刺繡作品 #08', date: '2024' },
    { src: '/images/works/student/09.jpg', category: 'student', title: '學生刺繡作品 #09', date: '2024' },
    
    // PRODUCTS
    { src: '/images/works/products/01.jpg', category: 'products', title: '訂製刺繡禮物 #01', date: '2025' },
    { src: '/images/works/products/02.jpg', category: 'products', title: '臘腸狗刺繡扣針', date: '2024' },
    { src: '/images/works/products/03.jpg', category: 'products', title: 'Fing尾貓刺繡', date: '2024' },
    { src: '/images/works/products/04.jpg', category: 'products', title: '煎餃刺繡小物', date: '2024' },
    { src: '/images/works/products/05.jpg', category: 'products', title: '狐狸刺繡扣針', date: '2024' },
    { src: '/images/works/products/06.jpg', category: 'products', title: '訂製刺繡禮物 #02', date: '2025' },
    { src: '/images/works/products/07.jpg', category: 'products', title: '訂製刺繡禮物 #03', date: '2025' },
    { src: '/images/works/products/08.jpg', category: 'products', title: '訂製刺繡禮物 #04', date: '2025' },
    { src: '/images/works/products/09.jpg', category: 'products', title: '訂製刺繡禮物 #05', date: '2025' },

    // WORKSHOP
    { src: '/images/works/workshop/01.jpg', category: 'workshop', title: '駐場刺繡紀錄 #01', date: '2025' },
    { src: '/images/works/workshop/02.jpg', category: 'workshop', title: '外展刺繡教學', date: '2024' },
    { src: '/images/works/workshop/03.jpg', category: 'workshop', title: '可麗露刺繡班', date: '2024' },
    { src: '/images/works/workshop/04.jpg', category: 'workshop', title: '私人班/團體課', date: '2024' },
    { src: '/images/works/workshop/05.jpg', category: 'workshop', title: '刺繡手作體驗 #01', date: '2024' },
    { src: '/images/works/workshop/06.jpg', category: 'workshop', title: '刺繡手作體驗 #02', date: '2024' },
    { src: '/images/works/workshop/07.jpg', category: 'workshop', title: '刺繡手作體驗 #03', date: '2024' },
    { src: '/images/works/workshop/08.jpg', category: 'workshop', title: '刺繡手作體驗 #04', date: '2024' },
    { src: '/images/works/workshop/09.jpg', category: 'workshop', title: '刺繡手作體驗 #05', date: '2024' },
    
    // HERO (can also be shown)
    { src: '/images/works/hero/01.jpg', category: 'workshop', title: '基礎針法班教學', date: '2024' },
    { src: '/images/works/hero/02.jpg', category: 'workshop', title: '品牌故事紀錄', date: '2024' },
  ];

  const allWorks = [...dynamicWorks, ...staticWorks];

  const filteredWorks = activeCategory === '全部' 
    ? allWorks 
    : allWorks.filter(w => w.category === activeCategory);

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

        {/* Works Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredWorks.map((work, i) => (
            <div key={i} className="group animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-[4/5] overflow-hidden mb-6 rounded-2xl shadow-sm relative bg-gray-50">
                <img 
                  src={work.src} 
                  alt={work.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
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
