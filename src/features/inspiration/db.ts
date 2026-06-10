import { withDb } from '@/db/client';
import { inspirationPosts } from '@/db/schema';
import { CreateInspirationPayload, GetInspirationsQueryOutput } from './schema';
import { generateKey } from '@/lib/key';
import { sql } from 'drizzle-orm';

export async function insertInspiration(payload: CreateInspirationPayload) {
  return withDb(async (db) => {
    const [newInspiration] = await db.insert(inspirationPosts).values({
      key: generateKey(),
      content: payload.content,
      sourceUrl: payload.sourceUrl,
      authorHandle: payload.authorHandle,
      tags: payload.tags,
    }).returning();
    
    return newInspiration;
  });
}

export async function getInspirations(opts: GetInspirationsQueryOutput) {
  return withDb(async (db) => {
    const limit = opts.limit || 20;
    
    let query = db.select().from(inspirationPosts);
    
    if (opts.cursor) {
      query = query.where(sql`${inspirationPosts.id} < ${Number(opts.cursor)}`) as any;
    }
    
    const results = await query.orderBy(sql`${inspirationPosts.id} DESC`).limit(limit);
    const nextCursor = results.length === limit ? results[results.length - 1].id.toString() : null;

    return { data: results, nextCursor };
  });
}
