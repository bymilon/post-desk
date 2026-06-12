import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { useTheme } from '@/components/theme-provider';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';

interface MarketingNavbarProps {
  onEnterCockpit: () => void;
}

export function MarketingNavbar({ onEnterCockpit }: MarketingNavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Critique', href: '#critique' },
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <nav id="marketing-nav" className="sticky top-0 z-50 w-full border-b border-border/15 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <AppLogo className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-sm tracking-tight text-foreground leading-none">
              PostDesk
            </span>
            <span className="font-mono text-[8px] font-bold tracking-wider text-muted-foreground/80 mt-0.5 uppercase">
              Content Cockpit
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-mono font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <Button
            aria-label="Toggle Theme"
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-md text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </Button>

          {/* Enter Cockpit CTA */}
          <Button
            onClick={onEnterCockpit}
            className="h-8 px-4 text-[11px] font-mono font-semibold uppercase bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 border border-zinc-800 dark:border-zinc-200/40 rounded-md tracking-wider transition-all duration-150 active:scale-95 flex items-center gap-1.5"
          >
            Cockpit <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            aria-label="Toggle Theme"
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-md text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </Button>
          
          <Button
            aria-label="Menu"
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-md text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/15 bg-background px-6 py-4 space-y-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 border-b border-border/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onEnterCockpit();
              }}
              className="w-full h-9 text-xs font-mono font-bold uppercase bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 border border-zinc-800 dark:border-zinc-200/40 rounded-md tracking-wider flex items-center justify-center gap-1.5"
            >
              Enter Workspace Cockpit <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
