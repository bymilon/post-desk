import { withDb } from '@/db/client';
import { xPosts } from '@/db/schema';
import { CreatePostPayload, UpdatePostPayload, SearchPostsQueryOutput } from './schema';
import { generateKey } from '@/lib/key';
import { eq, sql } from 'drizzle-orm';

export async function insertPost(payload: CreatePostPayload) {
  return withDb(async (db) => {
    const [newPost] = await db.insert(xPosts).values({
      key: generateKey(),
      content: payload.content,
      postType: payload.postType,
      status: payload.status,
    }).returning();
    
    return newPost;
  });
}

export async function searchPosts(opts: SearchPostsQueryOutput) {
  return withDb(async (db) => {
    const limit = opts.limit || 20;

    if (opts.q) {
      // Offset pagination for BM25 since rank changes and isn't unique
      const offset = opts.cursor ? Number(opts.cursor) : 0;
      const conditions = [];

      if (opts.status) conditions.push(sql`x.status = ${opts.status}`);
      if (opts.postType) conditions.push(sql`x.post_type = ${opts.postType}`);
      if (opts.used !== undefined) conditions.push(sql`x.used = ${opts.used ? 1 : 0}`);

      let whereClause = conditions.length > 0 ? sql`AND ` : sql``;
      if (conditions.length > 0) {
        whereClause = sql`${whereClause} ${sql.join(conditions, sql` AND `)}`;
      }

      const rawQuery = sql`
        SELECT x.* 
        FROM x_posts x
        JOIN x_posts_fts fts ON x.id = fts.rowid
        WHERE fts.x_posts_fts MATCH ${opts.q}
        ${whereClause}
        ORDER BY fts.rank
        LIMIT ${limit} OFFSET ${offset}
      `;

      const results = await db.all(rawQuery) as (typeof xPosts.$inferSelect)[];
      const nextCursor = results.length === limit ? (offset + limit).toString() : null;

      return { data: results, nextCursor };
    } else {
      let query = db.select().from(xPosts);
      const dbConditions = [];

      if (opts.status) dbConditions.push(eq(xPosts.status, opts.status));
      if (opts.postType) dbConditions.push(eq(xPosts.postType, opts.postType));
      if (opts.used !== undefined) dbConditions.push(eq(xPosts.used, opts.used));
      
      if (opts.cursor) {
        dbConditions.push(sql`${xPosts.id} < ${Number(opts.cursor)}`);
      }

      if (dbConditions.length > 0) {
        query = query.where(sql.join(dbConditions, sql` AND `)) as any;
      }

      const results = await query.orderBy(sql`${xPosts.id} DESC`).limit(limit);
      const nextCursor = results.length === limit ? results[results.length - 1].id.toString() : null;

      return { data: results, nextCursor };
    }
  });
}
export async function updatePost(key: string, payload: UpdatePostPayload) {
  return withDb(async (db) => {
    if (Object.keys(payload).length === 0) {
       // if nothing to update, just return the current post
       const [current] = await db.select().from(xPosts).where(eq(xPosts.key, key)).limit(1);
       return current;
    }
    const [updatedPost] = await db
      .update(xPosts)
      .set({
        ...payload,
        updatedAt: sql`(cast(unixepoch() as int))`,
      })
      .where(eq(xPosts.key, key))
      .returning();
      
    return updatedPost;
  });
}
