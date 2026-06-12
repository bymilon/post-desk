import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bot, Save, RefreshCw } from 'lucide-react';
import { useGenerateDrafts } from '@/lib/queries';
import { useCreatePost } from '@/lib/queries';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const POST_TYPES = [
  'Genuine question',
  'Audience question',
  'Hot take',
  'JUSTIN',
  'Story',
  'One-liner',
  'Insight',
  'Goal',
  'A/B choice',
  'List',
  'Connect',
  'Observation',
  'Other'
];

export const CopilotModal = () => {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState('');
  const [context, setContext] = useState('');
  const [postType, setPostType] = useState('Insight');
  const { mutate: generateDrafts, isPending } = useGenerateDrafts();
  const { mutate: createPost, isPending: isSaving } = useCreatePost();
  const [drafts, setDrafts] = useState<{content: string; type: string}[]>([]);

  const handleGenerate = () => {
    if (!intent.trim()) {
      toast.error('Intent is required');
      return;
    }
    
    generateDrafts({ intent, context, postType }, {
      onSuccess: (data) => {
        if (data.drafts) {
          setDrafts(data.drafts);
          toast.success('Generated drafts based on your context');
        } else if (data.error) {
          toast.error(data.error);
        }
      },
      onError: (err) => {
        toast.error((err as Error).message || 'Failed to generate drafts');
      }
    });
  };

  const handleSaveDraft = (content: string) => {
    createPost(
      { content, status: 'draft' },
      {
        onSuccess: () => {
          toast.success('Draft saved successfully');
          setOpen(false);
          setDrafts([]);
          setIntent('');
          setContext('');
          setPostType('Insight');
        },
        onError: () => {
          toast.error('Failed to save draft');
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="secondary" className="font-semibold text-xs h-8 gap-1 px-2.5 rounded-md shadow-2xs">
          <Bot className="w-3.5 h-3.5" />
          AI Copilot
        </Button>
      } />
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] h-fit flex flex-col p-5 gap-0 overflow-hidden">
        <DialogHeader className="pb-3.5 border-b border-border/40">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
            <Bot className="w-4 h-4 text-blue-500" />
            AI Draft Copilot
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-1 mt-3.5 min-h-0 max-h-[60vh]">
          <div className="space-y-3.5 pb-2">
            <div className="flex gap-4">
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="type" className="text-xs font-semibold text-muted-foreground/90 font-sans">Post Type</Label>
                <Select value={postType} onValueChange={setPostType}>
                  <SelectTrigger id="type" className="h-8 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-xs">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1"></div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="intent" className="text-xs font-semibold text-muted-foreground/90 font-sans">Intent / Topic</Label>
              <Textarea
                id="intent"
                placeholder="What do you want to tweet about? (e.g., Launching a new feature, thoughts on AI UI...)"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="resize-none min-h-[72px] h-[72px] bg-muted/10 focus:bg-background transition-colors text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="context" className="text-xs font-semibold text-muted-foreground/90 font-sans">Additional Context (Optional)</Label>
              <Textarea
                id="context"
                placeholder="Paste article snippets, links, or specific points you want included..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="resize-none min-h-[72px] h-[72px] bg-muted/10 focus:bg-background transition-colors text-xs"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isPending || !intent.trim()} 
              className="w-full gap-2 h-9 text-xs font-medium shadow-xs mt-1"
            >
              {isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
              {isPending ? 'Generating Variations...' : 'Generate Variations'}
            </Button>

            {drafts.length > 0 && (
              <div className="pt-4 mt-4 space-y-3.5 border-t border-border/40">
                <h3 className="font-semibold text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Suggested Drafts</h3>
                <div className="grid gap-3">
                  {drafts.map((draft, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border bg-card hover:border-border/80 transition-all flex flex-col gap-2.5 shadow-2xs">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-xs flex-1 whitespace-pre-wrap text-foreground/90 leading-relaxed font-sans">{draft.content}</p>
                        <span className="text-[9px] font-mono tracking-wider uppercase bg-secondary px-2 py-0.5 rounded text-secondary-foreground h-fit">
                          {draft.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-0.5 pt-2.5 border-t border-border/30">
                         <span className="text-[10px] text-muted-foreground/85 font-mono">
                           {draft.content.length} characters
                         </span>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="gap-1.5 h-7 border-primary/20 hover:border-primary/50 text-[11px] shadow-2xs px-2.5"
                           disabled={isSaving}
                           onClick={() => handleSaveDraft(draft.content)}
                         >
                           <Save className="w-3 h-3 text-blue-500" />
                           Save as Draft
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
