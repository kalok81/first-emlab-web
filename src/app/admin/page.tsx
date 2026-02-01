'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Work {
  id: number;
  category: string;
  image_data: string;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [category, setCategory] = useState('products');
  const [uploading, setUploading] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword === 'admin') {
      setIsAuthenticated(true);
      setPassword(savedPassword);
      fetchWorks();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWorks = async () => {
    try {
      const res = await fetch('/api/works');
      const data = await res.json();
      setWorks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      localStorage.setItem('admin_password', password);
      setIsAuthenticated(true);
      fetchWorks();
    } else {
      alert('Wrong password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_password');
    setIsAuthenticated(false);
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await compressImage(file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({ category, image: base64 }),
      });

      if (res.ok) {
        alert('Upload successful');
        fetchWorks();
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;

    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchWorks();
      } else {
        alert('Delete failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-serif font-bold text-center mb-8">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-highlight transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-foreground">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="text-xl font-bold mb-6">Upload New Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                <option value="products">Products</option>
                <option value="workshop">Workshop</option>
                <option value="student">Student Works</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image File</label>
              <label className={`
                flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer
                hover:border-accent hover:bg-accent/5 transition-all
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
                <span className="text-sm text-gray-600">{uploading ? 'Processing...' : 'Click to select image'}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Management List */}
        <section>
          <h2 className="text-xl font-bold mb-6">Manage Works ({works.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {works.map((work) => (
              <div key={work.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
                <img 
                  src={work.image_data} 
                  alt={work.category} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <span className="text-white text-xs font-medium uppercase mb-2 px-2 py-0.5 bg-white/20 rounded">
                    {work.category}
                  </span>
                  <button 
                    onClick={() => handleDelete(work.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
