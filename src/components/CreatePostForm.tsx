import React, { useState, FormEvent } from 'react';
import { useCreatePost } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, PenLine, FileText, Layers, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CreatePostForm() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [postType, setPostType] = useState<'standard' | 'thread'>('standard');
  const createPost = useCreatePost();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Post content cannot be empty!');
      return;
    }
    
    createPost.mutate(
      { content: text, postType },
      {
        onSuccess: () => {
          toast.success('Successfully drafted post item!');
          setOpen(false);
          setText('');
          setPostType('standard');
        },
        onError: (err) => {
          toast.error(`Drafting failed: ${err.message}`);
        },
      }
    );
  };

  const charLimit = 280;
  const charsLeft = charLimit - text.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="font-semibold text-xs h-8 gap-1 px-2.5 rounded-md shadow-2xs hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Create Post
        </Button>
      } />
      <DialogContent className="sm:max-w-[440px] p-5 rounded-lg border border-border/45">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold tracking-tight flex items-center gap-1.5">
            <PenLine className="w-4 h-4 text-primary" /> Create Workspace Post
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          {/* Post Type Selector */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Post Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPostType('standard')}
                className={`flex items-center justify-center gap-1.5 p-2.5 border rounded-md text-xs font-semibold transition-all ${
                  postType === 'standard'
                    ? 'border-primary/40 bg-primary/5 text-primary'
                    : 'border-border/60 bg-card text-muted-foreground hover:bg-muted/30'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Standard Post
              </button>
              <button
                type="button"
                onClick={() => setPostType('thread')}
                className={`flex items-center justify-center gap-1.5 p-2.5 border rounded-md text-xs font-semibold transition-all ${
                  postType === 'thread'
                    ? 'border-primary/40 bg-primary/5 text-primary'
                    : 'border-border/60 bg-card text-muted-foreground hover:bg-muted/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Thread Series
              </button>
            </div>
          </div>

          {/* Post Content Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="post-creation-text" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Post Text</Label>
              <span className={`text-[10px] font-mono font-medium ${charsLeft < 0 ? 'text-destructive font-bold' : 'text-muted-foreground/60'}`}>
                {text.length} / {charLimit}
              </span>
            </div>
            <Textarea
              id="post-creation-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start drafting or formulating hook lines..."
              rows={5}
              className="resize-none leading-relaxed text-xs p-3 bg-muted/10 border-border/30 rounded-md focus-visible:ring-1 focus-visible:ring-primary/40 w-full"
              required
            />
            {text.length > charLimit && (
              <p className="text-[10.5px] text-destructive flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> Note: Exceeds standard 280 Twitter character limit by {text.length - charLimit} chars.
              </p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex justify-between items-center pt-2.5 border-t border-border/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold h-8 px-3 rounded-md border-border/40"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="sm"
              className="text-xs font-semibold h-8 px-3.5 rounded-md" 
              disabled={createPost.isPending}
            >
              {createPost.isPending ? 'Drafting...' : 'Add Desk Draft'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
