'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [address, setAddress] = useState('觀塘興業街 (請至後台更新)');
  const [phone, setPhone] = useState('WhatsApp 查詢');
  const [email, setEmail] = useState('first.embroidery2019@gmail.com');
  const [footerText, setFooterText] = useState(`© ${new Date().getFullYear()} First Embroidery 初刺. All rights reserved.`);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content', { cache: 'no-store' });
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        
        if (data.footer_address !== null && data.footer_address !== undefined) setAddress(data.footer_address);
        if (data.footer_phone !== null && data.footer_phone !== undefined) setPhone(data.footer_phone);
        if (data.footer_email !== null && data.footer_email !== undefined) setEmail(data.footer_email);
        if (data.footer_text !== null && data.footer_text !== undefined) setFooterText(data.footer_text);
      } catch (err) {
        console.error('Failed to fetch footer content', err);
      }
    };

    fetchContent();
  }, []);

  return (
    <footer className="bg-[#4A3728] text-[#F9F6F1] py-20 washi-texture relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif tracking-wide">First Embroidery 初刺</h3>
            <p className="text-sm opacity-70 leading-relaxed font-light">
              學會刺繡，也學會過溫暖的日子。<br />
              在指尖的起落間，找回生活的慢節奏。<br />
              工作室地點：{address}
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-secondary">探索課程</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="/workshop" className="opacity-70 hover:opacity-100 hover:text-secondary transition-all">工作坊 Workshops</a></li>
              <li><a href="/works" className="opacity-70 hover:opacity-100 hover:text-secondary transition-all">作品集 Gallery</a></li>
              <li><a href="/kits" className="opacity-70 hover:opacity-100 hover:text-secondary transition-all">刺繡材料包 Kits</a></li>
              <li><a href="/about" className="opacity-70 hover:opacity-100 hover:text-secondary transition-all">關於我們 About</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-secondary">聯絡我們</h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <a href="https://instagram.com/first.embroidery" target="_blank" className="opacity-70 hover:opacity-100 flex items-center gap-2 group">
                  <span className="w-5 h-0.5 bg-secondary/30 group-hover:w-8 transition-all"></span>
                  Instagram
                </a>
              </li>
              <li>
                {phone ? (
                  <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} target="_blank" className="opacity-70 hover:opacity-100 flex items-center gap-2 group">
                    <span className="w-5 h-0.5 bg-secondary/30 group-hover:w-8 transition-all"></span>
                    WhatsApp: {phone}
                  </a>
                ) : (
                  'WhatsApp'
                )}
              </li>
              <li>
                {email ? (
                  <a href={`mailto:${email}`} className="opacity-70 hover:opacity-100 flex items-center gap-2 group">
                    <span className="w-5 h-0.5 bg-secondary/30 group-hover:w-8 transition-all"></span>
                    Email: {email}
                  </a>
                ) : (
                  'Email'
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-40">
          <div>{footerText}</div>
          <div className="flex gap-6">
            <span>Designed with Heart in HK</span>
            <span>Est. 2019</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
