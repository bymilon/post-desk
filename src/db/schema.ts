import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { generateKey } from '@/lib/key';

// Core Application Write Models

export const xPosts = sqliteTable('x_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique().$defaultFn(() => generateKey()),
  content: text('content').notNull(),
  status: text('status', { 
    enum: ['draft', 'published', 'archived', 'bookmarked', 'pinned'] 
  }).notNull().default('draft'),
  postType: text('post_type', { 
    enum: ['standard', 'thread'] 
  }).notNull().default('standard'),
  // 0 representing boolean false/unused, 1 representing true/used
  used: integer('used', { mode: 'boolean' }).notNull().default(false),
  // Unix timestamp representation in seconds
  createdAt: integer('created_at').notNull().default(sql`(cast(unixepoch() as int))`),
  updatedAt: integer('updated_at').notNull().default(sql`(cast(unixepoch() as int))`),
}, (table) => ({
  statusIdx: index('x_posts_status_idx').on(table.status),
  postTypeIdx: index('x_posts_post_type_idx').on(table.postType),
  createdAtIdx: index('x_posts_created_at_idx').on(table.createdAt),
}));

export const inspirationPosts = sqliteTable('inspiration_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique().$defaultFn(() => generateKey()),
  sourceUrl: text('source_url'),
  content: text('content').notNull(),
  authorHandle: text('author_handle'),
  tags: text('tags'),
  createdAt: integer('created_at').notNull().default(sql`(cast(unixepoch() as int))`),
}, (table) => ({
  createdAtIdx: index('inspiration_posts_created_at_idx').on(table.createdAt),
}));
