import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { 
  FileText, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Filter, 
  X, 
  ArrowUpDown,
  Sparkles,
  Pin,
  Layers,
  CheckCircle2,
  Send,
  AlertCircle
} from 'lucide-react';
import { usePosts, useCreatePost } from '@/lib/queries';
import { CreatePostForm } from '@/components/CreatePostForm';
import { PostCard } from '@/components/PostCard';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface PostsWorkspaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function PostsWorkspace({ searchQuery, setSearchQuery }: PostsWorkspaceProps) {
  const { data, isLoading, isError } = usePosts(searchQuery);
  
  // Custom states for view modes and filters
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [usedFilter, setUsedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);

  // Quick Post Draft Dock states
  const [quickPostText, setQuickPostText] = useState('');
  const [quickPostType, setQuickPostType] = useState<'standard' | 'thread'>('standard');
  const createPostMutation = useCreatePost();

  const handleQuickPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPostText.trim()) {
      return;
    }
    
    createPostMutation.mutate(
      { content: quickPostText.trim(), postType: quickPostType },
      {
        onSuccess: () => {
          toast.success(`Successfully added quick desk draft!`);
          setQuickPostText('');
        },
        onError: (err: any) => {
          toast.error(`Failed to submit: ${err.message}`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">Synchronizing Posts Workspace...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl text-center max-w-md mx-auto my-12">
        <p className="text-sm text-destructive font-semibold">Failed to fetch posts</p>
        <p className="text-xs text-muted-foreground mt-1">Please check your database connectivity or retry again.</p>
      </div>
    );
  }

  const rawPosts = data?.data || [];

  // Clientside filtering
  let filteredPosts = [...rawPosts];
  
  if (statusFilter !== 'all') {
    filteredPosts = filteredPosts.filter((post: any) => post.status === statusFilter);
  }
  
  if (typeFilter !== 'all') {
    filteredPosts = filteredPosts.filter((post: any) => post.postType === typeFilter);
  }
  
  if (usedFilter === 'used') {
    filteredPosts = filteredPosts.filter((post: any) => post.used === true);
  } else if (usedFilter === 'unused') {
    filteredPosts = filteredPosts.filter((post: any) => post.used === false);
  }

  // Sorting
  const sortedAndFilteredPosts = filteredPosts.sort((a: any, b: any) => {
    if (sortBy === 'recent') {
      return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
    }
    if (sortBy === 'oldest') {
      return (a.updatedAt || a.createdAt) - (b.updatedAt || b.createdAt);
    }
    if (sortBy === 'characters') {
      return (b.content?.length || 0) - (a.content?.length || 0);
    }
    return 0;
  });

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || usedFilter !== 'all';
  
  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setUsedFilter('all');
    setSortBy('recent');
  };

  return (
    <div className="space-y-4">
      {/* High-Performance Workspace Control Center */}
      <div id="workspace-control-hub" className="border border-border/45 bg-card/60 backdrop-blur-xs rounded-xl p-4 md:p-5 shadow-none transition-all space-y-4">
        
        {/* Row 1: Header / Search / View toggler */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/25">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5 font-sans">
              Workspace Desk
              <Badge variant="secondary" className="font-mono text-[10px] h-4 px-1.5 font-bold bg-muted/50 text-muted-foreground border-0 rounded-sm">
                {rawPosts.length}
              </Badge>
            </h2>

            {/* Live View Mode segment inside the header block */}
            <div className="flex items-center border border-border/45 rounded-md bg-muted/35 p-0.5 h-6.5">
              <Button
                variant="ghost"
                size="icon"
                className={`h-5 w-5 rounded-xs p-0.5 transition-all ${viewMode === 'grid' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-5 w-5 rounded-xs p-0.5 transition-all ${viewMode === 'list' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Right aligned Search field */}
          <div className="w-full sm:w-60">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search desk drafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted/10 w-full text-xs pl-3 pr-8 shadow-none h-7.5 border-border/30 rounded-md focus-visible:ring-1 focus-visible:ring-primary/40"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0.5 top-0.5 h-6.5 w-6.5 text-muted-foreground hover:text-foreground rounded-md"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: 1-Click Preset Ribbon & Advanced Filters Trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Quick Desk Modes Ribbon as High-Density Inline Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-muted/20 border border-border/30 p-0.5 rounded-lg">
            {/* Pill ALL */}
            <Tooltip>
              <TooltipTrigger render={
                <button 
                  type="button"
                  onClick={() => {
                    setUsedFilter('all');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                    (usedFilter === 'all' && statusFilter === 'all' && typeFilter === 'all')
                      ? 'bg-background text-foreground border border-border/30 shadow-2xs font-semibold' 
                      : 'border border-transparent text-muted-foreground/80 hover:text-foreground'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>All</span>
                  <Badge variant="secondary" className="font-mono text-[9px] h-3.5 px-1 bg-muted/40 text-muted-foreground border-0 font-normal">
                    {rawPosts.length}
                  </Badge>
                </button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                Show entire workspace feed
              </TooltipContent>
            </Tooltip>

            {/* Pill Fresh */}
            <Tooltip>
              <TooltipTrigger render={
                <button 
                  type="button"
                  onClick={() => {
                    setUsedFilter('unused');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                    (usedFilter === 'unused' && statusFilter === 'all' && typeFilter === 'all')
                      ? 'bg-background text-foreground border border-border/30 shadow-2xs font-semibold' 
                      : 'border border-transparent text-muted-foreground/80 hover:text-foreground'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Fresh</span>
                  <Badge variant="secondary" className="font-mono text-[9px] h-3.5 px-1 bg-muted/40 text-muted-foreground border-0 font-normal">
                    {rawPosts.filter((p: any) => !p.used).length}
                  </Badge>
                </button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                Unposted / Fresh drafts
              </TooltipContent>
            </Tooltip>

            {/* Pill Pinned */}
            <Tooltip>
              <TooltipTrigger render={
                <button 
                  type="button"
                  onClick={() => {
                    setUsedFilter('all');
                    setStatusFilter('pinned');
                    setTypeFilter('all');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                    (statusFilter === 'pinned' && usedFilter === 'all' && typeFilter === 'all')
                      ? 'bg-background text-foreground border border-border/30 shadow-2xs font-semibold' 
                      : 'border border-transparent text-muted-foreground/80 hover:text-foreground'
                  }`}
                >
                  <Pin className="w-3 h-3 text-indigo-500" />
                  <span>Pinned</span>
                  <Badge variant="secondary" className="font-mono text-[9px] h-3.5 px-1 bg-muted/40 text-muted-foreground border-0 font-normal">
                    {rawPosts.filter((p: any) => p.status === 'pinned').length}
                  </Badge>
                </button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                Templates & references
              </TooltipContent>
            </Tooltip>

            {/* Pill Threads */}
            <Tooltip>
              <TooltipTrigger render={
                <button 
                  type="button"
                  onClick={() => {
                    setUsedFilter('all');
                    setStatusFilter('all');
                    setTypeFilter('thread');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                    (typeFilter === 'thread' && usedFilter === 'all' && statusFilter === 'all')
                      ? 'bg-background text-foreground border border-border/30 shadow-2xs font-semibold' 
                      : 'border border-transparent text-muted-foreground/80 hover:text-foreground'
                  }`}
                >
                  <Layers className="w-3 h-3 text-purple-500" />
                  <span>Threads</span>
                  <Badge variant="secondary" className="font-mono text-[9px] h-3.5 px-1 bg-muted/40 text-muted-foreground border-0 font-normal">
                    {rawPosts.filter((p: any) => p.postType === 'thread').length}
                  </Badge>
                </button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                Segment series threads
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Toggle Sliders controls */}
          <div className="flex items-center gap-1.5">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-7.5 px-2 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted/45 rounded-md"
              >
                Clear Presets
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className={`h-7.5 px-2.5 text-xs font-semibold flex items-center gap-1.5 rounded-md transition-all border ${
                isFiltersExpanded 
                  ? 'bg-accent/40 text-accent-foreground border-border' 
                  : 'bg-background hover:bg-muted/40 border-border/45'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3 text-muted-foreground" />
              <span>Advanced Filters</span>
            </Button>
          </div>
        </div>

        {/* Row 3: Sliding Advanced Filters drawer */}
        <AnimatePresence>
          {isFiltersExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 bg-muted/15 border border-border/40 p-3 rounded-xl">
                  {/* Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-0.5">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-8 rounded-lg border border-border/70 bg-background px-2 py-0.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/35"
                    >
                      <option value="all">All Statuses</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="pinned">Pinned</option>
                      <option value="bookmarked">Bookmarked</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Post Type */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-0.5">Post Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="h-8 rounded-lg border border-border/70 bg-background px-2 py-0.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/35"
                    >
                      <option value="all">All Types</option>
                      <option value="standard">Standard</option>
                      <option value="thread">Threads</option>
                    </select>
                  </div>

                  {/* Usage */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-0.5">Usage Status</label>
                    <select
                      value={usedFilter}
                      onChange={(e) => setUsedFilter(e.target.value)}
                      className="h-8 rounded-lg border border-border/70 bg-background px-2 py-0.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/35"
                    >
                      <option value="all">All Usage</option>
                      <option value="unused">Unused Drafts</option>
                      <option value="used">Used / Posted</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-0.5 flex items-center gap-1">
                      <ArrowUpDown className="w-2.5 h-2.5" /> Sort Sequence
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-8 rounded-lg border border-border/70 bg-background px-2 py-0.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/35"
                    >
                      <option value="recent">Recently Used</option>
                      <option value="oldest">Oldest First</option>
                      <option value="characters">Length (Longest)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 4: Single line streamlined Instadraft tool */}
        <div className="pt-2 border-t border-border/20">
          <form onSubmit={handleQuickPostSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5">
            
            {/* Inline Type Selector with high density */}
            <div className="flex items-center border border-border/25 bg-muted/10 rounded-md p-0.5 h-8 shrink-0 md:w-40">
              <button
                type="button"
                onClick={() => setQuickPostType('standard')}
                className={`flex-1 flex items-center justify-center gap-1 h-full text-[10px] font-bold rounded-sm transition-all ${
                  quickPostType === 'standard' 
                    ? 'bg-background text-foreground shadow-2xs' 
                    : 'text-muted-foreground/80 hover:text-foreground'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Standard</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickPostType('thread')}
                className={`flex-1 flex items-center justify-center gap-1 h-full text-[10px] font-bold rounded-sm transition-all ${
                  quickPostType === 'thread' 
                    ? 'bg-background text-foreground shadow-2xs' 
                    : 'text-muted-foreground/80 hover:text-foreground'
                }`}
              >
                <Layers className="w-3 h-3 text-purple-500" />
                <span>Thread</span>
              </button>
            </div>

            {/* Input with embedded character counts */}
            <div className="relative flex-1">
              <Input
                type="text"
                id="dock-fast-input-field"
                placeholder={
                  quickPostType === 'thread' 
                    ? "Compose sequential thread slide or bullet hook..." 
                    : "Compose converting hook or tweet draft, and press Enter..."
                }
                value={quickPostText}
                onChange={(e) => setQuickPostText(e.target.value)}
                className="bg-muted/10 border-border/30 text-xs h-8 pl-3 pr-14 shadow-none focus-visible:ring-1 focus-visible:ring-primary/40 w-full rounded-md"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className={`text-[9.5px] font-mono font-bold ${
                  (280 - quickPostText.length) < 0 ? 'text-destructive animate-pulse' : 'text-muted-foreground/45'
                }`}>
                  {quickPostText.length}/280
                </span>
              </div>
            </div>

            {/* Action button */}
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  type="submit" 
                  id="dock-submit-button"
                  size="sm" 
                  disabled={!quickPostText.trim() || createPostMutation.isPending}
                  className={`h-8 px-3 rounded-md flex items-center gap-1.5 transition-all text-xs font-semibold shrink-0 ${
                    quickPostText.trim() 
                      ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-none cursor-pointer' 
                      : 'bg-muted/40 text-muted-foreground/35 cursor-not-allowed border-0'
                  }`}
                >
                  {createPostMutation.isPending ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Draft</span>
                    </>
                  )}
                </Button>
              } />
              <TooltipContent side="top" className="font-semibold text-xs py-1 px-2">
                Add Desk Draft Instantly
              </TooltipContent>
            </Tooltip>
          </form>

          {quickPostText.length > 280 && (
            <p className="text-[10px] text-destructive flex items-center gap-1 font-semibold px-1 mt-2.5 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> Exceeds X character limit by {quickPostText.length - 280} text characters.
            </p>
          )}
        </div>
      </div>

      {/* Filter Stats Banner */}
      {hasActiveFilters && (
        <motion.div 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-2.5 border border-primary/10 bg-primary/5 rounded-xl text-xs text-primary"
        >
          <div className="flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5 text-primary" />
            Active filters showing <strong className="font-bold">{sortedAndFilteredPosts.length}</strong> of {rawPosts.length} posts.
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="h-6 px-2 text-xs font-semibold hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Reset options
          </Button>
        </motion.div>
      )}

      {/* Empty States / Grid rendering */}
      {sortedAndFilteredPosts.length === 0 ? (
        rawPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed border-border bg-muted/5 mt-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold">No active posts</h3>
            <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Maintain drafts, schedule threads, and organize post cards dynamically in one dashboard.
            </p>
            <CreatePostForm />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-border/80 bg-muted/5 rounded-2xl">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground/65 mb-3" />
            <h3 className="text-sm font-semibold text-foreground">No matches for active filters</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Try adjusting the filters or clear existing parameters.
            </p>
            <Button onClick={resetFilters} variant="outline" size="sm" className="mt-4 text-xs h-8">
              Reset Filters
            </Button>
          </div>
        )
      ) : (
        /* Render animation containers */
        <AnimatePresence mode="popLayout">
          {viewMode === 'grid' ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {sortedAndFilteredPosts.map((post: any) => (
                <motion.div
                  key={post.key}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostCard post={post} viewMode="grid" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="flex flex-col border border-border bg-card rounded-2xl divide-y divide-border/60 overflow-hidden shadow-xs"
            >
              {sortedAndFilteredPosts.map((post: any) => (
                <motion.div
                  key={post.key}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <PostCard post={post} viewMode="list" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
