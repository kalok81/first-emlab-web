import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-accent/20">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg md:text-xl font-serif font-bold tracking-tight text-primary">
          First Embroidery 初刺
        </Link>
        <nav className="flex space-x-4 md:space-x-8 text-xs md:text-sm font-medium text-primary">
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/workshop" className="hover:text-accent transition-colors">Workshop</Link>
          <Link href="/works" className="hover:text-accent transition-colors">Gallery</Link>
          <Link href="/kits" className="hover:text-accent transition-colors">Kits</Link>
        </nav>
        <Link 
          href="https://instagram.com" 
          target="_blank"
          className="hidden sm:block bg-accent text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-highlight transition-colors"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
