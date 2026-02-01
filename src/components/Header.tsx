import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-accent/20">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold tracking-tight text-foreground">
          First Embroidery 初見
        </Link>
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/workshop" className="hover:text-accent transition-colors">Workshop</Link>
          <Link href="/works" className="hover:text-accent transition-colors">Gallery</Link>
          <Link href="/kits" className="hover:text-accent transition-colors">Kits</Link>
        </nav>
        <Link 
          href="https://instagram.com" 
          target="_blank"
          className="bg-accent text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-highlight transition-colors"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
