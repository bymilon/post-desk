import { Context } from 'hono';
import * as v from 'valibot';
import { ValidationError } from '@/lib/errors';
import { CreateInspirationCommandSchema, GetInspirationsQuerySchema } from './schema';
import { insertInspiration, getInspirations } from './db';

export async function createInspirationHandler(c: Context) {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload' }, 400);
  }

  const parseResult = v.safeParse(CreateInspirationCommandSchema, body);
  if (!parseResult.success) {
    const errorDetails = parseResult.issues.map(i => ({ path: i.path?.map(p => p.key).join('.'), message: i.message }));
    const validationError = new ValidationError('Payload validation failed', errorDetails);
    return c.json({ error: validationError.message, details: validationError.details, tag: validationError._tag }, 400);
  }

  const dbResult = await insertInspiration(parseResult.output);

  if (dbResult.isErr()) {
    const error = dbResult.error;
    return c.json({ error: error.message, tag: error._tag }, 500);
  }

  return c.json({ data: dbResult.value }, 201);
}

export async function getInspirationsHandler(c: Context) {
  const queryParams = c.req.query();
  const parseResult = v.safeParse(GetInspirationsQuerySchema, queryParams);
  
  if (!parseResult.success) {
    const errorDetails = parseResult.issues.map(i => ({ path: i.path?.map(p => p.key).join('.'), message: i.message }));
    const validationError = new ValidationError('Query validation failed', errorDetails);
    return c.json({ error: validationError.message, details: validationError.details, tag: validationError._tag }, 400);
  }

  const dbResult = await getInspirations(parseResult.output);

  if (dbResult.isErr()) {
    const error = dbResult.error;
    return c.json({ error: error.message, tag: error._tag }, 500);
  }

  return c.json({ data: dbResult.value.data, nextCursor: dbResult.value.nextCursor }, 200);
}
