import React, { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  Lightbulb, 
  LayoutDashboard, 
  Sun, 
  Moon
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { CreatePostForm } from '@/components/CreatePostForm';
import { CreateInspirationForm } from '@/components/CreateInspirationForm';
import { PostsWorkspace } from '@/components/PostsWorkspace';
import { InspirationsBoard } from '@/components/InspirationsBoard';
import { AppLogo } from '@/components/AppLogo';
import { ScrollArea } from '@/components/ui/scroll-area';

type ViewContext = 'posts' | 'inspirations';

export default function App() {
  const [activeView, setActiveView] = useState<ViewContext>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Navigation Sidebar/Rail */}
      <aside className="w-18 flex-shrink-0 border-r border-border bg-card flex flex-col items-center py-5 z-20 shadow-xs">
        {/* App Logo */}
        <TooltipProvider>
          <div className="mb-8 select-none">
            <AppLogo />
          </div>
          
          {/* Main Navigation tabs */}
          <nav className="flex flex-col gap-5 flex-1 w-full px-2">
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant={activeView === 'posts' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className={`w-11 h-11 rounded-xl transition-all ${
                    activeView === 'posts' 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/15' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveView('posts')}
                >
                  <FileText className="w-5 h-5" />
                </Button>
              } />
              <TooltipContent side="right" className="font-semibold text-xs">
                Posts Workspace
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant={activeView === 'inspirations' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className={`w-11 h-11 rounded-xl transition-all ${
                    activeView === 'inspirations' 
                      ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-500/15' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveView('inspirations')}
                >
                  <Lightbulb className="w-5 h-5" />
                </Button>
              } />
              <TooltipContent side="right" className="font-semibold text-xs">
                Inspirations Board
              </TooltipContent>
            </Tooltip>
          </nav>
          
          {/* Bottom Actions: Theme switcher, settings, user mail */}
          <nav className="mt-auto flex flex-col gap-4 items-center w-full px-2">
            {/* Theme Toggle Button */}
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-11 h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-amber-500 transition-transform rotate-0 scale-100" />
                  ) : (
                    <Moon className="w-5 h-5 text-foreground transition-transform rotate-0 scale-100" />
                  )}
                </Button>
              } />
              <TooltipContent side="right" className="font-semibold text-xs">
                Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </TooltipContent>
            </Tooltip>

            {/* Profile Avatar / User Indicator */}
            <Tooltip>
              <TooltipTrigger render={
                <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-muted border border-border flex items-center justify-center cursor-pointer hover:bg-muted/40 transition-all shrink-0">
                  <span className="font-mono text-xs font-bold text-primary dark:text-muted-foreground">MP</span>
                </div>
              } />
              <TooltipContent side="right" className="font-medium text-xs max-w-xs p-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">milonp@gmail.com</span>
                  <span className="text-[10px] opacity-75">Workspace Owner</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* Dynamic header */}
        <header className="h-16 flex-shrink-0 border-b border-border flex items-center justify-between px-8 bg-card/60 backdrop-blur-md z-15 sticky top-0 transition-all duration-350">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted text-primary/80 dark:text-muted-foreground flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                {activeView === 'posts' ? 'Posts Space' : 'Inspirations Board'}
                <span className="text-[11px] font-mono text-muted-foreground font-normal px-2 py-0.5 bg-muted rounded-full">
                  PostDesk v1.0
                </span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {activeView === 'posts' ? (
              <div className="flex items-center gap-2">
                <CreatePostForm />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreateInspirationForm />
              </div>
            )}
          </div>
        </header>

        {/* Workspace body window */}
        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="max-w-5xl mx-auto px-8 py-8 space-y-8 animate-fade-in">
             {activeView === 'posts' ? (
                <PostsWorkspace 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                />
             ) : (
                <InspirationsBoard />
             )}
          </div>
        </ScrollArea>
      </main>
      <Toaster position="bottom-right" closeButton richColors />
    </div>
  );
}
