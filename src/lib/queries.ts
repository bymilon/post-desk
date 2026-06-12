/// <reference types="vite/client" />
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_VERSION = 'v1';
const API_BASE = `/api/${API_VERSION}`;

const getHeaders = (extra: Record<string, string> = {}) => {
  const apiKey = import.meta.env.VITE_API_KEY || 'super_secret_key';
  return {
    'Authorization': `Bearer ${apiKey}`,
    ...extra
  };
};

// Generic fetch wrapper for clean Monadic-like error handling
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: getHeaders(options.headers as Record<string, string>),
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function usePosts(searchQuery: string = '') {
  return useQuery({
    queryKey: ['posts', searchQuery],
    queryFn: () => {
      const endpoint = searchQuery ? `/posts?q=${encodeURIComponent(searchQuery)}` : '/posts';
      return apiFetch(endpoint);
    },
  });
}

export function useInspirations() {
  return useQuery({
    queryKey: ['inspirations'],
    queryFn: () => apiFetch('/inspirations'),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => apiFetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, payload }: { key: string, payload: any }) => apiFetch(`/posts/${key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useCreateInspiration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => apiFetch('/inspirations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspirations'] });
    },
  });
}
