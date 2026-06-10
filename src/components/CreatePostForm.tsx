import { useState, FormEvent } from 'react';
import { useCreatePost } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function CreatePostForm() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createPost.mutate(
      { text, postType: 'text' },
      {
        onSuccess: () => {
          toast.success('Post created');
          setOpen(false);
          setText('');
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
        Create Post
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="text">Content</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={createPost.isPending}>
              {createPost.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
