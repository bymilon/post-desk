import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function usePosts(searchQuery: string = '') {
  return useQuery({
    queryKey: ['posts', searchQuery],
    queryFn: async () => {
      const url = searchQuery ? `/api/v1/posts?query=${encodeURIComponent(searchQuery)}` : '/api/v1/posts';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });
}

export function useInspirations() {
  return useQuery({
    queryKey: ['inspirations'],
    queryFn: async () => {
      const res = await fetch('/api/v1/inspirations');
      if (!res.ok) throw new Error('Failed to fetch inspirations');
      return res.json();
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, payload }: { key: string, payload: any }) => {
      const res = await fetch(`/api/v1/posts/${key}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useCreateInspiration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/v1/inspirations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to capture inspiration');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspirations'] });
    },
  });
}
