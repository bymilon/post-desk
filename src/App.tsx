import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Lightbulb, Settings, MoreHorizontal, LayoutDashboard } from 'lucide-react';
import { usePosts, useInspirations, useUpdatePost } from '@/lib/queries';
import { CreatePostForm } from '@/components/CreatePostForm';
import { CreateInspirationForm } from '@/components/CreateInspirationForm';

function PostsList({ searchQuery }: { searchQuery: string }) {
  const { data, isLoading, isError } = usePosts(searchQuery);
  const updatePost = useUpdatePost();

  if (isLoading) return <div className="p-4 text-sm text-foreground/70">Loading posts...</div>;
  if (isError) return <div className="p-4 text-sm text-red-500">Failed to load posts.</div>;

  return (
    <div className="space-y-4 pt-4">
      {data?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed border-border/50 bg-muted/5 mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No posts found</h3>
          <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-sm mx-auto">
            You don't have any active posts or drafts matching your search. Start by creating a new post.
          </p>
          <CreatePostForm />
        </div>
      ) : (
        data?.data?.map((post: any) => (
          <Card key={post.key} className="transition-all hover:bg-muted/50 cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-semibold">{post.key}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status}</Badge>
                  <Badge variant="outline">{post.postType}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updatePost.mutate({ key: post.key, payload: { status: 'draft' } })}>
                        Mark as Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updatePost.mutate({ key: post.key, payload: { status: 'published' } })}>
                        Publish
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updatePost.mutate({ key: post.key, payload: { status: 'archived' } })}>
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{post.text}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function InspirationsList() {
  const { data, isLoading, isError } = useInspirations();

  if (isLoading) return <div className="p-4 text-sm text-foreground/70">Loading inspirations...</div>;
  if (isError) return <div className="p-4 text-sm text-red-500">Failed to load inspirations.</div>;

  return (
    <div className="space-y-4 pt-4">
      {data?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed border-border/50 bg-muted/5 mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lightbulb className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No inspirations saved</h3>
          <p className="mt-2 mb-6 text-sm text-muted-foreground max-w-sm mx-auto">
            Capture ideas, feature concepts, or links. Your saved references will appear here.
          </p>
          <CreateInspirationForm />
        </div>
      ) : (
        data?.data?.map((inspiration: any) => (
          <Card key={inspiration.id} className="transition-all hover:bg-muted/50 cursor-pointer">
            <CardHeader className="pb-2">
               <div className="flex justify-between items-start">
                 <CardTitle className="text-base font-semibold">Inspiration #{inspiration.id}</CardTitle>
                 {inspiration.tags && <Badge variant="outline">{inspiration.tags}</Badge>}
               </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{inspiration.content}</p>
              {inspiration.sourceUrl && (
                <a href={inspiration.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 mt-2 hover:underline block">
                  {inspiration.sourceUrl}
                </a>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

type ViewContext = 'posts' | 'inspirations';

export default function App() {
  const [activeView, setActiveView] = useState<ViewContext>('posts');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Rail */}
      <aside className="w-16 flex-shrink-0 border-r border-border/50 bg-muted/20 flex flex-col items-center py-4 z-10 transition-colors">
        <Tooltip>
          <TooltipTrigger render={<div className="flex items-center justify-center w-10 h-10 mb-8 rounded-lg bg-primary text-primary-foreground font-bold shadow-sm cursor-pointer" />}>
            P
          </TooltipTrigger>
          <TooltipContent side="right">PostDesk</TooltipContent>
        </Tooltip>
        
        <nav className="flex flex-col gap-4 flex-1">
          <Tooltip>
            <TooltipTrigger render={<Button 
              variant={activeView === 'posts' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="w-10 h-10 rounded-xl"
              onClick={() => setActiveView('posts')}
            />}>
              <FileText className="w-5 h-5" />
            </TooltipTrigger>
            <TooltipContent side="right">Posts Workspace</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button 
              variant={activeView === 'inspirations' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="w-10 h-10 rounded-xl"
              onClick={() => setActiveView('inspirations')}
            />}>
              <Lightbulb className="w-5 h-5" />
            </TooltipTrigger>
            <TooltipContent side="right">Inspirations Board</TooltipContent>
          </Tooltip>
        </nav>
        
        <nav className="mt-auto flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl" />}>
              <Settings className="w-5 h-5" />
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>

      {/* Main Workspace Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <header className="h-16 flex-shrink-0 border-b border-border/50 flex items-center px-8 bg-background/95 backdrop-blur z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-muted-foreground mr-2" />
            <h1 className="text-xl font-bold tracking-tight">
              {activeView === 'posts' ? 'Posts Workspace' : 'Inspirations Board'}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {activeView === 'posts' ? <CreatePostForm /> : <CreateInspirationForm />}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-8 w-full max-w-5xl mx-auto">
           {activeView === 'posts' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">Active Posts</h2>
                  <p className="text-sm text-muted-foreground">Manage and track your active publications and drafts.</p>
                </div>
                <div className="max-w-md">
                  <Input
                    type="search"
                    placeholder="Search posts (FTS)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-card w-full"
                  />
                </div>
                <PostsList searchQuery={searchQuery} />
              </div>
           )}

           {activeView === 'inspirations' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">Saved Inspirations</h2>
                  <p className="text-sm text-muted-foreground">A collection of ideas, links, and quick notes.</p>
                </div>
                <InspirationsList />
              </div>
           )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
