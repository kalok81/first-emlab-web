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
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-serif mb-4">First Embroidery 初刺</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            學會刺繡，也學會過溫暖的日子。<br />
            工作室地點：{address}
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="/workshop">Workshops</a></li>
            <li><a href="/works">Recent Works</a></li>
            <li><a href="/kits">DIY Kits</a></li>
            <li><a href="/custom">Custom Orders</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Connect</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li>
              {phone ? (
                <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp: {phone}
                </a>
              ) : (
                'WhatsApp'
              )}
            </li>
            <li>
              {email ? (
                <a href={`mailto:${email}`}>
                  Email: {email}
                </a>
              ) : (
                'Email'
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-background/10 text-center text-xs opacity-50">
        {footerText}
      </div>
    </footer>
  );
}
