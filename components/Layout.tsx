
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Products', path: '/products', icon: 'shopping_bag' },
    { name: 'The Lab', path: '/submit', icon: 'science' },
    { name: 'Our Story', path: '/about', icon: 'menu_book' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background-dark">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Menu Button - Placed on the LEFT for thumb accessibility */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden"
            >
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>

             {/* User Profile - Moved to LEFT for Southpaw accessibility */}
             <button 
               onClick={() => navigate('/auth')}
               className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-primary/20 hover:border-primary transition-all overflow-hidden"
             >
                <img src="https://picsum.photos/seed/user123/100/100" alt="Avatar" className="w-full h-full object-cover" />
             </button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
             {/* Mobile Logo - Center/Right */}
             <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Leftorium</h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-colors ${isActive(link.path) ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <Link to="/" className="flex items-center gap-2 group ml-4">
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Leftorium</h1>
              <div className="p-1.5 bg-primary rounded-lg text-white group-hover:-rotate-12 transition-transform">
                <span className="material-symbols-outlined text-sm inline-block scale-x-[-1]">front_hand</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Left Sidebar Drawer - UX for Southpaws */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <aside 
          className={`absolute left-0 top-0 h-full w-72 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-black text-primary">Lefty Navigation</h2>
               <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold ${isActive(link.path) ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-60">
            {/* Flipped Hand Icon in footer */}
            <span className="material-symbols-outlined text-primary inline-block scale-x-[-1]">front_hand</span>
            <p className="text-sm font-bold">Leftorium © 2024. Designed for the 10%.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <Link to="/about" className="hover:text-primary transition-colors">Our Story</Link>
            <Link to="/products" className="hover:text-primary transition-colors">Shop Gear</Link>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          </div>
          <div className="flex gap-4">
            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">share</span>
            </div>
            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">public</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
