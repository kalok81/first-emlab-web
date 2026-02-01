import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Workshop() {
  const courses = [
    {
      title: "基礎刺繡入門課",
      level: "Level 1",
      duration: "3小時",
      price: "HK$480",
      desc: "適合完全零基礎，學習8種基礎針法，完成一個精美杯墊。",
      image: "https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "寵物半身像工作坊",
      level: "Level 2",
      duration: "兩堂 (每堂3小時)",
      price: "HK$1,200",
      desc: "學習立體刺繡技巧，刻畫毛孩的神韻。",
      image: "https://images.unsplash.com/photo-1621508651038-f14f923b3614?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "字母花環工作坊",
      level: "Level 1",
      duration: "3.5小時",
      price: "HK$550",
      desc: "結合文字與花草，送給自己或親友的最佳禮物。",
      image: "https://images.unsplash.com/photo-1518331483807-f6adb0e1ad23?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <main>
      <Header />
      <section className="bg-accent/10 py-20 text-center">
        <h1 className="text-4xl mb-4">工作坊 Workshop</h1>
        <p className="opacity-60">在紛擾的城市中，找尋指尖的寧靜</p>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="space-y-24">
          {courses.map((c, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <span className="bg-accent/20 text-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{c.level}</span>
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
                <button className="bg-foreground text-background px-10 py-3 rounded-full hover:bg-accent transition-colors">
                  立即預約
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
