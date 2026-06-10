import * as v from 'valibot';

export const CreatePostCommandSchema = v.object({
  content: v.pipe(v.string(), v.minLength(1, 'Post content is required.')),
  postType: v.optional(v.picklist(['standard', 'thread']), 'standard'),
  status: v.optional(v.picklist(['draft', 'published', 'archived', 'bookmarked', 'pinned']), 'draft'),
});

export type CreatePostPayload = v.InferInput<typeof CreatePostCommandSchema>;

export const UpdatePostCommandSchema = v.object({
  content: v.optional(v.pipe(v.string(), v.minLength(1, 'Post content is required.'))),
  status: v.optional(v.picklist(['draft', 'published', 'archived', 'bookmarked', 'pinned'])),
  used: v.optional(v.boolean()),
});

export type UpdatePostPayload = v.InferInput<typeof UpdatePostCommandSchema>;

export const SearchPostsQuerySchema = v.object({
  q: v.optional(v.string()),
  limit: v.optional(v.pipe(v.string(), v.transform(Number))),
  cursor: v.optional(v.string()),
  status: v.optional(v.picklist(['draft', 'published', 'archived', 'bookmarked', 'pinned'])),
  postType: v.optional(v.picklist(['standard', 'thread'])),
  used: v.optional(v.pipe(v.string(), v.transform(val => val === 'true'))),
});

export type SearchPostsQuery = v.InferInput<typeof SearchPostsQuerySchema>;
export type SearchPostsQueryOutput = v.InferOutput<typeof SearchPostsQuerySchema>;
