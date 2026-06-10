import { useState, FormEvent } from 'react';
import { useCreateInspiration } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function CreateInspirationForm() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState('');
  const createInspiration = useCreateInspiration();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createInspiration.mutate(
      { content, sourceUrl: sourceUrl || undefined, tags: tags || undefined },
      {
        onSuccess: () => {
          toast.success('Inspiration captured');
          setOpen(false);
          setContent('');
          setSourceUrl('');
          setTags('');
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        Capture Inspiration
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Inspiration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What inspired you?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourceUrl">Source URL (optional)</Label>
            <Input
              id="sourceUrl"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, architecture, etc."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={createInspiration.isPending}>
              {createInspiration.isPending ? 'Capturing...' : 'Capture'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
