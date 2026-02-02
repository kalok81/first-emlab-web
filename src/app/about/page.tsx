'use client';

export const runtime = 'edge';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';


export default function AboutPage() {
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to fetch content', err));
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section - Refined with Glassmorphism */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/works/hero/01.jpg"
          alt="First Embroidery 初刺"
          fill
          className="object-cover opacity-80"
          priority unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-background" />
        <div className="relative text-center p-12 glass-card rounded-3xl animate-fade-up">
          <span className="text-accent uppercase tracking-[0.5em] text-xs font-bold mb-6 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl mb-6 tracking-widest font-serif text-primary">
            關於初刺
          </h1>
          <div className="w-24 h-0.5 bg-accent/30 mx-auto" />
        </div>
      </section>

      {/* Founder Section - More Premium */}
      <section className="py-32 max-w-6xl mx-auto px-6 washi-texture">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 animate-fade-up">
            <div>
              <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold mb-6 block">The Founder</span>
              <h2 className="text-5xl font-serif text-primary leading-tight">羅家寶<br />KAME LAW</h2>
            </div>
            <div className="space-y-8 text-xl leading-[2] text-primary/70 font-light whitespace-pre-wrap italic">
              {content.about_bio ? (
                <p>{content.about_bio}</p>
              ) : (
                <>
                  <p>
                    「刺繡對我而言，不只是在布料上的創作，更是一種與自己對話的方式。」
                  </p>
                  <p className="not-italic">
                    香港刺繡家、「初刺」品牌創辦人。自 2019 年開始，專注推廣手工刺繡文化，將這份指尖的溫度帶進大眾的生活。
                  </p>
                </>
              )}
            </div>
            <div className="pt-8">
               <div className="w-48 h-px bg-accent/20" />
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-japanese animate-fade-up stagger-2">
            <Image 
              src="/images/works/workshop/01.jpg"
              alt="Kame Law - Founder of First Embroidery"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105" unoptimized
            />
          </div>
        </div>
      </section>

      {/* Brand Story - Immersive */}
      <section className="bg-primary text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full washi-texture opacity-10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-12">
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest leading-tight">以刺繡，點綴日常<br /><span className="text-secondary text-2xl opacity-60">EMBROIDER YOUR DAILY LIFE</span></h2>
          <div className="space-y-10 text-xl md:text-2xl leading-[1.8] text-white/80 font-light">
            <p>「初刺」位於香港觀塘的一個溫馨角落。我們相信每一件作品都從一個故事開始。</p>
            <p>無論是想記錄重要時刻、保留寵物回憶，或為品牌客製獨特禮物，「初刺」都可以將你的想法轉化成精緻的刺繡作品。</p>
            <p>未來，我們希望持續以刺繡為媒介，連結更多社群與文化項目，讓手工藝術在城市中延伸出新的溫度與故事。</p>
          </div>
        </div>
      </section>

      {/* Details Grid - Minimalist Cards */}
      <section className="py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: "🪡", title: "刺繡工作坊", desc: "提供不同程度的課程，帶領你進入手作的世界。" },
              { icon: "✨", title: "駐場服務", desc: "為品牌活動、市集提供即場客製化刺繡。" },
              { icon: "🎁", title: "私人訂製", desc: "人像、寵物及品牌禮贈品客製化服務。" },
              { icon: "🧵", title: "材料販售", desc: "嚴選優質材料與工具，讓你在家也能創作。" }
            ].map((item, i) => (
              <div key={i} className="group p-8 glass-card rounded-3xl text-center transition-all hover:-translate-y-3 hover:shadow-japanese animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-xl mb-4 font-serif text-primary">{item.title}</h3>
                <p className="text-primary/60 text-sm leading-loose font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Clean & Geometric */}
      <section className="py-32 washi-texture border-t border-accent/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-accent uppercase tracking-[0.5em] text-xs font-bold mb-8 block">Contact Us</span>
          <h2 className="text-4xl font-serif text-primary mb-16">與我們聯絡</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left bg-white/50 p-12 rounded-[2rem] shadow-sm">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Studio Address</span>
                <p className="text-primary/80 font-light">1101B15, 11/F, Yau Lee Centre, 45 Hoi Yuen Road, Kwun Tong</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Email Inquiry</span>
                <p className="text-primary/80 font-light">first.embroidery2019@gmail.com</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Phone / WhatsApp</span>
                <p className="text-primary/80 font-light">+852 6573 0303</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Instagram</span>
                <p className="text-primary/80 font-light">@first.emlab</p>
              </div>
            </div>
          </div>
          <div className="mt-16 animate-float">
            <p className="text-secondary/60 italic font-light tracking-widest text-sm">歡迎預約參觀或參加工作坊，感受指尖上的安靜時光。</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
