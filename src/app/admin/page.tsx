'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Work {
  id: number;
  category: string;
  image_data: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // upload, manage, categories
  const [works, setWorks] = useState<Work[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Tab States
  const [uploadFiles, setUploadFiles] = useState<{ file: File; preview: string; category: string }[]>([]);
  const [globalCategory, setGlobalCategory] = useState('');
  const [uploading, setUploading] = useState(false);

  // Category Tab States
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword === 'admin') {
      setIsAuthenticated(true);
      setPassword(savedPassword);
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchWorks(), fetchCategories()]);
    setLoading(false);
  };

  const fetchWorks = async () => {
    try {
      const res = await fetch('/api/works');
      const data = await res.json();
      setWorks(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
      if (data.length > 0 && !globalCategory) {
        setGlobalCategory(data[0].slug);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      localStorage.setItem('admin_password', password);
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      alert('Wrong password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_password');
    setIsAuthenticated(false);
  };

  // --- Upload Logic ---
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [globalCategory]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newUploads = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      category: globalCategory
    }));
    setUploadFiles(prev => [...prev, ...newUploads]);
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const updateFileCategory = (index: number, cat: string) => {
    setUploadFiles(prev => {
      const next = [...prev];
      next[index].category = cat;
      return next;
    });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const batchUpload = async () => {
    if (uploadFiles.length === 0) return;
    setUploading(true);
    try {
      const items = await Promise.all(uploadFiles.map(async (u) => ({
        category: u.category,
        image: await compressImage(u.file)
      })));

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify(items),
      });

      if (res.ok) {
        alert('Upload successful');
        setUploadFiles([]);
        fetchWorks();
        setActiveTab('manage');
      } else {
        alert('Upload failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error uploading');
    } finally {
      setUploading(false);
    }
  };

  // --- Manage Logic ---
  const handleDeleteWork = async (id: number) => {
    if (!confirm('Are you sure you want to delete this work?')) return;
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchWorks();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Category Logic ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({ name: newCatName, slug: newCatSlug }),
      });
      if (res.ok) {
        setNewCatName('');
        setNewCatSlug('');
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure? This will not delete the works in this category but might make them hard to filter.')) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif">Loading CMS 2.0...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-neutral-200">
          <h1 className="text-3xl font-serif font-bold text-center mb-8 text-neutral-800">CMS 2.0 Admin</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 border border-neutral-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transform active:scale-95 transition-all shadow-lg"
            >
              Enter Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-900">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Portfolio Management</h1>
            <p className="text-neutral-500">Version 2.0 Pro - Category & Bulk Uploads</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
          >
            Exit Admin
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-neutral-200 p-1 rounded-2xl mb-8 w-fit">
          {[
            { id: 'upload', label: 'Batch Upload' },
            { id: 'manage', label: 'Work Library' },
            { id: 'categories', label: 'Categories' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                ? 'bg-white shadow-sm text-neutral-900' 
                : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="bg-white border-2 border-dashed border-neutral-300 rounded-3xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all group"
            >
              <div className="max-w-xs mx-auto">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <p className="text-neutral-700 font-medium mb-1">Drag & drop images here</p>
                <p className="text-neutral-400 text-sm mb-6">or click to browse from computer</p>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  id="file-upload" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <label 
                  htmlFor="file-upload"
                  className="inline-block px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  Select Files
                </label>
              </div>
            </div>

            {uploadFiles.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Queue ({uploadFiles.length})</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-500 font-medium whitespace-nowrap">Bulk Category:</span>
                      <select 
                        value={globalCategory}
                        onChange={(e) => {
                          setGlobalCategory(e.target.value);
                          setUploadFiles(prev => prev.map(f => ({ ...f, category: e.target.value })));
                        }}
                        className="text-sm border-neutral-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>
                    <button 
                      onClick={batchUpload}
                      disabled={uploading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-200"
                    >
                      {uploading ? 'Uploading...' : 'Publish All'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {uploadFiles.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-100 shadow-inner">
                        <img src={item.preview} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeUploadFile(idx)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                        >
                          &times;
                        </button>
                      </div>
                      <select 
                        value={item.category}
                        onChange={(e) => updateFileCategory(idx, e.target.value)}
                        className="mt-2 w-full text-xs border-none bg-neutral-100 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manage */}
        {activeTab === 'manage' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Work Library ({works.length})</h3>
              <div className="flex space-x-2">
                {/* Optional filters could go here */}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {works.map((work) => (
                <div key={work.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={work.image_data} 
                      alt={work.category} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <span className="inline-block px-2 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-500 rounded-md">
                      {work.category}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteWork(work.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === 'categories' && (
          <div className="max-w-2xl animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Create New Category</h3>
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (!newCatSlug) setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Student Work"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Slug (URL key)</label>
                  <input
                    type="text"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. student"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 text-white py-2.5 rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
              <h3 className="text-lg font-bold p-8 border-b border-neutral-100">Existing Categories</h3>
              <div className="divide-y divide-neutral-100">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center p-6 hover:bg-neutral-50 transition-colors">
                    <div>
                      <p className="font-bold text-neutral-800">{cat.name}</p>
                      <p className="text-sm text-neutral-400">slug: {cat.slug}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
