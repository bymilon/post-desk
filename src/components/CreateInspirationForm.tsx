import React, { useState, FormEvent } from 'react';
import { useCreateInspiration } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Lightbulb, Link, Tag, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function CreateInspirationForm() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState('');
  const createInspiration = useCreateInspiration();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Inspiration content cannot be empty!');
      return;
    }

    createInspiration.mutate(
      { content, sourceUrl: sourceUrl || undefined, tags: tags || undefined },
      {
        onSuccess: () => {
          toast.success('Successfully recorded reference hook idea!');
          setOpen(false);
          setContent('');
          setSourceUrl('');
          setTags('');
        },
        onError: (err) => {
          toast.error(`Recording failed: ${err.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" className="font-semibold text-xs h-9 gap-1.5 px-3 rounded-lg shadow-xs hover:bg-muted/40 text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/5">
          <Plus className="w-4 h-4 text-amber-500" /> Capture Idea
        </Button>
      } />
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" /> Capture Reference Idea
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4.5 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="inspiration-content" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Inspired Content / Text
            </Label>
            <Textarea
              id="inspiration-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Keep copywriting hooks, ideas, format notes, or quote snippets here..."
              rows={4}
              className="resize-none leading-relaxed text-sm p-3.5 bg-muted/15 border-border rounded-xl focus:ring-1 focus:ring-amber-500 w-full"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="inspiration-sourceUrl" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-muted-foreground/80" /> Source URL (optional)
            </Label>
            <Input
              id="inspiration-sourceUrl"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/tweet"
              className="bg-muted/15 border-border rounded-xl h-9.5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="inspiration-tags" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-muted-foreground/80" /> Tags / Keywords (optional)
            </Label>
            <Input
              id="inspiration-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="viral, hooks, framework"
              className="bg-muted/15 border-border rounded-xl h-9.5 text-sm"
            />
            <p className="text-[10px] text-muted-foreground/85 px-1">
              Separate multiples using a comma (e.g. typography, inspiration, x-post)
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border/40 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold h-9 px-3"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="sm"
              className="text-xs font-semibold h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white border-none shadow-xs"
              disabled={createInspiration.isPending}
            >
              {createInspiration.isPending ? 'Saving...' : 'Pin to Board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
