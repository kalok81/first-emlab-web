import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=2000")' }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative text-center text-white p-6">
          <h1 className="text-4xl md:text-6xl mb-6 tracking-widest drop-shadow-lg">
            學會刺繡，也學會過溫暖的日子
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            在大忙的世界裡，找回指尖上的安靜時光
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/workshop" className="bg-white text-foreground px-8 py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-all shadow-xl">
              探索工作坊
            </Link>
            <Link href="/works" className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all shadow-xl">
              查看作品集
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 max-w-3xl mx-auto px-4 text-center">
        <span className="text-accent uppercase tracking-widest text-sm font-bold mb-4 block">Our Story</span>
        <h2 className="text-3xl mb-8">關於初見</h2>
        <p className="text-lg leading-loose opacity-80 mb-6">
          「初見」位於觀塘興業街的一個溫馨角落。我們相信刺繡不只是一種手工藝，更是一種心靈的療癒。每一針每一線，都是對美好生活的細膩刻畫。
        </p>
        <p className="text-lg leading-loose opacity-80">
          在這裡，你不需要任何基礎，只需要帶著一顆想要安靜下來的心。讓我們一起在繽紛的絲線中，編織出屬於自己的溫度。
        </p>
      </section>

      {/* Categories Grid (Link-in-Bio style) */}
      <section className="bg-accent/5 py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard 
              title="刺繡工作坊" 
              desc="從零開始，體驗刺繡之美" 
              href="/workshop"
              image="https://images.unsplash.com/photo-1621508651038-f14f923b3614?auto=format&fit=crop&q=80&w=600"
            />
            <CategoryCard 
              title="作品集" 
              desc="我們最近的故事與創作" 
              href="/works"
              image="https://images.unsplash.com/photo-1590494157134-297eb063b45f?auto=format&fit=crop&q=80&w=600"
            />
            <CategoryCard 
              title="材料包" 
              desc="將溫暖帶回家延續" 
              href="/kits"
              image="https://images.unsplash.com/photo-1518331483807-f6adb0e1ad23?auto=format&fit=crop&q=80&w=600"
            />
            <CategoryCard 
              title="訂製服務" 
              desc="為你的故事量身打造" 
              href="/custom"
              image="https://images.unsplash.com/photo-1621508651068-f68673f47e33?auto=format&fit=crop&q=80&w=600"
            />
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center">近期作品</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 overflow-hidden relative group">
                <img 
                  src={`https://images.unsplash.com/photo-1610484196191-f8a41753c19e?auto=format&fit=crop&q=80&w=600&sig=${i}`} 
                  alt="Embroidery work"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/works" className="text-accent font-medium border-b-2 border-accent pb-1 hover:text-highlight hover:border-highlight transition-colors">
              查看更多作品
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function CategoryCard({ title, desc, href, image }: { title: string, desc: string, href: string, image: string }) {
  return (
    <Link href={href} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-lg transition-all hover:-translate-y-2">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-xl mb-2 font-serif">{title}</h3>
        <p className="text-sm opacity-80">{desc}</p>
      </div>
    </Link>
  );
}
