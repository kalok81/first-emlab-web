import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-accent/10 animate-fade-up">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg md:text-xl font-serif font-bold tracking-tight text-primary hover:opacity-80 transition-opacity">
          First Embroidery 初刺
        </Link>
        <nav className="flex space-x-4 md:space-x-8 text-xs md:text-sm font-medium text-primary">
          <Link href="/about" className="hover:text-accent transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/workshop" className="hover:text-accent transition-colors relative group">
            Workshop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/works" className="hover:text-accent transition-colors relative group">
            Gallery
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/kits" className="hover:text-accent transition-colors relative group">
            Kits
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </Link>
        </nav>
        <Link 
          href="https://wa.me/85265730303" 
          target="_blank"
          className="hidden sm:block bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
