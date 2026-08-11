import { Menu } from "lucide-react";
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUIMode } from '../context/UIModeContext';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { name: 'Catalogue', path: '/products' },
  { name: 'Who we are', path: '/about' },
  { name: 'Submit a product', path: '/submit' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { righty, toggleRighty, mirror, toggleMirror } = useUIMode();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-6 px-5 md:px-10 py-3.5 bg-background/86 backdrop-blur-md border-b border-border">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-[26px] h-[26px] border border-primary rounded-lg grid place-items-center text-primary text-[13px] leading-none">
            ◀
          </div>
          <div className="flex flex-col leading-[1.05]">
            <span className="font-semibold tracking-[-0.02em] text-base">
              leftorium<span className="text-ink-faint">.ca</span>
            </span>
            <span className="font-mono-tag text-[10px] tracking-[0.14em] text-ink-faint uppercase">
              the 10% store
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-white/[0.07] ${
                isActive(link.path) ? 'text-foreground' : 'text-ink-dim'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="w-px h-[22px] bg-border mx-2" />
          <button
            onClick={toggleRighty}
            className="flex items-center gap-2 px-[11px] py-1.5 border border-border rounded-lg font-mono-tag text-[11px] tracking-[0.1em] uppercase text-ink-dim hover:border-primary hover:text-foreground transition-colors"
          >
            <span
              className="w-[7px] h-[7px] rounded-full"
              style={{ background: righty ? 'var(--ink-faint)' : 'var(--primary)' }}
            />
            {righty ? 'Righty' : 'Lefty'}
          </button>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleRighty}
            className="flex items-center gap-2 px-2.5 py-1.5 border border-border rounded-lg font-mono-tag text-[11px] tracking-[0.1em] uppercase text-ink-dim"
          >
            <span
              className="w-[7px] h-[7px] rounded-full"
              style={{ background: righty ? 'var(--ink-faint)' : 'var(--primary)' }}
            />
            {righty ? 'Righty' : 'Lefty'}
          </button>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-1.5 text-primary" aria-label="Open navigation">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background border-border">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-foreground">leftorium.ca</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-4 py-3 rounded-lg text-sm ${
                        isActive(link.path) ? 'bg-white/[0.07] text-foreground' : 'text-ink-dim'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border px-5 md:px-10 py-9">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="mb-1 text-sm text-ink-dim">leftorium.ca — a fictional shop for a real problem.</p>
            <p className="font-mono-tag text-[11px] text-ink-ghost">
              No products sold. No affiliate links. Some products imaginary.
            </p>
          </div>
          <button
            onClick={toggleMirror}
            className="font-mono-tag text-[10px] tracking-[0.14em] uppercase text-ink-ghost hover:text-primary transition-colors"
          >
            {mirror ? 'Unmirror the world' : 'Mirror the whole site'}
          </button>
        </div>
      </footer>

      {righty && (
        <div className="fixed bottom-6 left-6 z-[60] max-w-[330px] p-4 bg-card border border-border rounded-2xl shadow-2xl animate-nag">
          <div className="font-mono-tag text-[10px] tracking-[0.14em] uppercase text-primary mb-1.5">
            Righty mode active
          </div>
          <p className="mb-2.5 text-[13px] text-ink-dim text-pretty">
            Everything has moved to the far side and the ink is smudging under your hand. This is a mild version of an ordinary Tuesday.
          </p>
          <button
            onClick={toggleRighty}
            className="inline-flex px-3 py-1.5 border border-primary rounded-lg text-primary text-[13px] font-medium hover:bg-primary/10 transition-colors"
          >
            Give me my hand back
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
