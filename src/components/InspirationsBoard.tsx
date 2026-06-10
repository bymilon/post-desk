import React, { useState } from 'react';
import { useInspirations } from '@/lib/queries';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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

  // Split tags helper
  const renderTags = (tagsString?: string) => {
    if (!tagsString) return null;
    return tagsString.split(',').map((tag, idx) => {
      const cleanTag = tag.trim();
      if (!cleanTag) return null;
      return (
        <Badge 
          key={idx} 
          variant="secondary" 
          className="text-[10px] py-0 px-1.5 h-4.5 font-medium bg-secondary text-secondary-foreground hover:bg-secondary/70 transition-colors"
        >
          #{cleanTag}
        </Badge>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            Idea Board
            <Badge variant="outline" className="font-mono text-[10px] h-5 px-1.5 font-medium bg-amber-500/10 text-amber-600 border-amber-500/20">
              {inspirations.length} active ideas
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">Keep hooks, reference copy, and ideas handy when you draft posts.</p>
        </div>

        {/* Dense / Grid controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="flex items-center border border-border rounded-lg bg-card/60 p-1 shadow-sm h-9">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-md p-1 transition-all ${inspirationView === 'grid' ? 'bg-muted/80 text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setInspirationView('grid')}
              title="Grid Layout"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-md p-1 transition-all ${inspirationView === 'dense' ? 'bg-muted/80 text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setInspirationView('dense')}
              title="Dense List"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {inspirations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed border-border bg-muted/5 mt-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shadow-xs">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold">Inspiration Board is empty</h3>
          <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Record copywriting examples, formatting frames, or website references of viral content that can fuel your brand.
          </p>
          <CreateInspirationForm />
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div 
            className={
              inspirationView === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' 
                : 'flex flex-col gap-3'
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
              >
                <Card 
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-amber-500/20 bg-card border border-border/80 ${
                    inspirationView === 'dense' ? 'p-3 flex items-center justify-between gap-4' : 'p-0 flex flex-col justify-between h-full'
                  }`}
                >
                  {inspirationView === 'grid' ? (
                    <>
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-amber-600 bg-amber-500/15 dark:bg-amber-950/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Idea #{inspiration.id}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-md opacity-40 group-hover:opacity-100 transition-opacity hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopy(inspiration.id, inspiration.content)}
                          title="Copy reference text"
                        >
                          {copiedId === inspiration.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 pb-4 flex-1">
                        <p className="text-[13.5px] leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
                          {inspiration.content}
                        </p>
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-3 border-t border-border/40 bg-muted/5">
                        {inspiration.tags && (
                          <div className="flex flex-wrap gap-1.5 pt-3 w-full">
                            {renderTags(inspiration.tags)}
                          </div>
                        )}
                        {inspiration.sourceUrl && (
                          <div className="flex items-center justify-between w-full text-xs pt-1">
                            <a 
                              href={inspiration.sourceUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[200px]"
                            >
                              <ExternalLink className="w-3 h-3" /> Source URL Link
                            </a>
                          </div>
                        )}
                      </CardFooter>
                    </>
                  ) : (
                    // Dense Row Layout
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded">
                            #{inspiration.id}
                          </span>
                          {inspiration.tags && renderTags(inspiration.tags)}
                        </div>
                        <p className="text-xs text-foreground/90 font-medium truncate">
                          {inspiration.content}
                        </p>
                        {inspiration.sourceUrl && (
                          <a 
                            href={inspiration.sourceUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[10px] text-amber-600 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <ExternalLink className="w-2.5 h-2.5" /> Source Link
                          </a>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(inspiration.id, inspiration.content)}
                      >
                        {copiedId === inspiration.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
