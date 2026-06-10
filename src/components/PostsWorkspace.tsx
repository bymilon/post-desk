import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Filter, 
  X, 
  ArrowUpDown
} from 'lucide-react';
import { usePosts } from '@/lib/queries';
import { CreatePostForm } from '@/components/CreatePostForm';
import { PostCard } from '@/components/PostCard';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="space-y-6">
      {/* Header and Search Sub-bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            Workspace Content
            <Badge variant="outline" className="font-mono text-[10px] h-5 px-1.5 font-bold">
              {rawPosts.length} total
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">Search, filter, and quick publish drafts.</p>
        </div>
        <div className="w-full md:w-80">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search posts (Full Text Search)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card w-full text-sm pl-3 pr-10 shadow-xs h-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/65 bg-muted/20 dark:bg-muted/10 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background px-2.5 py-0.5 text-xs font-medium focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/40 transition-all font-sans"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
              <option value="pinned">Pinned</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">Post Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background px-2.5 py-0.5 text-xs font-medium focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/40 transition-all font-sans"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="thread">Threads</option>
            </select>
          </div>

          {/* Used Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">Usage</label>
            <select
              value={usedFilter}
              onChange={(e) => setUsedFilter(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background px-2.5 py-0.5 text-xs font-medium focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/40 transition-all font-sans"
            >
              <option value="all">All Usage</option>
              <option value="unused">Unused</option>
              <option value="used">Used</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-0.5 flex items-center gap-1">
              <ArrowUpDown className="w-2.5 h-2.5" /> Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background px-2.5 py-0.5 text-xs font-medium focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-pointer hover:bg-muted/40 transition-all font-sans"
            >
              <option value="recent">Recently Updated</option>
              <option value="oldest">Oldest First</option>
              <option value="characters">Length (Longest)</option>
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <div className="flex items-center border border-border rounded-lg bg-card/60 p-1 shadow-sm h-9">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-md p-1 transition-all ${viewMode === 'grid' ? 'bg-muted/80 text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-md p-1 transition-all ${viewMode === 'list' ? 'bg-muted/80 text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
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
