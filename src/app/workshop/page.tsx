import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Workshop() {
  const courses = [
    {
      title: "基礎刺繡入門課",
      level: "Beginner",
      duration: "3小時",
      price: "HK$480",
      desc: "適合完全零基礎，學習8種基礎針法，完成一個精美杯墊。小班教學，照顧每位學員需要。",
      image: "/images/works/workshop/01.jpg"
    },
    {
      title: "寵物半身像工作坊",
      level: "Intermediate",
      duration: "兩堂 (每堂3小時)",
      price: "HK$1,200",
      desc: "學習立體刺繡技巧，刻畫毛孩的神韻。適合想深入學習刺繡技巧的愛好者。",
      image: "/images/works/workshop/02.jpg"
    },
    {
      title: "字母花環工作坊",
      level: "Beginner",
      duration: "3.5小時",
      price: "HK$550",
      desc: "結合文字與花草，送給自己或親友的最佳禮物。每場工作坊包含：材料包、工具借用及專業導師指導。",
      image: "/images/works/workshop/03.jpg"
    }
  ];

  const services = [
    {
      title: "駐場刺繡服務",
      desc: "為品牌活動、市集、展覽等場合提供即場刺繡服務。現場即時為客人的衣物、布袋等物品刺繡客製化圖案或文字，增添活動互動性和獨特性。",
      example: "曾為 Hermès 提供駐場刺繡服務。"
    },
    {
      title: "團體/企業工作坊",
      desc: "為非政府組織、學校和企業提供團體刺繡工作坊，適合團隊建設、文化活動或教育目的。可按預算度身設計課程及圖案。",
      clients: "合作伙伴：海事處、POPBEE、聖保羅男女書院、佛教沈香林紀念中學等。"
    }
  ];

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="bg-secondary text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-serif">刺繡工作坊 & 服務</h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto px-6">在紛擾的城市中，找尋指尖的寧靜。我們提供從個人學習到品牌合作的多元化刺繡體驗。</p>
      </section>

      {/* Course List */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-serif mb-16 text-center">個人工作坊</h2>
        <div className="space-y-24">
          {courses.map((c, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{c.level}</span>
                <h2 className="text-3xl font-serif">{c.title}</h2>
                <p className="text-lg opacity-80 leading-relaxed">{c.desc}</p>
                <div className="flex gap-8 text-sm border-y border-accent/10 py-4">
                  <div>
                    <span className="block font-bold">時長</span>
                    <span className="opacity-60">{c.duration}</span>
                  </div>
                  <div>
                    <span className="block font-bold">費用</span>
                    <span className="opacity-60">{c.price}</span>
                  </div>
                </div>
                <button className="bg-foreground text-background px-10 py-3 rounded-full hover:bg-accent hover:text-white transition-all">
                  立即預約
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Services */}
      <section className="bg-accent/5 py-24 border-y border-accent/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-serif mb-16 text-center">品牌與團體服務</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((s, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-accent/5">
                <h3 className="text-2xl font-serif mb-6">{s.title}</h3>
                <p className="text-lg opacity-80 mb-6 leading-relaxed">{s.desc}</p>
                {s.example && (
                  <p className="text-accent font-medium italic">{s.example}</p>
                )}
                {s.clients && (
                  <p className="text-sm opacity-60 mt-4">{s.clients}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Footer */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl mb-8 font-serif">需要度身訂製的課程或服務？</h2>
        <p className="text-xl opacity-70 mb-12">歡迎與我們聯絡，商討最適合你的方案。</p>
        <a 
          href="https://wa.me/85265730303" 
          className="inline-block bg-secondary text-white px-12 py-4 rounded-full text-lg hover:bg-accent transition-colors"
        >
          WhatsApp 查詢
        </a>
      </section>

      <Footer />
    </main>
  );
}
