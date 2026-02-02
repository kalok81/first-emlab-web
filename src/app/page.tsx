'use client';

export const runtime = 'edge';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
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
      
      {/* Hero Section - Refined with Float & Fade-Up */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/works/hero/01.jpg"
          alt="初刺刺繡 - 學會刺繡，也學會過溫暖的日子"
          fill
          className="object-cover opacity-90 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        
        <div className="relative text-center text-white px-6 max-w-4xl">
          <div className="animate-fade-up">
            <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-xs uppercase tracking-[0.3em] mb-8 backdrop-blur-sm">
              Est. 2019 • Hong Kong
            </span>
            <h1 className="text-5xl md:text-7xl mb-8 tracking-wider font-serif leading-tight drop-shadow-2xl">
              {content.hero_title || '學會刺繡，也學會溫柔地過日子'}
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              在大忙的世界裡，找回指尖上的安靜時光
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/workshop" className="group bg-white text-primary px-10 py-4 rounded-full font-medium transition-all hover:bg-secondary hover:text-white hover:shadow-2xl hover:-translate-y-1">
                探索工作坊
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/works" className="group bg-black/20 text-white border border-white/40 px-10 py-4 rounded-full font-medium backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-2xl hover:-translate-y-1">
                查看作品集
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-0.5 h-16 bg-gradient-to-b from-white to-transparent opacity-50" />
        </div>
      </section>

      {/* About Section - Minimalist Japanese style */}
      <section className="py-32 relative overflow-hidden washi-texture">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Our Story</span>
          <h2 className="text-4xl md:text-5xl mb-12 font-serif text-primary">關於初刺</h2>
          <div className="space-y-8 text-xl leading-loose opacity-80 whitespace-pre-wrap font-light max-w-2xl mx-auto">
            {content.about_bio ? (
              <p>{content.about_bio}</p>
            ) : (
              <>
                <p className="animate-fade-up stagger-1">
                  「初刺」位於觀塘興業街的一個溫馨角落。我們相信刺繡不只是一種手工藝，更是一種心靈的療癒。
                </p>
                <p className="animate-fade-up stagger-2">
                  每一針每一線，都是對美好生活的細膩刻畫。在這裡，你不需要任何基礎，只需要帶著一顆想要安靜下來的心。
                </p>
              </>
            )}
          </div>
          <div className="mt-16 animate-fade-up stagger-3">
             <Link href="/about" className="text-accent border-b border-accent/30 pb-1 hover:border-accent transition-all tracking-widest text-sm">
                了解更多故事 READ MORE
             </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid - Pro Max Design */}
      <section className="bg-secondary/5 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard 
              title="刺繡工作坊" 
              desc="從零開始，體驗刺繡之美" 
              href="/workshop"
              image="/images/works/workshop/01.jpg"
              index={1}
            />
            <CategoryCard 
              title="作品集" 
              desc="我們最近的故事與創作" 
              href="/works"
              image="/images/works/student/01.jpg"
              index={2}
            />
            <CategoryCard 
              title="材料包" 
              desc="將溫暖帶回家延續" 
              href="/kits"
              image="/images/works/products/01.jpg"
              index={3}
            />
            <CategoryCard 
              title="訂製服務" 
              desc="為你的故事量身打造" 
              href="/custom"
              image="/images/works/products/02.jpg"
              index={4}
            />
          </div>
        </div>
      </section>

      {/* Featured Gallery - Masonry-like & Refined */}
      <section className="py-32 washi-texture">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-accent uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Portfolio</span>
              <h2 className="text-4xl font-serif text-primary">近期作品 Featured</h2>
            </div>
            <Link href="/works" className="hidden md:block text-sm tracking-widest text-accent hover:text-primary transition-colors border-b border-accent/20 pb-1">
              VIEW ALL GALLERY
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { src: "/images/works/student/02.jpg", span: "" },
              { src: "/images/works/products/03.jpg", span: "md:row-span-2" },
              { src: "/images/works/workshop/02.jpg", span: "" },
              { src: "/images/works/student/03.jpg", span: "" },
              { src: "/images/works/products/04.jpg", span: "" },
              { src: "/images/works/workshop/03.jpg", span: "" }
            ].map((item, i) => (
              <div key={i} className={`group overflow-hidden relative rounded-xl shadow-sm ${item.span}`}>
                <img 
                  src={item.src} 
                  alt="Embroidery work"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
                      <span className="text-primary text-xl">+</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center md:hidden">
            <Link href="/works" className="bg-primary text-white px-8 py-3 rounded-full text-sm tracking-widest">
              查看更多作品
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function CategoryCard({ title, desc, href, image, index }: { title: string, desc: string, href: string, image: string, index: number }) {
  return (
    <Link href={href} className={`group relative block aspect-[3/4.5] overflow-hidden rounded-2xl shadow-japanese transition-all hover:-translate-y-3 animate-fade-up stagger-${index}`}>
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h3 className="text-2xl mb-3 font-serif text-white tracking-wide">{title}</h3>
        <p className="text-sm text-white/80 font-light leading-relaxed transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">{desc}</p>
        <div className="mt-6 w-8 h-0.5 bg-accent group-hover:w-full transition-all duration-700" />
      </div>
    </Link>
  );
}
