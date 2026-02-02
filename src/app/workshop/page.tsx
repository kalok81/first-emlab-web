import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export default async function Workshop() {
  const payload = await getPayload({ config: configPromise });

  const workshopData = await payload.find({
    collection: 'workshops',
    depth: 1,
    limit: 100,
  });

  const courses = workshopData.docs.filter((item: any) => item.type === 'course');
  const services = workshopData.docs.filter((item: any) => item.type === 'service');

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="bg-secondary text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-serif">刺繡工作坊 & 服務</h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto px-6">在紛擾的城市中，找尋指尖的寧靜。我們提供從個人學習到品牌合作的多元化刺繡體驗。</p>
      </section>

      {/* Course List */}
      {courses.length > 0 && (
        <section className="py-24 max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-serif mb-16 text-center">個人工作坊</h2>
          <div className="space-y-24">
            {courses.map((c: any, i: number) => (
              <div key={c.id} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl bg-gray-50">
                    {c.image && (
                      <img src={typeof c.image === 'object' ? c.image.url : ''} alt={c.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  {c.level && (
                    <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{c.level}</span>
                  )}
                  <h2 className="text-3xl font-serif">{c.title}</h2>
                  <p className="text-lg opacity-80 leading-relaxed">{c.description}</p>
                  <div className="flex gap-8 text-sm border-y border-accent/10 py-4">
                    {c.duration && (
                      <div>
                        <span className="block font-bold">時長</span>
                        <span className="opacity-60">{c.duration}</span>
                      </div>
                    )}
                    {c.price && (
                      <div>
                        <span className="block font-bold">費用</span>
                        <span className="opacity-60">{c.price}</span>
                      </div>
                    )}
                  </div>
                  <button className="bg-foreground text-background px-10 py-3 rounded-full hover:bg-accent hover:text-white transition-all">
                    立即預約
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Special Services */}
      {services.length > 0 && (
        <section className="bg-accent/5 py-24 border-y border-accent/10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-serif mb-16 text-center">品牌與團體服務</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {services.map((s: any) => (
                <div key={s.id} className="bg-white p-10 rounded-3xl shadow-sm border border-accent/5">
                  <h3 className="text-2xl font-serif mb-6">{s.title}</h3>
                  <p className="text-lg opacity-80 mb-6 leading-relaxed">{s.description}</p>
                  {s.example && (
                    <p className="text-accent font-medium italic">{s.example}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
