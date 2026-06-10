import * as v from 'valibot';

export const CreateInspirationCommandSchema = v.object({
  content: v.pipe(v.string(), v.minLength(1, 'Inspiration content is required.')),
  sourceUrl: v.optional(v.string()),
  authorHandle: v.optional(v.string()),
  tags: v.optional(v.string()),
});

export type CreateInspirationPayload = v.InferInput<typeof CreateInspirationCommandSchema>;

export const GetInspirationsQuerySchema = v.object({
  limit: v.optional(v.pipe(v.string(), v.transform(Number))),
  cursor: v.optional(v.string()),
});

export type GetInspirationsQueryOutput = v.InferOutput<typeof GetInspirationsQuerySchema>;
