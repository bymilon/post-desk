import React, { useState, Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  Lightbulb, 
  LayoutDashboard, 
  Sun, 
  Moon,
  PenLine,
  Sparkles,
  PenTool
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { AppLogo } from '@/components/AppLogo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { PinAuth } from '@/components/PinAuth';

const CreatePostForm = lazy(() => import('@/components/CreatePostForm').then(m => ({ default: m.CreatePostForm })));
const CreateInspirationForm = lazy(() => import('@/components/CreateInspirationForm').then(m => ({ default: m.CreateInspirationForm })));
const PostsWorkspace = lazy(() => import('@/components/PostsWorkspace').then(m => ({ default: m.PostsWorkspace })));
const InspirationsBoard = lazy(() => import('@/components/InspirationsBoard').then(m => ({ default: m.InspirationsBoard })));
const CopilotModal = lazy(() => import('@/components/CopilotModal').then(m => ({ default: m.CopilotModal })));
const MarketingLanding = lazy(() => import('@/components/MarketingLanding').then(m => ({ default: m.MarketingLanding })));
const AiWriterWorkspace = lazy(() => import('@/components/AiWriterWorkspace').then(m => ({ default: m.AiWriterWorkspace })));

type ViewContext = 'posts' | 'inspirations' | 'landing' | 'ai-writer';

export default function App() {
  const [activeView, setActiveView] = useState<ViewContext>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();

  if (activeView === 'landing') {
    return (
      <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
          <ScrollArea className="flex-1 min-h-0 w-full">
            <div className="animate-fade-in">
              <Suspense fallback={<Skeleton className="w-full h-full rounded-xl" />}>
                <MarketingLanding onEnterCockpit={() => setActiveView('posts')} />
              </Suspense>
            </div>
          </ScrollArea>
        </main>
        <Toaster position="bottom-right" closeButton richColors />
      </div>
    );
  }

  return (
    <PinAuth onBackToPublic={() => setActiveView('landing')}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
        {/* Navigation Sidebar/Rail */}
        <aside className="w-14 flex-shrink-0 border-r border-border/20 bg-card/45 backdrop-blur-md flex flex-col items-center py-4.5 z-20 transition-all">
          {/* App Logo */}
          <TooltipProvider>
            <div className="mb-6 select-none">
              <Tooltip>
                <TooltipTrigger render={
                  <button 
                    onClick={() => {
                      setActiveView('posts');
                      setSearchQuery('');
                    }}
                    className="focus-visible:outline-none transition-transform active:scale-95 cursor-pointer block"
                  >
                    <AppLogo />
                  </button>
                } />
                <TooltipContent side="right" className="font-semibold text-xs animate-fade-in">
                  Workspace Home
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Main Navigation tabs */}
            <nav className="flex flex-col gap-3.5 flex-1 w-full px-2 items-center">
              <Tooltip>
                <TooltipTrigger 
                  aria-label="Posts Workspace"
                  className={`w-9 h-9 rounded-md transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 ${
                    activeView === 'posts' 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/15' 
                      : 'text-muted-foreground/85 hover:text-foreground hover:bg-muted/30'
                  }`}
                  onClick={() => setActiveView('posts')}
                >
                  <FileText className="w-4.5 h-4.5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold text-xs animate-fade-in">
                  Posts Workspace
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger 
                  aria-label="AI Writer"
                  className={`w-9 h-9 rounded-md transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/45 ${
                    activeView === 'ai-writer' 
                      ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 hover:bg-indigo-500/15' 
                      : 'text-muted-foreground/85 hover:text-foreground hover:bg-muted/30'
                  }`}
                  onClick={() => setActiveView('ai-writer')}
                >
                  <PenTool className="w-4.5 h-4.5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold text-xs animate-fade-in">
                  AI Writer
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger 
                  aria-label="Inspirations Board"
                  className={`w-9 h-9 rounded-md transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45 ${
                    activeView === 'inspirations' 
                      ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 hover:bg-amber-500/15' 
                      : 'text-muted-foreground/85 hover:text-foreground hover:bg-muted/30'
                  }`}
                  onClick={() => setActiveView('inspirations')}
                >
                  <Lightbulb className="w-4.5 h-4.5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold text-xs animate-fade-in">
                  Inspirations Board
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger 
                  aria-label="Marketing Identity"
                  className="w-9 h-9 rounded-md transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 text-muted-foreground/85 hover:text-foreground hover:bg-muted/30"
                  onClick={() => setActiveView('landing')}
                >
                  <Sparkles className="w-4.5 h-4.5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold text-xs animate-fade-in">
                  Marketing Identity
                </TooltipContent>
              </Tooltip>
            </nav>
            
            {/* Bottom Actions: Theme switcher, settings, user mail */}
            <nav className="mt-auto flex flex-col gap-3 items-center w-full px-2">
              {/* Theme Toggle Button */}
              <Tooltip>
                <TooltipTrigger 
                  aria-label={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                  className="w-9 h-9 rounded-md text-muted-foreground/85 hover:text-foreground hover:bg-muted/30 transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4.5 h-4.5 text-amber-500 transition-transform rotate-0 scale-100" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-foreground transition-transform rotate-0 scale-100" />
                  )}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold text-xs animate-fade-in">
                  Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </TooltipContent>
              </Tooltip>

              {/* Profile Avatar / User Indicator */}
              <Tooltip>
                <TooltipTrigger render={
                  <div className="w-8 h-8 rounded-md bg-primary/5 dark:bg-muted/30 border border-border/20 flex items-center justify-center cursor-pointer hover:bg-muted/40 transition-all shrink-0">
                    <span className="font-mono text-[10px] font-bold text-primary dark:text-muted-foreground/85">MP</span>
                  </div>
                } />
                <TooltipContent side="right" className="font-medium text-[11px] max-w-xs p-2.5">
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
          <header className="h-12 flex-shrink-0 border-b border-border/20 flex items-center justify-between px-6 bg-card/45 backdrop-blur-md z-15 sticky top-0 transition-all duration-350">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-muted/45 text-muted-foreground/85 flex items-center justify-center border border-border/15">
                <LayoutDashboard className="w-3.5 h-3.5" />
              </div>
              <div>
                <h1 className="text-xs font-bold tracking-tight text-foreground flex items-center gap-1.5 font-sans">
                  {activeView === 'posts' ? 'Posts Space' : activeView === 'ai-writer' ? 'AI Writer' : 'Inspirations Board'}
                  <span className="text-[9.5px] font-mono text-muted-foreground/75 font-semibold px-1.5 py-0.5 bg-muted/45 border border-border/15 rounded-md">
                    v1.0
                  </span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {activeView === 'posts' ? (
                <div className="flex items-center gap-2">
                  <Suspense fallback={<Skeleton className="h-8 w-[100px] rounded-md" />}>
                    <CopilotModal />
                  </Suspense>
                  <Suspense fallback={<Skeleton className="h-8 w-[100px] rounded-md" />}>
                    <CreatePostForm />
                  </Suspense>
                </div>
              ) : activeView === 'ai-writer' ? (
                <div className="flex items-center gap-2">
                  {/* Additional actions for AI writer could go here */}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Suspense fallback={<Skeleton className="h-8 w-[115px] rounded-md" />}>
                    <CreateInspirationForm />
                  </Suspense>
                </div>
              )}
            </div>
          </header>

          {/* Workspace body window */}
          <ScrollArea className="flex-1 min-h-0 w-full">
            {activeView === 'posts' ? (
              <div className="max-w-5xl mx-auto px-6 py-6 space-y-6 animate-fade-in">
                <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-xl" />}>
                  <PostsWorkspace 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                  />
                </Suspense>
              </div>
            ) : activeView === 'ai-writer' ? (
              <div className="w-full h-full p-6 animate-fade-in">
                <Suspense fallback={<Skeleton className="w-full h-full rounded-xl" />}>
                  <AiWriterWorkspace />
                </Suspense>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto px-6 py-6 space-y-6 animate-fade-in">
                <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-xl" />}>
                  <InspirationsBoard />
                </Suspense>
              </div>
            )}
          </ScrollArea>
        </main>
        <Toaster position="bottom-right" closeButton richColors />
        
        {/* Threads-inspired Floating Quick Post FAB */}
        <Suspense fallback={null}>
          <CreatePostForm 
            position="bottom-right"
            trigger={
              <button
                aria-label="Create Quick Post"
                className="fixed bottom-6 right-6 z-40 h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-[0_8px_30px_rgb(0,0,0,0.36)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-zinc-800 dark:border-zinc-200/65 cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
              >
                <PenLine className="w-5 h-5 md:w-5.5 md:h-5.5" />
              </button>
            }
          />
        </Suspense>
      </div>
    </PinAuth>
  );
}
