import 'dotenv/config';
import { getDb } from './client';
import { sql } from 'drizzle-orm';
import { execSync } from 'child_process';

async function main() {
  console.log('Pushing schema to database via Drizzle Kit...');
  execSync('npx drizzle-kit push', { stdio: 'inherit' });

  console.log('Setting up FTS5 Virtual Tables and Triggers...');
  const db = getDb();

  try {
    // FTS-1: Define x_posts_fts Virtual Table
    // We use an external content table pointing to x_posts.
    await db.run(sql`
      CREATE VIRTUAL TABLE IF NOT EXISTS x_posts_fts USING fts5(
          content,
          content='x_posts',
          content_rowid='id'
      );
    `);

    // FTS-2: Implement SQLite Synchronization Triggers
    // INSERT Trigger
    await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS x_posts_fts_insert AFTER INSERT ON x_posts BEGIN
          INSERT INTO x_posts_fts(rowid, content) VALUES (new.id, new.content);
      END;
    `);

    // DELETE Trigger
    await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS x_posts_fts_delete AFTER DELETE ON x_posts BEGIN
          INSERT INTO x_posts_fts(x_posts_fts, rowid, content) VALUES('delete', old.id, old.content);
      END;
    `);

    // UPDATE Trigger
    await db.run(sql`
      CREATE TRIGGER IF NOT EXISTS x_posts_fts_update AFTER UPDATE ON x_posts BEGIN
          INSERT INTO x_posts_fts(x_posts_fts, rowid, content) VALUES('delete', old.id, old.content);
          INSERT INTO x_posts_fts(rowid, content) VALUES (new.id, new.content);
      END;
    `);

    // Populate FTS table from existing data if any (initial sync)
    await db.run(sql`
        INSERT INTO x_posts_fts(x_posts_fts, rowid, content) 
        SELECT 'rebuild', id, content FROM x_posts 
        WHERE id NOT IN (SELECT rowid FROM x_posts_fts);
    `);

    console.log('FTS5 and Triggers successfully set up.');
  } catch (error) {
    console.error('Failed to setup FTS5 indices', error);
    process.exit(1);
  }

  console.log('Database setup complete.');
  process.exit(0);
}

main().catch((e) => {
  console.error('Fatal initialization error:', e);
  process.exit(1);
});
