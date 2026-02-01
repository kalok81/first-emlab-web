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
            關於初見 & 初刺
          </h1>
          <div className="w-12 h-1 bg-white/50 mx-auto" />
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="text-accent uppercase tracking-widest text-sm font-bold mb-4 block">The Founder</span>
            <h2 className="text-3xl mb-8 font-serif text-secondary">羅家寶 KAME LAW</h2>
            <div className="space-y-6 text-lg leading-loose text-secondary/80">
              <p>
                香港刺繡家、「初刺」品牌創辦人。自 2019 年開始接觸刺繡，從興趣出發，逐漸發展成為其主要創作與教學方向。
              </p>
              <p>
                早期以製作各類生活刺繡品為主，其後創立個人品牌「初刺」，專注推廣手工刺繡文化及個人化創作體驗。作品涵蓋文字設計、布藝飾物及小型藝術創作，透過一針一線呈現生活細節與情感記憶。
              </p>
              <p>
                作為一名刺繡導師，Kame 相信刺繡不單是一種工藝，更是一種表達內心世界的藝術語言。在她的課堂中，學員不僅能掌握技巧，更能透過創作探索自我與情感連結。
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/works/workshop/01.jpg"
              alt="Kame Law - Founder of First Embroidery"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-secondary text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl mb-12 font-serif">以刺繡，點綴日常</h2>
          <div className="space-y-8 text-xl leading-relaxed opacity-90 font-light">
            <p>「初見」位於香港觀塘的一個溫馨角落。我們相信每一件作品都從一個故事開始。</p>
            <p>無論是想記錄重要時刻、保留寵物回憶，或為品牌客製獨特禮物，「初刺」都可以將你的想法轉化成精緻的刺繡作品。</p>
            <p>未來，我們希望持續以刺繡為媒介，連結更多社群與文化項目，讓手工藝術在城市中延伸出新的溫度與故事。</p>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🪡</div>
              <h3 className="text-xl mb-4 font-serif">刺繡工作坊</h3>
              <p className="opacity-70 text-sm">提供不同程度的課程，帶領你進入手作的世界。</p>
            </div>
            <div>
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl mb-4 font-serif">駐場服務</h3>
              <p className="opacity-70 text-sm">為品牌活動、市集提供即場客製化刺繡。</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl mb-4 font-serif">私人訂製</h3>
              <p className="opacity-70 text-sm">人像、寵物及品牌禮贈品客製化服務。</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🧵</div>
              <h3 className="text-xl mb-4 font-serif">材料販售</h3>
              <p className="opacity-70 text-sm">嚴選優質材料與工具，讓你在家也能創作。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-accent/5 text-center px-6 border-t border-accent/10">
        <h2 className="text-3xl mb-8 font-serif">聯絡我們</h2>
        <div className="space-y-4 text-lg">
          <p>📍 1101B15, 11/F, Yau Lee Centre, 45 Hoi Yuen Road, Kwun Tong</p>
          <p>📧 first.embroidery2019@gmail.com</p>
          <p>📞 6573 0303</p>
          <p>📸 @first.emlab</p>
        </div>
        <div className="mt-12">
          <p className="text-secondary/60 italic">歡迎預約參觀或參加工作坊，感受指尖上的安靜時光。</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
