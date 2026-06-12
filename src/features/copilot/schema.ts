import * as v from 'valibot';

export const CreateDraftCommandSchema = v.object({
  intent: v.pipe(v.string(), v.minLength(1, 'Intent is required')),
  context: v.optional(v.string(), ''),
  postType: v.optional(v.string(), 'Insight'),
});

export type CreateDraftPayload = v.InferInput<typeof CreateDraftCommandSchema>;
