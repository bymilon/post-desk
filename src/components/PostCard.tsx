import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useUpdatePost } from '@/lib/queries';
import { 
  Copy, 
  Check, 
  Edit3, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Pin, 
  Bookmark, 
  Archive,
  Calendar,
  AlertCircle,
  Square,
  CheckSquare
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

  // Character status configurations
  let charBarColor = 'bg-primary/70';
  let charTextColor = 'text-muted-foreground/80';
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
      className: 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800',
      icon: Clock
    },
    published: { 
      label: 'Published', 
      className: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      icon: CheckCircle2 
    },
    pinned: { 
      label: 'Pinned', 
      className: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
      icon: Pin 
    },
    bookmarked: { 
      label: 'Bookmark', 
      className: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      icon: Bookmark 
    },
    archived: { 
      label: 'Archived', 
      className: 'bg-muted/80 text-muted-foreground border-border/60',
      icon: Archive 
    }
  };

  const currentStatusProps = statusStyles[post.status] || statusStyles.draft;
  const StatusIcon = currentStatusProps.icon;

  if (viewMode === 'list') {
    return (
      <div 
        id={`post-list-item-${post.key}`}
        className={`group border-b border-border/40 last:border-b-0 py-3.5 px-4 transition-all hover:bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4 ${post.used ? 'bg-muted/5 opacity-75' : ''}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold tracking-tight text-primary/80 bg-muted border border-border/80 px-2 py-0.5 rounded-md">
              {post.key}
            </span>
            <Badge variant="outline" className={`border ${currentStatusProps.className} flex items-center gap-1 text-[10px] h-4 px-1.5 font-medium`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {currentStatusProps.label}
            </Badge>
            {post.postType === 'thread' ? (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-950/10 dark:text-purple-400 border border-purple-500/10 flex items-center gap-1 text-[10px] h-4 px-1.5 font-semibold">
                <Layers className="w-2.5 h-2.5" /> Thread
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground/80 border-border/80 flex items-center gap-1 text-[10px] h-4 px-1.5">
                <FileText className="w-2.5 h-2.5" /> Standard
              </Badge>
            )}
            {post.used && (
              <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/15 flex items-center gap-1 text-[10px] h-4 px-1.5 font-medium">
                <Check className="w-2.5 h-2.5" /> Posted / Used
              </Badge>
            )}
          </div>
          <p className={`text-[13.5px] leading-relaxed font-sans transition-all text-foreground/90 ${post.used ? 'text-muted-foreground/75 italic line-through decoration-muted-foreground/30' : 'font-medium'}`}>
            {post.content}
          </p>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground/85 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-muted-foreground/60" /> {formatDate(post.updatedAt)}
            </span>
            <span className={charTextColor}>
              {charCount} / {charLimit} characters
            </span>
          </div>
        </div>

        {/* Action Toolbar with precise tooltips and identical grid mapping */}
        <div className="flex items-center gap-1 flex-shrink-0 self-end md:self-center">
          {/* Used Switch */}
          <Tooltip>
            <TooltipTrigger render={
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded-md transition-colors ${post.used ? 'text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10' : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/70'}`}
                onClick={toggleUsed}
              >
                {post.used ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </Button>
            } />
            <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
              {post.used ? 'Mark as Draft / Unused' : 'Mark as Posted / Used'}
            </TooltipContent>
          </Tooltip>

          {/* Copy Button */}
          <Tooltip>
            <TooltipTrigger render={
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded-md transition-all duration-200 ${copied ? 'text-emerald-500 bg-emerald-500/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'}`}
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 animate-scale-up" /> : <Copy className="h-4 w-4" />}
              </Button>
            } />
            <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
              {copied ? 'Copied body!' : 'Copy draft content'}
            </TooltipContent>
          </Tooltip>

          {/* Edit Dialog Button */}
          <Tooltip>
            <TooltipTrigger render={
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70"
                onClick={() => {
                  setEditContent(post.content);
                  setEditStatus(post.status);
                  setEditType(post.postType);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            } />
            <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
              Edit Workspace Post
            </TooltipContent>
          </Tooltip>

          {/* More Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger render={
                <DropdownMenuTrigger render={
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70" 
                  />
                }>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                Post Options/States
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-40 p-1 rounded-lg">
              <DropdownMenuItem onClick={() => handleUpdateStatus('draft')} className="text-xs">
                <Clock className="w-3.5 h-3.5 mr-2 text-muted-foreground/80" /> Change to Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('published')} className="text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Publish Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('pinned')} className="text-xs">
                <Pin className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Pin To Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('bookmarked')} className="text-xs">
                <Bookmark className="w-3.5 h-3.5 mr-2 text-amber-500" /> Bookmark Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('archived')} className="text-xs">
                <Archive className="w-3.5 h-3.5 mr-2 text-zinc-500" /> Archive Item
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
      className={`relative flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xs border border-border/75 hover:border-primary/20 bg-card rounded-xl transition-all duration-300 group/card pb-3 ${post.used ? 'opacity-70 bg-muted/10' : ''}`}
    >
      <CardHeader className="p-3.5 pb-2 border-b border-border/30 bg-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10.5px] font-bold tracking-wider text-primary/85 bg-secondary px-1.5 py-0.5 rounded-md border border-border/40">
              {post.key}
            </span>
            <Badge variant="outline" className={`border ${currentStatusProps.className} flex items-center gap-1 text-[10px] h-4.5 px-1.5 font-medium`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {currentStatusProps.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {post.postType === 'thread' ? (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-950/10 dark:text-purple-400 border border-purple-500/10 flex items-center gap-1 text-[10px] h-4.5 px-1.5 font-semibold">
                <Layers className="w-2.5 h-2.5" /> Thread
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground/80 border-border/75 flex items-center gap-1 text-[10px] h-4.5 px-1.5">
                <FileText className="w-2.5 h-2.5" /> Standard
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 pt-3 pb-3 flex-1">
        <p className={`text-[13.5px] leading-relaxed font-sans transition-all text-foreground/90 ${post.used ? 'text-muted-foreground/75 italic line-through decoration-muted-foreground/30' : 'font-medium'}`}>
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="px-3.5 pt-1 pb-0 flex flex-col gap-2.5">
        {/* Compact Character & Limit indicator line */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[9.5px] mb-1 font-mono tracking-tight text-muted-foreground/85">
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-muted-foreground/50" /> {formatDate(post.updatedAt)}
            </span>
            <span className={charTextColor}>
              {charsLeft < 0 ? `Exceeded (+${Math.abs(charsLeft)})` : `${charCount}/${charLimit} chars`}
            </span>
          </div>
          <div className="w-full bg-muted/55 rounded-full h-[2.5px] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${charBarColor}`}
              style={{ width: `${charPercentage}%` }}
            />
          </div>
        </div>

        {/* Clean, Icon-based Bottom Action Toolbar */}
        <div className="flex items-center justify-between w-full pt-1.5 border-t border-border/30">
          <div className="flex items-center">
            {post.used && (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded-full">
                Posted / Used
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-0.5">
            {/* Mark as posted/used */}
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-7.5 w-7.5 rounded-md transition-colors ${post.used ? 'text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10' : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/70'}`}
                  onClick={toggleUsed}
                >
                  {post.used ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </Button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                {post.used ? 'Mark as Unused' : 'Mark as Used'}
              </TooltipContent>
            </Tooltip>

            {/* Quick copy body */}
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-7.5 w-7.5 rounded-md transition-all duration-200 ${copied ? 'text-emerald-500 bg-emerald-500/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'}`}
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-4 w-4 animate-scale-up" /> : <Copy className="h-4 w-4" />}
                </Button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                {copied ? 'Copied body!' : 'Copy draft'}
              </TooltipContent>
            </Tooltip>

            {/* Edit details */}
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7.5 w-7.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  onClick={() => {
                    setEditContent(post.content);
                    setEditStatus(post.status);
                    setEditType(post.postType);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                Edit post Workspace Item
              </TooltipContent>
            </Tooltip>

            {/* Status change actions dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger render={
                  <DropdownMenuTrigger render={
                    <Button 
                      variant="ghost" 
                      className="h-7.5 w-7.5 p-0 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70" 
                    />
                  }>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                } />
                <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                  Change state / Options
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-40 p-1 rounded-lg">
                <DropdownMenuItem onClick={() => handleUpdateStatus('draft')} className="text-xs">
                  <Clock className="w-3.5 h-3.5 mr-2 text-muted-foreground/80" /> Change to Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('published')} className="text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Publish Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('pinned')} className="text-xs">
                  <Pin className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Pin To Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('bookmarked')} className="text-xs">
                  <Bookmark className="w-3.5 h-3.5 mr-2 text-amber-500" /> Bookmark Item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus('archived')} className="text-xs">
                  <Archive className="w-3.5 h-3.5 mr-2 text-zinc-500" /> Archive Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit3 className="w-4.5 h-4.5 text-primary" /> Edit Desk Draft ({post.key})
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4.5 mt-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor={`edit-content-${post.key}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post Body</Label>
                <span className={`text-[11px] font-mono ${editContent.length > 280 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                  {editContent.length} / 280
                </span>
              </div>
              <Textarea
                id={`edit-content-${post.key}`}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
                className="resize-none leading-relaxed text-sm bg-muted/15 border border-border/80 rounded-xl leading-relaxed p-3.5"
                placeholder="Compose your post..."
                required
              />
              {editContent.length > 280 && (
                <p className="text-[11px] text-destructive flex items-center gap-1 font-medium mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Note: Exceeds standard X character limit by {editContent.length - 280} chars.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <Label htmlFor={`edit-status-${post.key}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
                <select 
                  id={`edit-status-${post.key}`}
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus:ring-1 focus:ring-primary cursor-pointer active:bg-muted/10 font-sans font-semibold"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pinned">Pinned</option>
                  <option value="bookmarked">Bookmarked</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <Label htmlFor={`edit-type-${post.key}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post Type</Label>
                <select 
                  id={`edit-type-${post.key}`}
                  value={editType} 
                  onChange={(e) => setEditType(e.target.value as any)}
                  className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus:ring-1 focus:ring-primary cursor-pointer active:bg-muted/10 font-sans font-semibold"
                >
                  <option value="standard">Standard</option>
                  <option value="thread">Thread</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/45 mt-6">
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                className="text-xs font-semibold h-8.5 px-3 rounded-lg"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm"
                className="text-xs font-semibold h-8.5 px-3 rounded-lg"
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

