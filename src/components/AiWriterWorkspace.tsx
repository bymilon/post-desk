import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useGenerateDrafts, useCreatePost } from '@/lib/queries';

type AiDraft = {
  content: string;
  type: string;
};

export function AiWriterWorkspace() {
  const [drafts, setDrafts] = useState<AiDraft[]>([]);
  
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Personal');
  const [format, setFormat] = useState('Single tweet');
  const [length, setLength] = useState('Short');
  const [audience, setAudience] = useState('');

  const { mutate: generateDrafts, isPending: isGenerating } = useGenerateDrafts();
  const { mutate: createPost, isPending: isSaving } = useCreatePost();

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic or idea.');
      return;
    }

    generateDrafts({
      intent: topic,
      postType: format, // maps roughly to postType
      style,
      format,
      length,
      audience
    }, {
      onSuccess: (data) => {
        if (data.drafts) {
          setDrafts(data.drafts);
          toast.success('Generated drafts successfully!');
        } else if (data.error) {
          toast.error(data.error);
        }
      },
      onError: (err) => {
        toast.error((err as Error).message || 'Failed to generate drafts.');
      }
    });
  };

  const handleSaveDraft = (content: string) => {
    createPost({ content, status: 'draft' }, {
      onSuccess: () => {
        toast.success('Saved to your drafts.');
        // optionally remove from list if wanted, but keeping makes sense too.
      },
      onError: (err) => {
        toast.error((err as Error).message || 'Failed to save draft.');
      }
    });
  };

  return (
    <div className="flex gap-6 h-full w-full">
      {/* Left Panel: Inputs */}
      <div className="w-[450px] flex-shrink-0 bg-card rounded-2xl border border-border/40 p-5 shadow-2xs flex flex-col gap-6 overflow-hidden">
        <ScrollArea className="flex-1 pr-3 -mr-3">
          <div className="space-y-6 pb-2">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground font-mono flex items-center gap-1.5">
                  <span className="text-primary">*</span> What do you want to say?
                </label>
                <span className="text-[10px] text-muted-foreground/60">Drop a topic or rough draft</span>
              </div>
              <Textarea
                placeholder="ai agent associate dx"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="resize-none min-h-[140px] bg-muted/10 focus:bg-background transition-colors text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Style</label>
                <div className="flex flex-wrap gap-2">
                  {['Personal', 'Bold', 'Educational', 'Funny', 'Story', 'Data-driven'].map(s => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`cursor-pointer px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                        style === s 
                          ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:text-indigo-400' 
                          : 'bg-transparent text-muted-foreground border-border/40 hover:border-border/80'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Format</label>
                <div className="flex flex-wrap gap-2">
                  {['Single tweet', 'Hook (thread starter)', 'Thread opener', 'Reply'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`cursor-pointer px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                        format === f 
                          ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:text-indigo-400' 
                          : 'bg-transparent text-muted-foreground border-border/40 hover:border-border/80'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Length</label>
                <div className="flex flex-wrap gap-2">
                  {['Short', 'Medium', 'Long'].map(l => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`cursor-pointer px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                        length === l 
                          ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:text-indigo-400' 
                          : 'bg-transparent text-muted-foreground border-border/40 hover:border-border/80'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Audience (Overrides Profile)</label>
                <input
                  type="text"
                  placeholder="e.g. solo founders building B2B SaaS"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full h-8 px-3 rounded-full bg-muted/20 border border-border/40 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            
          </div>
        </ScrollArea>
        
        <div className="pt-4 border-t border-border/40 flex items-center justify-end">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="cursor-pointer rounded-full bg-foreground text-background hover:bg-foreground/90 h-9 px-5 text-xs font-semibold"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> : null}
            Generate 3 drafts ↗
          </Button>
        </div>
      </div>

      {/* Right Panel: Output/Drafts */}
      <div className="flex-1 rounded-2xl border border-border/40 border-dashed bg-card/30 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {drafts.length === 0 ? (
          <div className="text-center max-w-md animate-fade-in">
            <h2 className="text-2xl font-serif text-foreground mb-3">Three drafts, one click.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pick an angle above, drop your own specifics into the prompt, hit Generate.
              We'll come back with three distinct drafts you can edit, schedule, or post.
            </p>
          </div>
        ) : (
          <ScrollArea className="w-full h-full">
            <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full py-4 animate-fade-in pr-4">
               {drafts.map((draft, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border bg-card hover:border-border/80 transition-all flex flex-col gap-4 shadow-sm group">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm flex-1 whitespace-pre-wrap text-foreground/90 leading-relaxed font-sans">{draft.content}</p>
                      <span className="text-[10px] font-mono tracking-wider uppercase bg-secondary px-2.5 py-1 rounded-md text-secondary-foreground h-fit">
                        {draft.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border/40 opacity-50 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] text-muted-foreground font-mono">
                         {draft.content.length} characters
                       </span>
                       <Button 
                         size="sm" 
                         variant="outline" 
                         className="cursor-pointer gap-2 h-8 border-primary/20 hover:border-primary/50 text-xs shadow-xs px-3 rounded-full"
                         disabled={isSaving}
                         onClick={() => handleSaveDraft(draft.content)}
                       >
                         <Save className="w-3.5 h-3.5" />
                         Save Draft
                       </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
