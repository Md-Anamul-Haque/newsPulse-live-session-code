import { Outlet, Link } from "react-router";
import { Newspaper, Github } from "lucide-react";

const GeneralLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Newspaper className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">News<span className="text-primary">Pulse</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
            {/* <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a> */}
            {/* <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">API</a> */}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Md-Anamul-Haque"
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 hover:bg-muted transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <button className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">NewsPulse</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your daily dose of automated industry news, aggregated and curated for performance and clarity.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Main Feed</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Technology News</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Business Insights</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t text-xs text-muted-foreground">
            <p>© 2026 NewsPulse Aggregator. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GeneralLayout;
