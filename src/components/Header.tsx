'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setContent(data);
        }
      })
      .catch(err => console.error('Failed to fetch content:', err));
  }, []);

  const brand = content?.header_brand || 'First Embroidery 初刺';
  const navAbout = content?.header_nav_about || '關於我們';
  const navWorkshop = content?.header_nav_workshop || '刺繡課程';
  const navGallery = content?.header_nav_gallery || '作品集';
  const navKits = content?.header_nav_kits || '材料包';
  const buttonText = content?.header_button_text || '立即預約';

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-accent/10 animate-fade-up">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg md:text-xl font-serif font-bold tracking-tight text-primary hover:opacity-80 transition-opacity">
          {brand}
        </Link>
        <nav className="flex space-x-4 md:space-x-8 text-xs md:text-sm font-medium text-primary">
          <Link href="/about" className="hover:text-accent transition-colors relative group">
            {navAbout}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/workshop" className="hover:text-accent transition-colors relative group">
            {navWorkshop}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/works" className="hover:text-accent transition-colors relative group">
            {navGallery}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/kits" className="hover:text-accent transition-colors relative group">
            {navKits}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
        </nav>
        <Link 
          href="https://wa.me/85265730303" 
          target="_blank"
          className="hidden sm:block bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          {buttonText}
        </Link>
      </div>
    </header>
  );
}
