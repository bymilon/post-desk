import * as v from 'valibot';

export const CreateDraftCommandSchema = v.object({
  intent: v.pipe(v.string(), v.minLength(1, 'Intent is required')),
  context: v.optional(v.string(), ''),
  postType: v.optional(v.string(), 'Insight'),
  // New fields for AI Writer Workspace
  style: v.optional(v.string(), 'Personal'),
  format: v.optional(v.string(), 'Single tweet'),
  length: v.optional(v.string(), 'Short'),
  audience: v.optional(v.string(), ''),
});

export type CreateDraftPayload = v.InferInput<typeof CreateDraftCommandSchema>;
