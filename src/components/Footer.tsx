export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-serif mb-4">First Embroidery 初見</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            學會刺繡，也學會過溫暖的日子。<br />
            工作室地點：觀塘興業街
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="/workshop">Workshops</a></li>
            <li><a href="/works">Recent Works</a></li>
            <li><a href="/kits">DIY Kits</a></li>
            <li><a href="/custom">Custom Orders</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Connect</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>WhatsApp</li>
            <li>Email</li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-background/10 text-center text-xs opacity-50">
        © {new Date().getFullYear()} First Embroidery 初見. All rights reserved.
      </div>
    </footer>
  );
}
