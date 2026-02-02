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
      
      <section className="bg-secondary text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-serif">刺繡工作坊 & 課程</h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto px-6">在紛擾的城市中，找尋指尖的寧靜。我們提供多元化刺繡體驗。</p>
      </section>

      {loading ? (
        <div className="text-center py-24">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 opacity-40">載入中...</p>
        </div>
      ) : (
        <section className="py-24 max-w-5xl mx-auto px-6">
          <div className="space-y-24">
            {workshops.map((ws, i) => (
              <div key={ws.id} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl bg-gray-50">
                    {ws.image_url ? (
                      <img src={ws.image_url} alt={ws.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <h2 className="text-3xl font-serif">{ws.title}</h2>
                  <p className="text-lg opacity-80 leading-relaxed whitespace-pre-wrap">{ws.description}</p>
                  <div className="flex gap-8 text-sm border-y border-accent/10 py-4">
                    {ws.duration && (
                      <div>
                        <span className="block font-bold">時長</span>
                        <span className="opacity-60">{ws.duration}</span>
                      </div>
                    )}
                    {ws.price && (
                      <div>
                        <span className="block font-bold">費用</span>
                        <span className="opacity-60">{ws.price}</span>
                      </div>
                    )}
                  </div>
                  {ws.form_url ? (
                    <a 
                      href={ws.form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-foreground text-background px-10 py-3 rounded-full hover:bg-accent hover:text-white transition-all"
                    >
                      立即預約
                    </a>
                  ) : (
                    <button className="bg-foreground text-background px-10 py-3 rounded-full opacity-50 cursor-not-allowed">
                      即將開放
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {workshops.length === 0 && (
            <div className="text-center py-20 opacity-40 italic">
              目前暫無開放中的工作坊
            </div>
          )}
        </section>
      )}

      {/* Inquiry Footer */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl mb-8 font-serif">需要度身訂製的課程或服務？</h2>
        <p className="text-xl opacity-70 mb-12">歡迎與我們聯絡，商討最適合你的方案。</p>
        <a 
          href="https://wa.me/85265730303" 
          className="inline-block bg-secondary text-white px-12 py-4 rounded-full text-lg hover:bg-accent transition-colors"
        >
          WhatsApp 查詢
        </a>
      </section>

      <Footer />
    </main>
  );
}
