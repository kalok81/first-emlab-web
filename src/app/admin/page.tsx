'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Trash2, Upload, LogOut, Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [works, setWorks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Category Management State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWorks();
      fetchCategories();
    }
  }, [isLoggedIn]);

  const fetchWorks = async () => {
    const res = await fetch('/api/works');
    const data = await res.json();
    if (Array.isArray(data)) {
      setWorks(data);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    if (Array.isArray(data)) {
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].slug);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'emlab2025') {
      setIsLoggedIn(true);
    } else {
      alert('密碼錯誤');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsUploading(true);
    setMessage('正在上傳...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64data = reader.result;
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: selectedCategory,
            image_data: base64data,
          }),
        });

        if (res.ok) {
          setMessage('上傳成功！');
          setImage(null);
          setPreview(null);
          fetchWorks();
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('上傳失敗');
        }
        setIsUploading(false);
      };
    } catch (error) {
      console.error(error);
      setMessage('發生錯誤');
      setIsUploading(false);
    }
  };

  const handleDeleteWork = async (id: number) => {
    if (!confirm('確定要刪除此作品嗎？')) return;

    const res = await fetch(`/api/works?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchWorks();
    } else {
      alert('刪除失敗');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName, slug: newCatSlug }),
    });

    if (res.ok) {
      setNewCatName('');
      setNewCatSlug('');
      fetchCategories();
      setShowCatModal(false);
    } else {
      alert('新增失敗');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('確定要刪除此分類嗎？')) return;

    const res = await fetch(`/api/admin/categories?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchCategories();
    } else {
      alert('刪除失敗');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
              <ImageIcon className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-slate-800 text-center">CMS Admin</h1>
          <p className="text-slate-500 text-center mb-8">請登入以管理作品集</p>
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密碼"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
            >
              登入系統
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ImageIcon className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">EM Lab <span className="text-blue-600">CMS</span></span>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setShowCatModal(true)}
              className="text-sm font-medium flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> 分類管理
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-sm font-medium text-slate-500 flex items-center gap-1.5 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" /> 登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" /> 上傳新作品
              </h2>
              
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">作品分類</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">圖片文件</label>
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {preview ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-400">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-slate-600">
                          {isDragActive ? '放開以選擇圖片' : '點擊或拖放圖片至此'}
                        </p>
                        <p className="text-xs text-slate-400">支援 JPG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading || !image}
                  className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  {isUploading ? '正在上傳...' : '新增至作品集'}
                </button>
              </form>
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                現有作品 <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{works.length}</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {works.map((work) => (
                <div key={work.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group relative hover:shadow-md transition-all">
                  <div className="aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={work.image_data}
                      alt={work.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteWork(work.id)}
                      className="bg-white text-red-600 p-3 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 shadow-lg"
                      title="刪除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3 flex justify-between items-center bg-white border-t border-slate-50">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{work.category}</span>
                    <span className="text-[10px] text-slate-300">{new Date(work.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {works.length === 0 && (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center text-slate-400 space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto opacity-20" />
                <p>尚無作品作品集，開始上傳吧！</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">分類管理</h3>
              <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* New Category Form */}
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">顯示名稱</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. 成品"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Slug (URL用)</label>
                    <input
                      type="text"
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      placeholder="e.g. products"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                >
                  <Plus className="w-4 h-4" /> 新增分類
                </button>
              </form>

              {/* Category List */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 ml-1">目前分類</label>
                <div className="divide-y divide-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-3 flex justify-between items-center bg-white group hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="font-bold text-sm text-slate-700">{cat.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{cat.slug}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-2"
                        title="刪除分類"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowCatModal(false)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
