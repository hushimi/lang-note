import { Link } from '@inertiajs/react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-neutral">LangNote</h3>
          </div>
          
          {/* Links */}
          <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
            <Link
              href="/"
              className="text-sm text-neutral/70 hover:text-neutral transition-colors"
            >
              Home
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-neutral/70 hover:text-neutral transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
