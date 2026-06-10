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
        <Button className="font-semibold text-xs h-9 gap-1.5 px-3 rounded-lg shadow-xs hover:opacity-90">
          <Plus className="w-4 h-4" /> Create Post
        </Button>
      } />
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" /> Create Workspace Post
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Post Type Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPostType('standard')}
                className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  postType === 'standard'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <FileText className="w-4 h-4" /> Standard Post
              </button>
              <button
                type="button"
                onClick={() => setPostType('thread')}
                className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  postType === 'thread'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <Layers className="w-4 h-4" /> Thread Series
              </button>
            </div>
          </div>

          {/* Post Content Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="post-creation-text" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post Text</Label>
              <span className={`text-[11px] font-mono font-medium ${charsLeft < 0 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {text.length} / {charLimit}
              </span>
            </div>
            <Textarea
              id="post-creation-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start drafting or formulating hook lines..."
              rows={5}
              className="resize-none leading-relaxed text-sm p-3.5 bg-muted/15 border-border rounded-xl focus:ring-1 focus:ring-primary w-full"
              required
            />
            {text.length > charLimit && (
              <p className="text-[11px] text-destructive flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Note: Exceeds standard 280 Twitter character limit by {text.length - charLimit} chars.
              </p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-border/40">
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
              className="text-xs font-semibold h-9 px-4" 
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
