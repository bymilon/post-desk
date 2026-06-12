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
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            AI Draft Copilot
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="type">Post Type</Label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1"></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intent">Intent / Topic</Label>
            <Textarea
              id="intent"
              placeholder="What do you want to tweet about? (e.g., Launching a new feature, thoughts on AI UI...)"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="resize-none h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Paste article snippets, links, or specific points you want included..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="resize-none h-20"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isPending || !intent.trim()} 
            className="w-full gap-2"
          >
            {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            {isPending ? 'Generating Variations...' : 'Generate '}
          </Button>

          {drafts.length > 0 && (
            <div className="pt-6 space-y-4 border-t">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Suggested Drafts</h3>
              <div className="grid gap-4">
                {drafts.map((draft, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card relative group flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm flex-1 whitespace-pre-wrap">{draft.content}</p>
                      <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-secondary-foreground">
                        {draft.type}
                      </span>
                    </div>
                    <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button 
                         size="sm" 
                         variant="default" 
                         className="gap-2 h-8"
                         disabled={isSaving}
                         onClick={() => handleSaveDraft(draft.content)}
                       >
                         <Save className="w-3.5 h-3.5" />
                         Save as Draft
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
