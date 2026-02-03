'use client';

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Loader2, Search } from 'lucide-react';
import { Button, Card, Input } from '@/components/AdminUI';

interface ImagePickerProps {
  onSelect: (work: any) => void;
  onClose: () => void;
}

export default function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
  const [works, setWorks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/works');
      const data = await res.json();
      if (Array.isArray(data)) {
        setWorks(data);
      }
    } catch (error) {
      console.error('Failed to fetch works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorks = works.filter(work => 
    work.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl max-h-[80vh] flex flex-col !p-0 overflow-hidden shadow-2xl border border-white/40 animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="p-6 border-b border-secondary/20 flex justify-between items-center bg-secondary/5">
          <div>
            <h3 className="font-bold text-xl text-primary">選擇圖片</h3>
            <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest mt-1">Select from portfolio</p>
          </div>
          <button onClick={onClose} className="bg-white p-2 rounded-full shadow-sm text-primary/40 hover:text-highlight transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-white/50 border-b border-secondary/10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
            <Input 
              placeholder="搜尋分類..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
              <p className="text-sm font-medium text-primary/40 uppercase tracking-widest">Loading Library...</p>
            </div>
          ) : filteredWorks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredWorks.map((work) => (
                <div 
                  key={work.id} 
                  onClick={() => onSelect(work)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-secondary/10 cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                >
                  <img 
                    src={work.image_data} 
                    alt={work.category} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">選取</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-[9px] text-white font-medium truncate">{work.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="w-12 h-12 mx-auto text-secondary mb-3 opacity-30" />
              <p className="text-primary/40 font-medium">找不到相符的圖片</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-secondary/20 bg-secondary/5 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            取消
          </Button>
        </div>
      </Card>
    </div>
  );
}
