import React, { useState } from 'react';
import { useInspirations } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Copy, 
  Check, 
  ExternalLink,
  Grid,
  List
} from 'lucide-react';
import { CreateInspirationForm } from '@/components/CreateInspirationForm';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function InspirationsBoard() {
  const { data, isLoading, isError } = useInspirations();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [inspirationView, setInspirationView] = useState<'grid' | 'dense'>('grid');

  const handleCopy = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Inspiration copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading saved references...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl text-center max-w-md mx-auto my-12">
        <p className="text-sm text-destructive font-semibold">Failed to fetch inspirations</p>
        <p className="text-xs text-muted-foreground mt-1">Please retry or check DB setup status.</p>
      </div>
    );
  }

  const inspirations = data?.data || [];

  // Split tags helper - beautiful custom borders
  const renderTags = (tagsString?: string) => {
    if (!tagsString) return null;
    return tagsString.split(',').map((tag, idx) => {
      const cleanTag = tag.trim();
      if (!cleanTag) return null;
      return (
        <Badge 
          key={idx} 
          variant="outline" 
          className="text-[9px] py-0 px-1 py-0.2 h-3.5 font-normal text-muted-foreground/80 border-border/30 bg-muted/20 rounded-sm hover:bg-transparent"
        >
          #{cleanTag}
        </Badge>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
            Idea Board
            <Badge variant="secondary" className="font-mono text-[10px] h-4 px-1.5 font-bold bg-muted/50 text-muted-foreground border-0 rounded-sm">
              {inspirations.length}
            </Badge>
          </h2>
          <p className="text-[11px] text-muted-foreground/80">Keep hooks, reference copy, and styling ideas handy for drafting.</p>
        </div>

        {/* Dense / Grid controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="flex items-center border border-border/45 rounded-md bg-muted/35 p-0.5 h-6.5">
            <Button
              variant="ghost"
              size="icon"
              className={`h-5 w-5 rounded-xs p-0.5 transition-all ${inspirationView === 'grid' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setInspirationView('grid')}
              title="Grid Layout"
            >
              <Grid className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-5 w-5 rounded-xs p-0.5 transition-all ${inspirationView === 'dense' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setInspirationView('dense')}
              title="Dense List"
            >
              <List className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {inspirations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed border-border/30 bg-muted/5 mt-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/10 mb-3">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-semibold">Inspiration Board is empty</h3>
          <p className="mt-1 mb-4 text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Record copywriting examples, formatting frames, or references of viral content that fuel your brand.
          </p>
          <CreateInspirationForm />
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div 
            className={
              inspirationView === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5' 
                : 'flex flex-col gap-2'
            }
          >
            {inspirations.map((inspiration: any) => (
              <motion.div
                key={inspiration.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={inspirationView === 'dense' ? 'border-b border-border/15 last:border-b-0 pb-1.5' : ''}
              >
                <div 
                  className={`group relative overflow-hidden transition-all duration-200 border border-border/45 hover:border-amber-500/20 bg-card/40 rounded-lg p-3.5 ${
                    inspirationView === 'dense' ? 'flex items-center justify-between gap-4 border-0 hover:bg-muted/10 p-2.5 rounded-md' : 'flex flex-col justify-between h-full'
                  }`}
                >
                  {inspirationView === 'grid' ? (
                    <>
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border/20">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-sm border border-amber-500/10 flex items-center gap-1">
                            <Lightbulb className="w-2.5 h-2.5" /> Idea #{inspiration.id}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md opacity-40 group-hover:opacity-100 transition-opacity hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopy(inspiration.id, inspiration.content)}
                          title="Copy reference text"
                        >
                          {copiedId === inspiration.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>

                      <div className="flex-1 pb-3">
                        <p className="text-[12.5px] leading-relaxed text-foreground/95 whitespace-pre-wrap font-medium">
                          {inspiration.content}
                        </p>
                      </div>

                      {/* Unified footer strip */}
                      {(inspiration.tags || inspiration.sourceUrl) && (
                        <div className="space-y-2 pt-2 border-t border-border/25">
                          {inspiration.tags && (
                            <div className="flex flex-wrap gap-1 w-full">
                              {renderTags(inspiration.tags)}
                            </div>
                          )}
                          {inspiration.sourceUrl && (
                            <div className="flex items-center justify-between w-full text-[10px] pt-0.5">
                              <a 
                                href={inspiration.sourceUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[9.5px] font-medium text-amber-600/90 dark:text-amber-400 hover:underline flex items-center gap-0.5 font-mono truncate max-w-[180px]"
                              >
                                <ExternalLink className="w-2.5 h-2.5" /> Source reference link
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    // Dense Row Layout
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="font-mono text-[9px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded-sm border border-amber-500/10">
                            #{inspiration.id}
                          </span>
                          {inspiration.tags && renderTags(inspiration.tags)}
                        </div>
                        <p className="text-[12.5px] text-foreground/90 font-medium truncate">
                          {inspiration.content}
                        </p>
                        {inspiration.sourceUrl && (
                          <a 
                            href={inspiration.sourceUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[9.5px] text-amber-600 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <ExternalLink className="w-2.5 h-2.5" /> Source Link
                          </a>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(inspiration.id, inspiration.content)}
                      >
                        {copiedId === inspiration.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
