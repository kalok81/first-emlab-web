'use client';

export const runtime = 'edge';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

interface WorkshopData {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  form_url: string;
}

export default function Workshop() {
  const [workshops, setWorkshops] = useState<WorkshopData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/workshops');
        const data = await res.json();
        if (Array.isArray(data)) {
          setWorkshops(data);
        }
      } catch (e) {
        console.error('Failed to fetch workshop data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="relative bg-secondary py-32 text-center overflow-hidden washi-texture">
        <div className="absolute inset-0 bg-primary/5 opacity-50" />
        <div className="relative z-10 animate-fade-up">
          <span className="text-white/60 uppercase tracking-[0.5em] text-xs font-bold mb-6 block">Our Classes</span>
          <h1 className="text-5xl md:text-6xl mb-8 font-serif text-white tracking-wider">刺繡工作坊 & 課程</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto px-6 font-light leading-relaxed">
            在紛擾的城市中，找尋指尖的寧靜。<br />我們提供多元化刺繡體驗，從基礎到進階。
          </p>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-32">
          <div className="inline-block w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-accent tracking-widest text-xs uppercase">Loading Workshops...</p>
        </div>
      ) : (
        <section className="py-32 max-w-6xl mx-auto px-6">
          <div className="space-y-32">
            {workshops.map((ws, i) => (
              <div 
                key={ws.id} 
                className={`flex flex-col md:flex-row gap-16 items-center animate-fade-up`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className={`flex-1 w-full ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-accent/5 rounded-[2rem] transform rotate-3 transition-transform group-hover:rotate-0 duration-700" />
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-japanese bg-white transition-transform duration-700 group-hover:-translate-y-2">
                      {ws.image_url ? (
                        <img src={ws.image_url} alt={ws.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 font-serif">
                          EMBROIDERY IMAGE
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase">Workshop #{i + 1}</span>
                    <h2 className="text-4xl font-serif text-primary leading-tight">{ws.title}</h2>
                  </div>
                  <p className="text-lg text-primary/70 leading-relaxed font-light whitespace-pre-wrap">{ws.description}</p>
                  
                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-primary/5">
                    {ws.duration && (
                      <div className="space-y-1">
                        <span className="block text-[10px] uppercase tracking-widest font-bold text-accent">時長 DURATION</span>
                        <span className="text-primary font-serif">{ws.duration}</span>
                      </div>
                    )}
                    {ws.price && (
                      <div className="space-y-1">
                        <span className="block text-[10px] uppercase tracking-widest font-bold text-accent">費用 PRICE</span>
                        <span className="text-primary font-serif">{ws.price}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    {ws.form_url ? (
                      <a 
                        href={ws.form_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-4 bg-primary text-white px-12 py-4 rounded-full hover:bg-accent transition-all hover:shadow-2xl hover:-translate-y-1"
                      >
                        <span className="font-medium tracking-widest">立即預約 BOOK NOW</span>
                        <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                      </a>
                    ) : (
                      <button className="bg-primary/20 text-primary/40 px-12 py-4 rounded-full tracking-widest cursor-not-allowed">
                        即將開放 COMING SOON
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {workshops.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed border-accent/10 rounded-3xl">
              <p className="opacity-40 italic tracking-widest">目前暫無開放中的工作坊 NO ACTIVE WORKSHOPS</p>
            </div>
          )}
        </section>
      )}

      {/* Inquiry Footer - Refined */}
      <section className="py-32 bg-primary/5 text-center px-6 relative overflow-hidden washi-texture">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-accent/30" />
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-serif text-primary">需要度身訂製的課程或服務？</h2>
          <p className="text-xl text-primary/60 font-light max-w-2xl mx-auto">
            我們為不同機構、企業及私人團體提供量身設計的刺繡體驗。<br />歡迎與我們聯絡，商討最適合你的方案。
          </p>
          <div className="pt-8">
            <a 
              href="https://wa.me/85265730303" 
              className="inline-block bg-accent text-white px-16 py-4 rounded-full text-lg tracking-widest transition-all hover:bg-primary hover:shadow-2xl hover:-translate-y-1"
            >
              WHATSAPP 查詢
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
