import { Context } from 'hono';
import * as v from 'valibot';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { CreatePostCommandSchema, UpdatePostCommandSchema, SearchPostsQuerySchema } from './schema';
import { insertPost, updatePost, searchPosts } from './db';

export async function createPostHandler(c: Context) {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload' }, 400);
  }

  const parseResult = v.safeParse(CreatePostCommandSchema, body);
  if (!parseResult.success) {
    const errorDetails = parseResult.issues.map(i => ({ path: i.path?.map(p => p.key).join('.'), message: i.message }));
    const validationError = new ValidationError('Payload validation failed', errorDetails);
    return c.json({ error: validationError.message, details: validationError.details, tag: validationError._tag }, 400);
  }

  const dbResult = await insertPost(parseResult.output);

  if (dbResult.isErr()) {
    const error = dbResult.error;
    return c.json({ error: error.message, tag: error._tag }, 500);
  }

  return c.json({ data: dbResult.value }, 201);
}

export async function updatePostHandler(c: Context) {
  const key = c.req.param('key');
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload' }, 400);
  }

  const parseResult = v.safeParse(UpdatePostCommandSchema, body);
  if (!parseResult.success) {
    const errorDetails = parseResult.issues.map(i => ({ path: i.path?.map(p => p.key).join('.'), message: i.message }));
    const validationError = new ValidationError('Payload validation failed', errorDetails);
    return c.json({ error: validationError.message, details: validationError.details, tag: validationError._tag }, 400);
  }

  const dbResult = await updatePost(key, parseResult.output);

  if (dbResult.isErr()) {
    const error = dbResult.error;
    return c.json({ error: error.message, tag: error._tag }, 500);
  }

  if (dbResult.value === undefined) {
    const notFoundError = new NotFoundError('Post not found');
    return c.json({ error: notFoundError.message, tag: notFoundError._tag }, 404);
  }

  return c.json({ data: dbResult.value }, 200);
}

export async function searchPostsHandler(c: Context) {
  const queryParams = c.req.query();
  const parseResult = v.safeParse(SearchPostsQuerySchema, queryParams);
  
  if (!parseResult.success) {
    const errorDetails = parseResult.issues.map(i => ({ path: i.path?.map(p => p.key).join('.'), message: i.message }));
    const validationError = new ValidationError('Query validation failed', errorDetails);
    return c.json({ error: validationError.message, details: validationError.details, tag: validationError._tag }, 400);
  }

  const dbResult = await searchPosts(parseResult.output);

  if (dbResult.isErr()) {
    const error = dbResult.error;
    return c.json({ error: error.message, tag: error._tag }, 500);
  }

  return c.json({ data: dbResult.value.data, nextCursor: dbResult.value.nextCursor }, 200);
}
