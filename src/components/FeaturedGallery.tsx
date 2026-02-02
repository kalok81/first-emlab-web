'use client';

import React from 'react';

export default function FeaturedGallery({ content = {} }: { content?: any }) {
  const items = [
    { src: content.featured_img_1 || "/images/works/student/02.jpg", span: "" },
    { src: content.featured_img_2 || "/images/works/products/03.jpg", span: "md:row-span-2" },
    { src: content.featured_img_3 || "/images/works/workshop/02.jpg", span: "" },
    { src: content.featured_img_4 || "/images/works/student/03.jpg", span: "" },
    { src: content.featured_img_5 || "/images/works/products/04.jpg", span: "" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div key={i} className={`overflow-hidden rounded-xl ${item.span}`}>
          <img 
            src={item.src} 
            alt="Featured work"
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
