'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Trash2, Upload, LogOut, Plus, X, Image as ImageIcon, Loader2, Edit2, Settings, BookOpen, LayoutDashboard, Heart, Search } from 'lucide-react';
import { Button, Card, Input, Label } from '@/components/AdminUI';
import ImagePicker from '@/components/admin/ImagePicker';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'workshops' | 'kits' | 'content'>('portfolio');
  
  // Image Picker State
  const [pickerConfig, setPickerConfig] = useState<{ show: boolean, target: string } | null>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCat, setEditingCat] = useState<{ id: number, name: string } | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);

  // Workshops State
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [workshopModal, setWorkshopModal] = useState<{ show: boolean, mode: 'add' | 'edit', data?: any }>({ show: false, mode: 'add' });
  const [wsFormData, setWsFormData] = useState({ id: null, title: '', description: '', price: '', duration: '', image_url: '', form_url: '' });

  // Kits State
  const [products, setProducts] = useState<any[]>([]);
  const [productModal, setProductModal] = useState<{ show: boolean, mode: 'add' | 'edit', data?: any }>({ show: false, mode: 'add' });
  const [productFormData, setProductFormData] = useState({ id: null, title: '', price: '', description: '', image_url: '', buy_link: '' });

  // Site Content State
  const [siteContent, setSiteContent] = useState<any>({ 
    header_brand: '',
    header_nav_about: '',
    header_nav_workshop: '',
    header_nav_gallery: '',
    header_nav_kits: '',
    header_button_text: '',
    hero_title: '', 
    about_bio: '', 
    footer_text: '',
    footer_address: '',
    footer_phone: '',
    footer_email: '',
    footer_instagram: '',
    footer_facebook: ''
  });
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken === 'admin') {
      setPassword('admin');
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWorks();
      fetchCategories();
      fetchWorkshops();
      fetchProducts();
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

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
  };

  const fetchContent = async () => {
    const res = await fetch(`/api/content?t=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json();
    if (data && !data.error) setSiteContent((prev: any) => ({ ...prev, ...data }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      localStorage.setItem('admin_token', 'admin');
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
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': password
          },
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
    const res = await fetch(`/api/works?id=${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': password }
    });
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
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': password
      },
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
    const res = await fetch(`/api/workshops?id=${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': password }
    });
    if (res.ok) fetchWorkshops();
  };

  // Kits Handlers
  const openProductModal = (mode: 'add' | 'edit', data?: any) => {
    setProductModal({ show: true, mode, data });
    if (mode === 'edit' && data) {
      setProductFormData(data);
    } else {
      setProductFormData({ id: null, title: '', price: '', description: '', image_url: '', buy_link: '' });
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = productModal.mode === 'add' ? 'POST' : 'PUT';
    const res = await fetch('/api/products', {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': password
      },
      body: JSON.stringify(productFormData),
    });
    if (res.ok) {
      fetchProducts();
      setProductModal({ show: false, mode: 'add' });
    } else {
      alert('操作失敗');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('確定要刪除此材料包嗎？')) return;
    const res = await fetch(`/api/products?id=${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': password }
    });
    if (res.ok) fetchProducts();
  };

  // Content Handlers
  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': password
      },
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
    if (!newCatName.trim() || isAddingCategory) return;
    
    setIsAddingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': password
        },
        body: JSON.stringify({ name: newCatName }),
      });
      if (res.ok) {
        setNewCatName('');
        await fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error || '新增失敗');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('發生錯誤');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    const res = await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': password
      },
      body: JSON.stringify({ id: editingCat.id, name: editingCat.name }),
    });
    if (res.ok) {
      setEditingCat(null);
      fetchCategories();
    }
  };

  const handleImageSelect = (url: string) => {
    if (!pickerConfig) return;
    
    const { target } = pickerConfig;
    if (target === 'workshop') {
      setWsFormData(prev => ({ ...prev, image_url: url }));
    } else if (target === 'product') {
      setProductFormData(prev => ({ ...prev, image_url: url }));
    } else if (target.startsWith('card_image_')) {
      setSiteContent((prev: any) => ({ ...prev, [target]: url }));
    }
    
    setPickerConfig(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
        {/* Abstract Background Decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <Card className="w-full max-w-md relative z-10 p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-primary p-4 rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Heart className="text-secondary w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-primary tracking-tight">EM Lab</h1>
          <p className="text-primary/60 text-sm mb-10 italic">"Creating with heart, living with grace."</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-left">
              <Label>Secret Passcode</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="text-center tracking-widest"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              進入工作室
            </Button>
          </form>
          
          <p className="mt-12 text-[10px] text-primary/30 uppercase tracking-[0.2em]">
            Admin Control Panel v3.5 • Pro Max Edition
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 selection:bg-secondary/30 bg-transparent relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <Card className="!p-4 flex justify-between items-center bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl">
            <div className="flex items-center gap-3 ml-4">
              <div className="bg-primary p-2 rounded-xl shadow-lg rotate-3">
                <Settings className="text-secondary w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-primary tracking-tight block leading-none">EM Lab</span>
                <span className="text-[10px] text-primary/40 font-bold uppercase tracking-wider">Admin Pro Max</span>
              </div>
            </div>

            <div className="flex-1 flex justify-center px-2">
              <nav className="flex items-center justify-center gap-1 sm:gap-2 bg-primary/5 p-1.5 rounded-2xl flex-wrap backdrop-blur-sm border border-primary/5">
                {[
                  { id: 'portfolio', label: '作品集', icon: LayoutDashboard },
                  { id: 'workshops', label: '課程管理', icon: BookOpen },
                  { id: 'kits', label: '材料包 (Kits)', icon: Heart },
                  { id: 'content', label: '頁面內容', icon: Settings },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`whitespace-nowrap px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 flex-shrink-0 ${activeTab === tab.id ? 'bg-primary text-white shadow-xl scale-105' : 'text-primary/50 hover:text-primary hover:bg-white/50'}`}
                  >
                    <tab.icon className="w-3.5 h-3.5 sm:w-4 h-4" /> 
                    <span className="inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem('admin_token');
                setIsLoggedIn(false);
                setPassword('');
              }}
              className="px-4 py-2 text-sm font-bold text-primary/40 hover:text-highlight flex items-center gap-2 transition-all hover:scale-105 active:scale-95 mr-2"
            >
              <LogOut className="w-4 h-4" /> 
              <span className="hidden md:inline">安全登出</span>
            </button>
          </Card>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <Card className="sticky top-32">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                    <Upload className="w-6 h-6 opacity-40" /> 上傳作品
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => setShowCatModal(true)} className="!rounded-full px-4 border-secondary text-primary/60 hover:text-primary">
                    分類管理
                  </Button>
                </div>
                
                <form onSubmit={handleUpload} className="space-y-8">
                  <div className="space-y-3">
                    <Label>選擇分類</Label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        if (e.target.value === 'add_new') {
                          setShowCatModal(true);
                        } else {
                          setSelectedCategory(e.target.value);
                        }
                      }}
                      className="w-full p-4 bg-secondary/10 border border-secondary/20 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-primary font-medium appearance-none cursor-pointer"
                    >
                      <option value="" disabled>選擇分類</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                      <option value="add_new" className="text-secondary font-bold">+ 新增分類...</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label>作品照片</Label>
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/5' : 'border-secondary/40 hover:border-primary/40 hover:bg-secondary/5'}`}>
                      <input {...getInputProps()} />
                      {preview ? (
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }} className="absolute top-3 right-3 bg-highlight text-white p-2 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-transform"><X className="w-5 h-5" /></button>
                        </div>
                      ) : (
                        <div className="py-8 space-y-4">
                          <div className="bg-secondary/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-primary/30"><Upload className="w-8 h-8" /></div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-primary/70">點擊或拖放圖片</p>
                            <p className="text-xs text-primary/40">支援 JPG, PNG 格式</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" isLoading={isUploading} disabled={!image} className="w-full" size="lg">
                    <Plus className="w-5 h-5 mr-1" /> 發佈作品
                  </Button>
                </form>
                {message && <div className={`mt-6 p-4 rounded-2xl text-sm font-bold text-center animate-in zoom-in duration-300 ${message.includes('成功') ? 'bg-primary/10 text-primary' : 'bg-highlight/10 text-highlight'}`}>{message}</div>}
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-primary tracking-tight">現有作品集</h2>
                  <p className="text-primary/40 text-sm font-medium mt-1">目前共有 {works.length} 件心血結晶</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {works.map((work) => (
                  <div key={work.id} className="group relative">
                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-soft bg-secondary/10 group-hover:shadow-2xl transition-all duration-700">
                      <img src={work.image_data} alt={work.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex items-center justify-center p-6">
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteWork(work.id)} 
                          className="!rounded-full !p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl"
                        >
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">{work.category}</span>
                            <span className="text-[10px] font-bold text-primary/60">{new Date(work.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {works.length === 0 && (
                <Card className="text-center py-32 border-2 border-dashed border-secondary/30 bg-transparent shadow-none">
                  <ImageIcon className="w-16 h-16 mx-auto text-secondary mb-4 opacity-40" />
                  <p className="text-primary/40 font-bold">尚無作品，開始建立您的美學空間</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'workshops' && (
          <div className="space-y-10">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight">課程工作坊</h2>
                <p className="text-primary/40 text-sm font-medium mt-1">管理您的教學課程與預約連結</p>
              </div>
              <Button 
                onClick={() => openWorkshopModal('add')}
                className="shadow-primary/30"
              >
                <Plus className="w-5 h-5 mr-1" /> 新增課程
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workshops.map((ws) => (
                <Card key={ws.id} className="flex flex-col sm:flex-row gap-6 group hover:translate-y-[-4px] transition-transform">
                  <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-secondary/10 flex-shrink-0 shadow-inner">
                    {ws.image_url ? (
                      <img src={ws.image_url} alt={ws.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/40"><ImageIcon className="w-10 h-10" /></div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col py-1">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{ws.duration}</span>
                        <span className="w-1 h-1 rounded-full bg-secondary/50"></span>
                        <span className="text-[10px] font-black text-highlight">{ws.price}</span>
                      </div>
                      <h3 className="font-bold text-xl text-primary mb-2">{ws.title}</h3>
                      <p className="text-primary/60 text-sm line-clamp-2 leading-relaxed">{ws.description}</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button variant="secondary" size="sm" onClick={() => openWorkshopModal('edit', ws)} className="flex-1 !rounded-full">
                        <Edit2 className="w-4 h-4 mr-1.5" /> 編輯
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteWorkshop(ws.id)} className="!rounded-full border-secondary/30 !text-highlight hover:!bg-highlight/5 hover:!border-highlight/30">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {workshops.length === 0 && (
              <Card className="text-center py-32 border-2 border-dashed border-secondary/30 bg-transparent shadow-none">
                <BookOpen className="w-16 h-16 mx-auto text-secondary mb-4 opacity-40" />
                <p className="text-primary/40 font-bold">還沒有安排任何工作坊</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'kits' && (
          <div className="space-y-10">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight">刺繡材料包 Kits</h2>
                <p className="text-primary/40 text-sm font-medium mt-1">管理您的商品與購買連結</p>
              </div>
              <Button 
                onClick={() => openProductModal('add')}
                className="shadow-primary/30"
              >
                <Plus className="w-5 h-5 mr-1" /> 新增材料包
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((p) => (
                <Card key={p.id} className="flex flex-col sm:flex-row gap-6 group hover:translate-y-[-4px] transition-transform">
                  <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-secondary/10 flex-shrink-0 shadow-inner">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/40"><ImageIcon className="w-10 h-10" /></div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col py-1">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary">材料包</span>
                        <span className="w-1 h-1 rounded-full bg-secondary/50"></span>
                        <span className="text-[10px] font-black text-highlight">{p.price}</span>
                      </div>
                      <h3 className="font-bold text-xl text-primary mb-2">{p.title}</h3>
                      <p className="text-primary/60 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button variant="secondary" size="sm" onClick={() => openProductModal('edit', p)} className="flex-1 !rounded-full">
                        <Edit2 className="w-4 h-4 mr-1.5" /> 編輯
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(p.id)} className="!rounded-full border-secondary/30 !text-highlight hover:!bg-highlight/5 hover:!border-highlight/30">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {products.length === 0 && (
              <Card className="text-center py-32 border-2 border-dashed border-secondary/30 bg-transparent shadow-none">
                <Heart className="w-16 h-16 mx-auto text-secondary mb-4 opacity-40" />
                <p className="text-primary/40 font-bold">還沒有上架任何材料包</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight">Edit Content (頁面內容)</h2>
                <p className="text-primary/40 text-sm font-medium mt-1">更新工作室的首頁文字、關於我與頁尾資訊</p>
              </div>
            </div>
            
            <Card className="p-10 border border-white/40 shadow-2xl">
              <form onSubmit={handleContentSubmit} className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary/80 border-b border-secondary/20 pb-2">Header Section (頂部導航)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>品牌名稱 (Brand Name)</Label>
                      <Input 
                        type="text" 
                        value={siteContent.header_brand || ''} 
                        onChange={(e) => setSiteContent({...siteContent, header_brand: e.target.value})}
                        placeholder="例如：First Embroidery 初刺"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>按鈕文字 (Button Text)</Label>
                      <Input 
                        type="text" 
                        value={siteContent.header_button_text || ''} 
                        onChange={(e) => setSiteContent({...siteContent, header_button_text: e.target.value})}
                        placeholder="例如：Book Now"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <Label>About 連結文字</Label>
                      <Input 
                        type="text" 
                        value={siteContent.header_nav_about || ''} 
                        onChange={(e) => setSiteContent({...siteContent, header_nav_about: e.target.value})}
                        placeholder="About"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Workshop 連結文字</Label>
                      <Input 
                        type="text" 
                        value={siteContent.header_nav_workshop || ''} 
                        onChange={(e) => setSiteContent({...siteContent, header_nav_workshop: e.target.value})}
                        placeholder="Workshop"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Gallery 連結文字</Label>
                      <Input 
                        type="text" 
                        value={siteContent.header_nav_gallery || ''} 
                        onChange={(e) => setSiteContent({...siteContent, header_nav_gallery: e.target.value})}
                        placeholder="Gallery"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Kits 連結文字</Label>
                      <Input 
                        type="text" 
                        value={siteContent.header_nav_kits || ''} 
                        onChange={(e) => setSiteContent({...siteContent, header_nav_kits: e.target.value})}
                        placeholder="Kits"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary/80 border-b border-secondary/20 pb-2">Home Page Cards (首頁方塊)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="space-y-3 bg-secondary/5 p-6 rounded-3xl border border-secondary/10">
                        <Label>Card {num} Image</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="text" 
                            value={siteContent[`card_image_${num}`] || ''} 
                            onChange={(e) => setSiteContent({...siteContent, [`card_image_${num}`]: e.target.value})}
                            placeholder="圖片網址"
                            className="flex-grow"
                          />
                          <Button type="button" variant="secondary" onClick={() => setPickerConfig({ show: true, target: `card_image_${num}` })} className="px-4">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        {siteContent[`card_image_${num}`] && (
                          <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-secondary/20 shadow-sm">
                            <img src={siteContent[`card_image_${num}`]} alt={`Card ${num}`} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary/80 border-b border-secondary/20 pb-2">Hero Section</h3>
                  <div className="space-y-3">
                    <Label>首頁標語 (Hero Title)</Label>
                    <Input 
                      type="text" 
                      value={siteContent.hero_title || ''} 
                      onChange={(e) => setSiteContent({...siteContent, hero_title: e.target.value})}
                      placeholder="例如：紀錄生活中的每一份細膩"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary/80 border-b border-secondary/20 pb-2">About Section</h3>
                  <div className="space-y-3">
                    <Label>關於工作室 (About Bio)</Label>
                    <textarea 
                      rows={8}
                      value={siteContent.about_bio || ''} 
                      onChange={(e) => setSiteContent({...siteContent, about_bio: e.target.value})}
                      className="w-full p-4 bg-white/40 backdrop-blur-sm border border-secondary/30 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-primary leading-relaxed"
                      placeholder="寫下工作室的故事..."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary/80 border-b border-secondary/20 pb-2">Footer Section (頁尾資訊)</h3>
                  <div className="space-y-3">
                    <Label>頁尾版權文字 (Footer Text)</Label>
                    <Input 
                      type="text" 
                      name="footer_text"
                      value={siteContent.footer_text || ''} 
                      onChange={(e) => setSiteContent({...siteContent, footer_text: e.target.value})}
                      placeholder="例如：© 2024 EM Lab. All rights reserved."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label>地址</Label>
                      <Input 
                        type="text" 
                        name="footer_address"
                        value={siteContent.footer_address || ''} 
                        onChange={(e) => setSiteContent({...siteContent, footer_address: e.target.value})}
                        placeholder="工作室地址"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>電話</Label>
                      <Input 
                        type="text" 
                        name="footer_phone"
                        value={siteContent.footer_phone || ''} 
                        onChange={(e) => setSiteContent({...siteContent, footer_phone: e.target.value})}
                        placeholder="聯絡電話"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Email</Label>
                      <Input 
                        type="email" 
                        name="footer_email"
                        value={siteContent.footer_email || ''} 
                        onChange={(e) => setSiteContent({...siteContent, footer_email: e.target.value})}
                        placeholder="聯絡 Email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Instagram URL</Label>
                      <Input 
                        type="text" 
                        name="footer_instagram"
                        value={siteContent.footer_instagram || ''} 
                        onChange={(e) => setSiteContent({...siteContent, footer_instagram: e.target.value})}
                        placeholder="Instagram 連結"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Facebook URL</Label>
                      <Input 
                        type="text" 
                        name="footer_facebook"
                        value={siteContent.footer_facebook || ''} 
                        onChange={(e) => setSiteContent({...siteContent, footer_facebook: e.target.value})}
                        placeholder="Facebook 連結"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  isLoading={isSavingContent}
                  className="w-full shadow-primary/40"
                  size="lg"
                >
                  確認更新全站內容
                </Button>
              </form>
            </Card>
          </div>
        )}
      </main>

      {/* Workshop Modal */}
      {workshopModal.show && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl border border-white/40 animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-secondary/20 flex justify-between items-center bg-secondary/5">
              <div>
                <h3 className="font-bold text-2xl text-primary">{workshopModal.mode === 'add' ? '新增課程' : '編輯課程'}</h3>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Workshop details</p>
              </div>
              <button onClick={() => setWorkshopModal({ ...workshopModal, show: false })} className="bg-white p-2 rounded-full shadow-sm text-primary/40 hover:text-highlight transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleWorkshopSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label>課程標題</Label>
                  <Input type="text" value={wsFormData.title} onChange={(e) => setWsFormData({...wsFormData, title: e.target.value})} placeholder="例如：手工陶藝基礎班" required />
                </div>
                <div className="space-y-2">
                  <Label>課程費用</Label>
                  <Input type="text" value={wsFormData.price} onChange={(e) => setWsFormData({...wsFormData, price: e.target.value})} placeholder="$800" />
                </div>
                <div className="space-y-2">
                  <Label>課程時長</Label>
                  <Input type="text" value={wsFormData.duration} onChange={(e) => setWsFormData({...wsFormData, duration: e.target.value})} placeholder="2 小時" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>圖片網址</Label>
                  <div className="flex gap-2">
                    <Input type="text" value={wsFormData.image_url} onChange={(e) => setWsFormData({...wsFormData, image_url: e.target.value})} placeholder="https://images.unsplash.com/..." className="flex-grow" />
                    <Button type="button" variant="secondary" onClick={() => setPickerConfig({ show: true, target: 'workshop' })} className="px-4">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {wsFormData.image_url && (
                    <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-secondary/20">
                      <img src={wsFormData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>報名表單連結 (Google Form)</Label>
                  <Input type="text" value={wsFormData.form_url} onChange={(e) => setWsFormData({...wsFormData, form_url: e.target.value})} placeholder="https://forms.gle/..." />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>課程簡介</Label>
                  <textarea rows={4} value={wsFormData.description} onChange={(e) => setWsFormData({...wsFormData, description: e.target.value})} className="w-full p-4 bg-white/50 border border-secondary/30 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-primary" placeholder="介紹您的課程內容與特色..." />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <Button type="button" variant="secondary" onClick={() => setWorkshopModal({ ...workshopModal, show: false })} className="flex-1">取消</Button>
                <Button type="submit" className="flex-[2]">儲存課程資訊</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Kit Modal */}
      {productModal.show && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl border border-white/40 animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-secondary/20 flex justify-between items-center bg-secondary/5">
              <div>
                <h3 className="font-bold text-2xl text-primary">{productModal.mode === 'add' ? '新增材料包' : '編輯材料包'}</h3>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Kit details</p>
              </div>
              <button onClick={() => setProductModal({ ...productModal, show: false })} className="bg-white p-2 rounded-full shadow-sm text-primary/40 hover:text-highlight transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label>材料包名稱</Label>
                  <Input type="text" value={productFormData.title} onChange={(e) => setProductFormData({...productFormData, title: e.target.value})} placeholder="例如：刺繡材料包 - 森林系列" required />
                </div>
                <div className="space-y-2">
                  <Label>價格</Label>
                  <Input type="text" value={productFormData.price} onChange={(e) => setProductFormData({...productFormData, price: e.target.value})} placeholder="HK$ 280" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>圖片網址</Label>
                  <div className="flex gap-2">
                    <Input type="text" value={productFormData.image_url} onChange={(e) => setProductFormData({...productFormData, image_url: e.target.value})} placeholder="/images/works/products/01.jpg" className="flex-grow" />
                    <Button type="button" variant="secondary" onClick={() => setPickerConfig({ show: true, target: 'product' })} className="px-4">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {productFormData.image_url && (
                    <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-secondary/20">
                      <img src={productFormData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>購買連結 (WhatsApp/Shopify/etc)</Label>
                  <Input type="text" value={productFormData.buy_link} onChange={(e) => setProductFormData({...productFormData, buy_link: e.target.value})} placeholder="https://wa.me/..." />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>商品描述</Label>
                  <textarea rows={4} value={productFormData.description} onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} className="w-full p-4 bg-white/50 border border-secondary/30 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-primary" placeholder="介紹材料包包含的內容與特色..." />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <Button type="button" variant="secondary" onClick={() => setProductModal({ ...productModal, show: false })} className="flex-1">取消</Button>
                <Button type="submit" className="flex-[2]">儲存商品資訊</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-lg !p-0 overflow-hidden shadow-2xl border border-white/40 animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-secondary/20 flex justify-between items-center bg-secondary/5">
              <div>
                <h3 className="font-bold text-2xl text-primary">分類管理</h3>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Organize your works</p>
              </div>
              <button onClick={() => { setShowCatModal(false); setEditingCat(null); }} className="bg-white p-2 rounded-full shadow-sm text-primary/40 hover:text-highlight transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-8">
              {editingCat ? (
                <form onSubmit={handleUpdateCategory} className="space-y-4 bg-primary/5 p-6 rounded-3xl border border-primary/20">
                  <Label>編輯分類</Label>
                  <div className="flex gap-4">
                    <Input 
                      type="text" 
                      value={editingCat.name} 
                      onChange={(e) => setEditingCat({...editingCat, name: e.target.value})} 
                      placeholder="分類名稱" 
                      required 
                      className="flex-grow"
                    />
                    <Button type="submit" className="shadow-none px-6" size="md">儲存</Button>
                    <Button type="button" variant="secondary" onClick={() => setEditingCat(null)} className="shadow-none px-6" size="md">取消</Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddCategory} className="space-y-4 bg-secondary/5 p-6 rounded-3xl border border-secondary/20">
                  <Label>新增分類</Label>
                  <div className="flex gap-4">
                    <Input 
                      type="text" 
                      value={newCatName} 
                      onChange={(e) => setNewCatName(e.target.value)} 
                      placeholder="名稱 (如: 陶藝)" 
                      required 
                      className="flex-grow"
                    />
                    <Button type="submit" isLoading={isAddingCategory} className="shadow-none px-6" size="md">
                      <Plus className="w-4 h-4 mr-1" /> 新增
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                <Label>現有分類</Label>
                <div className="divide-y divide-secondary/10 border border-secondary/20 rounded-[2rem] overflow-hidden max-h-64 overflow-y-auto bg-white/50">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 flex justify-between items-center hover:bg-white transition-colors">
                      <div>
                        <div className="font-bold text-primary">{cat.name}</div>
                        <div className="text-[10px] text-primary/30 font-black uppercase tracking-widest">{cat.slug}</div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setEditingCat({ id: cat.id, name: cat.name })} 
                          className="text-primary/20 hover:text-primary p-2 transition-colors"
                          title="編輯"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)} 
                          className="text-primary/20 hover:text-highlight p-2 transition-colors"
                          title="刪除"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {pickerConfig?.show && (
        <ImagePicker 
          onSelect={handleImageSelect} 
          onClose={() => setPickerConfig(null)} 
        />
      )}
    </div>
  );
}
