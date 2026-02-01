import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/works/hero/01.jpg"
          alt="First Embroidery 初見"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative text-center text-white p-6">
          <h1 className="text-4xl md:text-5xl mb-4 tracking-widest font-serif">
            關於初見
          </h1>
          <div className="w-12 h-1 bg-white/50 mx-auto" />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent uppercase tracking-widest text-sm font-bold mb-4 block">Our Philosophy</span>
            <h2 className="text-3xl mb-8 font-serif text-secondary">學會刺繡，也學會過溫暖的日子</h2>
            <div className="space-y-6 text-lg leading-loose text-secondary/80">
              <p>
                「初見」位於香港觀塘興業街的一個溫馨角落。我們相信刺繡不只是一種手工藝，更是一種心靈的療癒。每一針每一線，都是對美好生活的細膩刻畫。
              </p>
              <p>
                Based in Hong Kong | Hand embroidery. 在這裡，我們專注於手作的溫度，透過線條與色彩，將日常的點滴化作永恆的藝術。
              </p>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/works/workshop/01.jpg"
              alt="Workshop environment"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="bg-accent/5 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl mb-4">🪡</div>
              <h3 className="text-xl mb-4 font-serif">工作坊</h3>
              <p className="opacity-70">提供不同程度的刺繡課程，帶領你進入手作的世界。</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl mb-4 font-serif">訂製服務</h3>
              <p className="opacity-70">為你的故事量身打造獨一無二的刺繡作品。</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🧵</div>
              <h3 className="text-xl mb-4 font-serif">材料包</h3>
              <p className="opacity-70">嚴選優質材料，讓你在家也能延續這份溫暖。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl mb-8 font-serif">探訪我們</h2>
        <p className="text-xl opacity-80 mb-4">工作室地點：觀塘興業街</p>
        <p className="text-secondary/60">歡迎預約參觀或參加工作坊，感受指尖上的安靜時光。</p>
      </section>

      <Footer />
    </main>
  );
}
