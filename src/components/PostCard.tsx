import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdatePost } from '@/lib/queries';
import { 
  Copy, 
  Check, 
  Edit3, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Pin, 
  Bookmark, 
  Archive
} from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: number;
  key: string;
  content: string;
  status: 'draft' | 'published' | 'archived' | 'bookmarked' | 'pinned';
  postType: 'standard' | 'thread';
  used: boolean;
  createdAt: number;
  updatedAt: number;
}

interface PostCardProps {
  post: Post;
  viewMode: 'grid' | 'list';
  key?: any;
}

export function PostCard({ post, viewMode }: PostCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Local edit states
  const [editContent, setEditContent] = useState(post.content);
  const [editStatus, setEditStatus] = useState(post.status);
  const [editType, setEditType] = useState(post.postType);

  const updatePost = useUpdatePost();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      setCopied(true);
      toast.success('Content copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  };

  const toggleUsed = () => {
    updatePost.mutate({
      key: post.key,
      payload: { used: !post.used }
    }, {
      onSuccess: () => {
        toast.success(`Post marked as ${!post.used ? 'used' : 'unused'}`);
      }
    });
  };

  const handleUpdateStatus = (newStatus: Post['status']) => {
    updatePost.mutate({
      key: post.key,
      payload: { status: newStatus }
    }, {
      onSuccess: () => {
        toast.success(`Post status updated to ${newStatus}`);
      }
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost.mutate({
      key: post.key,
      payload: {
        content: editContent,
        status: editStatus,
        postType: editType,
      }
    }, {
      onSuccess: () => {
        toast.success('Post updated successfully!');
        setIsEditDialogOpen(false);
      },
      onError: (err) => {
        toast.error(`Update failed: ${err.message}`);
      }
    });
  };

  // Character calculations (Standard X/Twitter limit is 280)
  const charCount = post.content ? post.content.length : 0;
  const charLimit = 280;
  const charsLeft = charLimit - charCount;
  const charPercentage = Math.min((charCount / charLimit) * 100, 100);

  // Character colors based on availability
  let charBarColor = 'bg-primary/75';
  let charTextColor = 'text-muted-foreground';
  if (charsLeft < 0) {
    charBarColor = 'bg-destructive';
    charTextColor = 'text-destructive font-semibold';
  } else if (charsLeft <= 30) {
    charBarColor = 'bg-amber-500';
    charTextColor = 'text-amber-500 font-medium';
  }

  // Formatting date nicely
  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  // Status badges config
  const statusStyles: Record<Post['status'], { label: string; className: string; icon: any }> = {
    draft: { 
      label: 'Draft', 
      className: 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
      icon: Clock
    },
    published: { 
      label: 'Published', 
      className: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
      icon: CheckCircle2 
    },
    pinned: { 
      label: 'Pinned', 
      className: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50',
      icon: Pin 
    },
    bookmarked: { 
      label: 'Bookmark', 
      className: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
      icon: Bookmark 
    },
    archived: { 
      label: 'Archived', 
      className: 'bg-muted text-muted-foreground border-border',
      icon: Archive 
    }
  };

  const currentStatusProps = statusStyles[post.status] || statusStyles.draft;
  const StatusIcon = currentStatusProps.icon;

  if (viewMode === 'list') {
    return (
      <div 
        id={`post-list-item-${post.key}`}
        className={`group border-b border-border/45 last:border-b-0 py-4 px-2 transition-all hover:bg-muted/30 flex flex-col md:flex-row md:items-center gap-4 ${post.used ? 'opacity-60' : ''}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-semibold tracking-tight text-primary/80 bg-muted px-1.5 py-0.5 rounded">
              {post.key}
            </span>
            <Badge variant="outline" className={`border ${currentStatusProps.className} flex items-center gap-1 text-[11px] h-5 px-1.5`}>
              <StatusIcon className="w-3 h-3" />
              {currentStatusProps.label}
            </Badge>
            {post.postType === 'thread' ? (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-none flex items-center gap-1 text-[11px] h-5">
                <Layers className="w-3 h-3" /> Thread
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground/90 border-muted-foreground/20 flex items-center gap-1 text-[11px] h-5">
                <FileText className="w-3 h-3" /> Standard
              </Badge>
            )}
            {post.used && (
              <Badge variant="default" className="bg-muted text-muted-foreground line-through flex items-center gap-1 text-[11px] h-5">
                Used
              </Badge>
            )}
          </div>
          <p className={`text-[14px] text-foreground/90 font-medium whitespace-pre-wrap leading-relaxed ${post.used ? 'line-through decoration-muted-foreground/50' : ''}`}>
            {post.content}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Updated {formatDate(post.updatedAt)}
            </span>
            <span className={charTextColor}>
              {charCount} / {charLimit} chars
            </span>
          </div>
        </div>

        {/* List mode actions toolbar */}
        <div className="flex items-center justify-end gap-1.5 flex-shrink-0 self-end md:self-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={toggleUsed}
            title={post.used ? 'Mark as Unused' : 'Mark as Used'}
          >
            <Check className={`h-4 w-4 ${post.used ? 'text-emerald-500 font-bold' : ''}`} />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            title="Copy post body"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setEditContent(post.content);
              setEditStatus(post.status);
              setEditType(post.postType);
              setIsEditDialogOpen(true);
            }}
            title="Edit post"
          >
            <Edit3 className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleUpdateStatus('draft')}>
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" /> Make Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('published')}>
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Publish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('pinned')}>
                <Pin className="w-4 h-4 mr-2 text-indigo-500" /> Pin Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('bookmarked')}>
                <Bookmark className="w-4 h-4 mr-2 text-amber-500" /> Bookmark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('archived')}>
                <Archive className="w-4 h-4 mr-2 text-zinc-500" /> Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Render Inline Edit Dialog block */}
        {renderEditDialog()}
      </div>
    );
  }

  // --- GRID VIEW (DEFAULT) ---
  return (
    <Card 
      id={`post-grid-card-${post.key}`}
      className={`relative flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/25 group/card bg-card border border-border/80 ${post.used ? 'opacity-70 bg-muted/20' : ''}`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-tight text-primary/80 bg-muted dark:bg-muted/40 px-2 py-0.5 rounded">
              {post.key}
            </span>
            <Badge variant="outline" className={`border ${currentStatusProps.className} flex items-center gap-1 text-[11px] px-1.5 py-0`}>
              <StatusIcon className="w-3 h-3" />
              {currentStatusProps.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1 pb-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-7 w-7 rounded-md ${post.used ? 'text-emerald-500' : 'text-muted-foreground opacity-30 group-hover/card:opacity-100 transition-opacity'}`}
              onClick={toggleUsed}
              title={post.used ? 'Mark Unused' : 'Mark Used'}
            >
              <Check className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="h-7 w-7 p-0 flex items-center justify-center rounded-md text-muted-foreground opacity-70 group-hover/card:opacity-100 transition-opacity" />}>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleUpdateStatus('draft')}>
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" /> Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('published')}>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Publish
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('pinned')}>
                  <Pin className="w-4 h-4 mr-2 text-indigo-500" /> Pin Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('bookmarked')}>
                  <Bookmark className="w-4 h-4 mr-2 text-amber-500" /> Bookmark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('archived')}>
                  <Archive className="w-4 h-4 mr-2 text-zinc-500" /> Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {post.postType === 'thread' ? (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-none flex items-center gap-1 text-[10px] py-0 px-1.5 h-4.5 font-medium">
              <Layers className="w-2.5 h-2.5" /> Thread Draft
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/20 flex items-center gap-1 text-[10px] py-0 px-1.5 h-4.5 font-medium">
              <FileText className="w-2.5 h-2.5" /> Standard Post
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 pb-4 flex-1">
        <p className={`text-[14px] text-foreground/90 whitespace-pre-wrap leading-relaxed ${post.used ? 'line-through decoration-muted-foreground/35 text-foreground/50' : ''}`}>
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        {/* Dynamic Character Limiter Progress Indicator */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground/75" /> {formatDate(post.updatedAt)}
            </span>
            <span className={charTextColor}>
              {charsLeft < 0 ? `Limit exceeded (+${Math.abs(charsLeft)})` : `${charCount} / ${charLimit} chars`}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${charBarColor}`}
              style={{ width: `${charPercentage}%` }}
            />
          </div>
        </div>

        {/* Instant Action Toolbar */}
        <div className="flex items-center justify-between w-full pt-1 border-t border-border/40">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            onClick={() => {
              setEditContent(post.content);
              setEditStatus(post.status);
              setEditType(post.postType);
              setIsEditDialogOpen(true);
            }}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Copy</span>
              </>
            )}
          </Button>
        </div>
      </CardFooter>

      {/* Render Inline Edit Dialog block */}
      {renderEditDialog()}
    </Card>
  );

  // Helper function to render edit dialog
  function renderEditDialog() {
    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Post Workspace Item ({post.key})</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`edit-content-${post.key}`} className="text-sm font-semibold">Post Body</Label>
                <span className={`text-xs font-mono ${editContent.length > 280 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                  {editContent.length} / 280
                </span>
              </div>
              <Textarea
                id={`edit-content-${post.key}`}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
                className="resize-none leading-relaxed text-sm bg-muted/20"
                placeholder="Compose your post..."
                required
              />
              {editContent.length > 280 && (
                <p className="text-[11px] text-destructive/90 font-medium">
                  ⚠️ Note: Your content exceeds standard X limit (280 chars) by {editContent.length - 280} text characters.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`edit-status-${post.key}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
                <select 
                  id={`edit-status-${post.key}`}
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="flex h-9 w-full rounded-md border border-input border-border/70 bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pinned">Pinned</option>
                  <option value="bookmarked">Bookmarked</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`edit-type-${post.key}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post Type</Label>
                <select 
                  id={`edit-type-${post.key}`}
                  value={editType} 
                  onChange={(e) => setEditType(e.target.value as any)}
                  className="flex h-9 w-full rounded-md border border-input border-border/70 bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                >
                  <option value="standard">Standard</option>
                  <option value="thread">Thread</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/40 mt-6">
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm"
                className="text-xs"
                disabled={updatePost.isPending}
              >
                {updatePost.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}
