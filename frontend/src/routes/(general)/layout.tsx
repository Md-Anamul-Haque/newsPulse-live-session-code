import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bookmark, Github, Newspaper } from "lucide-react";
import { Link, Outlet } from "react-router";

const GeneralLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Newspaper className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              News<span className="text-primary font-medium">Pulse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              News
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex rounded-full"
              asChild
            >
              <Link to="/saved">
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">Saved Articles</span>
              </Link>
            </Button>
            <ThemeToggle />
            <a
              href="https://github.com/Md-Anamul-Haque"
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 hover:bg-muted transition-colors hidden sm:inline-flex"
            >
              <Github className="h-5 w-5" />
            </a>
            {/* <AuthModal /> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 bg-linear-to-b from-transparent to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Newspaper className="h-4 w-4" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">
                  News<span className="text-primary font-medium">Pulse</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your daily dose of automated industry news, aggregated and
                curated for performance and clarity.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Main Feed
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Technology News
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Business Insights
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t text-xs text-muted-foreground">
            <p>© 2026 NewsPulse Aggregator. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GeneralLayout;
