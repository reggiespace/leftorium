
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Book, Globe, Hand, Home, Menu, FlaskConical as Science, Share2, ShoppingBag } from "lucide-react";
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Products', path: '/products', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'The Lab', path: '/submit', icon: <Science className="h-5 w-5" /> },
    { name: 'Our Story', path: '/about', icon: <Book className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar (Sheet) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-xl font-black text-primary">Lefty Navigation</SheetTitle>
                </SheetHeader>
                <nav className="space-y-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.path}>
                      <Link 
                        to={link.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold ${isActive(link.path) ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-muted'}`}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

             {/* User Profile */}
             <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full border-2 border-primary/20 hover:border-primary overflow-hidden h-10 w-10 p-0"
                onClick={() => navigate('/auth')}
             >
                <Avatar className="h-full w-full">
                  <AvatarImage src="https://picsum.photos/seed/user123/100/100" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
             </Button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
             <h1 className="text-lg font-black tracking-tight">Leftorium</h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-colors ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <Link to="/" className="flex items-center gap-2 group ml-4">
              <h1 className="text-xl font-black tracking-tight">Leftorium</h1>
              <div className="p-1.5 bg-primary rounded-lg text-primary-foreground group-hover:-rotate-12 transition-transform">
                <Hand className="h-4 w-4 scale-x-[-1]" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-60">
            <Hand className="h-5 w-5 text-primary scale-x-[-1]" />
            <p className="text-sm font-bold">Leftorium &copy; 2024. Designed for the 10%.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">Our Story</Link>
            <Link to="/products" className="hover:text-primary transition-colors">Shop Gear</Link>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground">
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
