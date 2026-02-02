'use client';

import React from 'react';

export default function FeaturedGallery({ content = {}, isLoading = false }: { content?: any, isLoading?: boolean }) {
  const items = [
    { src: content.featured_img_1, span: "" },
    { src: content.featured_img_2, span: "md:row-span-2" },
    { src: content.featured_img_3, span: "" },
    { src: content.featured_img_4, span: "" },
    { src: content.featured_img_5, span: "" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div key={i} className={`overflow-hidden rounded-xl bg-neutral-100 ${item.span} aspect-square md:aspect-auto`}>
          {isLoading ? (
            <div className="w-full h-full bg-neutral-200 animate-pulse" />
          ) : (
            <img 
              src={item.src || ""} 
              alt="Featured work"
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          )}
        </div>
      ))}
    </div>
  );
}
