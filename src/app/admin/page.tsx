'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Trash2, Upload, LogOut, Plus, X, Image as ImageIcon, Loader2, Edit2, Settings, BookOpen, LayoutDashboard } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'workshops' | 'content'>('portfolio');
  
  // Portfolio State
  const [works, setWorks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  // Workshops State
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [workshopModal, setWorkshopModal] = useState<{ show: boolean, mode: 'add' | 'edit', data?: any }>({ show: false, mode: 'add' });
  const [wsFormData, setWsFormData] = useState({ id: null, title: '', description: '', price: '', duration: '', image_url: '', form_url: '' });

  // Site Content State
  const [siteContent, setSiteContent] = useState<any>({ hero_title: '', about_bio: '', footer_text: '' });
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWorks();
      fetchCategories();
      fetchWorkshops();
      fetchContent();
    }
  }, [isLoggedIn]);

  const fetchWorks = async () => {
    const res = await fetch('/api/works');
    const data = await res.json();
    if (Array.isArray(data)) setWorks(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    if (Array.isArray(data)) {
      setCategories(data);
      if (data.length > 0 && !selectedCategory) setSelectedCategory(data[0].slug);
    }
  };

  const fetchWorkshops = async () => {
    const res = await fetch('/api/workshops');
    const data = await res.json();
    if (Array.isArray(data)) setWorkshops(data);
  };

  const fetchContent = async () => {
    const res = await fetch('/api/content');
    const data = await res.json();
    if (data && !data.error) setSiteContent(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'emlab2025') {
      setIsLoggedIn(true);
    } else {
      alert('密碼錯誤');
    }
  };

  // Portfolio Handlers
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
          body: JSON.stringify({ category: selectedCategory, image_data: base64data }),
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
      setMessage('發生錯誤');
      setIsUploading(false);
    }
  };

  const handleDeleteWork = async (id: number) => {
    if (!confirm('確定要刪除此作品嗎？')) return;
    const res = await fetch(`/api/works?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchWorks();
  };

  // Workshop Handlers
  const openWorkshopModal = (mode: 'add' | 'edit', data?: any) => {
    setWorkshopModal({ show: true, mode, data });
    if (mode === 'edit' && data) {
      setWsFormData(data);
    } else {
      setWsFormData({ id: null, title: '', description: '', price: '', duration: '', image_url: '', form_url: '' });
    }
  };

  const handleWorkshopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = workshopModal.mode === 'add' ? 'POST' : 'PUT';
    const res = await fetch('/api/workshops', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wsFormData),
    });
    if (res.ok) {
      fetchWorkshops();
      setWorkshopModal({ show: false, mode: 'add' });
    } else {
      alert('操作失敗');
    }
  };

  const handleDeleteWorkshop = async (id: number) => {
    if (!confirm('確定要刪除此課程嗎？')) return;
    const res = await fetch(`/api/workshops?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchWorkshops();
  };

  // Content Handlers
  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteContent),
    });
    if (res.ok) {
      alert('內容已更新');
    } else {
      alert('更新失敗');
    }
    setIsSavingContent(false);
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
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('確定要刪除此分類嗎？')) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchCategories();
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
          <h1 className="text-2xl font-bold mb-2 text-slate-800 text-center">EM Lab CMS</h1>
          <p className="text-slate-500 text-center mb-8">請登入以管理內容</p>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
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
              <Settings className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">EM Lab <span className="text-blue-600">CMS 3.0</span></span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'portfolio' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> 作品集
              </button>
              <button 
                onClick={() => setActiveTab('workshops')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'workshops' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <BookOpen className="w-4 h-4" /> 課程管理
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Settings className="w-4 h-4" /> 站點內容
              </button>
            </nav>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-sm font-medium text-slate-500 flex items-center gap-1.5 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" /> 登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" /> 上傳作品
                  </h2>
                  <button onClick={() => setShowCatModal(true)} className="text-xs text-blue-600 hover:underline">分類管理</button>
                </div>
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">作品分類</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}>
                    <input {...getInputProps()} />
                    {preview ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-400"><Upload className="w-6 h-6" /></div>
                        <p className="text-sm text-slate-600">點擊或拖放圖片</p>
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={isUploading || !image} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    新增至作品集
                  </button>
                </form>
                {message && <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">現有作品 <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{works.length}</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {works.map((work) => (
                  <div key={work.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group relative hover:shadow-md transition-all">
                    <img src={work.image_data} alt={work.category} className="aspect-square w-full object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => handleDeleteWork(work.id)} className="bg-white text-red-600 p-3 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 shadow-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="p-3 flex justify-between items-center bg-white border-t border-slate-50">
                      <span className="text-xs font-bold uppercase text-slate-400">{work.category}</span>
                      <span className="text-[10px] text-slate-300">{new Date(work.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workshops' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">課程管理</h2>
              <button 
                onClick={() => openWorkshopModal('add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                <Plus className="w-5 h-5" /> 新增課程
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {workshops.map((ws) => (
                <div key={ws.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {ws.image_url ? (
                      <img src={ws.image_url} alt={ws.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-slate-800">{ws.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1">{ws.description}</p>
                    <div className="flex gap-4 mt-2 text-xs font-bold">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{ws.price}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{ws.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openWorkshopModal('edit', ws)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteWorkshop(ws.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {workshops.length === 0 && <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">尚無課程資料</div>}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">站點內容編輯</h2>
            <form onSubmit={handleContentSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Hero Title (首頁標題)</label>
                <input 
                  type="text" 
                  value={siteContent.hero_title || ''} 
                  onChange={(e) => setSiteContent({...siteContent, hero_title: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">About Bio (關於我們)</label>
                <textarea 
                  rows={6}
                  value={siteContent.about_bio || ''} 
                  onChange={(e) => setSiteContent({...siteContent, about_bio: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Footer Text (頁尾資訊)</label>
                <input 
                  type="text" 
                  value={siteContent.footer_text || ''} 
                  onChange={(e) => setSiteContent({...siteContent, footer_text: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSavingContent}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                {isSavingContent ? <Loader2 className="w-5 h-5 animate-spin" /> : '儲存變更'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Workshop Modal */}
      {workshopModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">{workshopModal.mode === 'add' ? '新增課程' : '編輯課程'}</h3>
              <button onClick={() => setWorkshopModal({ ...workshopModal, show: false })} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleWorkshopSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500">課程名稱</label>
                  <input type="text" value={wsFormData.title} onChange={(e) => setWsFormData({...wsFormData, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">價格 (e.g. $500)</label>
                  <input type="text" value={wsFormData.price} onChange={(e) => setWsFormData({...wsFormData, price: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">時長 (e.g. 2 Hours)</label>
                  <input type="text" value={wsFormData.duration} onChange={(e) => setWsFormData({...wsFormData, duration: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500">圖片網址</label>
                  <input type="text" value={wsFormData.image_url} onChange={(e) => setWsFormData({...wsFormData, image_url: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="https://..." />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500">Google Form 連結</label>
                  <input type="text" value={wsFormData.form_url} onChange={(e) => setWsFormData({...wsFormData, form_url: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="https://forms.gle/..." />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500">課程描述</label>
                  <textarea rows={3} value={wsFormData.description} onChange={(e) => setWsFormData({...wsFormData, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setWorkshopModal({ ...workshopModal, show: false })} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all">取消</button>
                <button type="submit" className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">儲存課程</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal (Existing) */}
      {showCatModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">分類管理</h3>
              <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="顯示名稱" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <input type="text" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} placeholder="Slug" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"><Plus className="w-4 h-4" /> 新增分類</button>
              </form>
              <div className="divide-y divide-slate-50 border border-slate-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                {categories.map(cat => (
                  <div key={cat.id} className="p-3 flex justify-between items-center bg-white hover:bg-slate-50">
                    <div><div className="font-bold text-sm text-slate-700">{cat.name}</div><div className="text-xs text-slate-400">{cat.slug}</div></div>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-300 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
