import 'dotenv/config';
import { getDb } from './client';
import { sql } from 'drizzle-orm';
import { execSync } from 'child_process';
import { xPosts, inspirationPosts } from './schema';
import { generateKey } from '../lib/key';

async function main() {
  console.log('Pushing schema to database via Drizzle Kit...');
  try {
    execSync('npx drizzle-kit push --accept-warnings', { stdio: 'inherit' });
  } catch (err) {
    console.warn('Drizzle push returned a non-zero code or skipped interactive prompt. Continuing database migration/seeding...', err);
  }

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

    // --- SEEDING SECTION ---
    console.log('Clearing existing records for a fresh seed...');
    await db.delete(xPosts);
    await db.delete(inspirationPosts);

    console.log('Seeding realistic sample copy into X posts...');
    const seedPosts = [
      {
        key: generateKey(1),
        content: "Just shipped the new release of PostDesk! 🚀 Built with React, Hono, and SQLite + FTS5 search indexing—the dev experience is incredibly clean. What are you building today?",
        status: "draft" as const,
        postType: "standard" as const,
        used: false,
      },
      {
        key: generateKey(2),
        content: "Why most databases fail under high concurrent write loads:\n\n- LOCK CONTENTION: concurrent sessions fighting over row headers.\n- DISK IO THRUPUT: random access write operations bottlenecking.\n- CPU SCHEDULING: too many context switches.\n\nFix: Rely on WAL (Write-Ahead Logging) mode, batch transaction writes, and utilize read-replicas. 🧠",
        status: "draft" as const,
        postType: "thread" as const,
        used: false,
      },
      {
        key: generateKey(3),
        content: "API design tip: When returning validation errors, don't just return a raw message. Return a structured error list containing path, clear field constraints, and contextual tags. Your frontend developers will thank you.",
        status: "draft" as const,
        postType: "standard" as const,
        used: false,
      },
      {
        key: generateKey(4),
        content: "The secret to 10x engineering is not typing faster, it is spending more time defining the correct data schemas. A clean relational schema prevents 90% of downstream state-management complexity.",
        status: "published" as const,
        postType: "standard" as const,
        used: false,
      },
      {
        key: generateKey(5),
        content: "If you are using SQL databases: indexing is not a silver bullet.\n\nAn index speeds up reads but slows down every single write update.\nBe selective: index fields involved in JOINs, WHERE clauses, and ORDER BY.",
        status: "bookmarked" as const,
        postType: "standard" as const,
        used: false,
      },
      {
        key: generateKey(6),
        content: "Just built an FTS5 virtual table trigger in SQLite. Instant full-text search across all X drafts. It's incredibly fast and fits in a zero-dependency local DB file. Simplicity always wins.",
        status: "pinned" as const,
        postType: "standard" as const,
        used: false,
      }
    ];

    for (const p of seedPosts) {
      try {
        await db.insert(xPosts).values(p);
        console.log(`Seeded post: ${p.key}`);
      } catch (insertErr) {
        console.warn(`Could not seed post with key ${p.key}:`, insertErr);
      }
    }
    console.log('Successfully completed X posts seeding!');

    console.log('Seeding sample collection into Inspirations...');
    const seedInspirations = [
      {
        key: generateKey(7),
        content: "A beautiful minimal canvas with a single focus has 10x the impact of a cluttered dashboard with 50 features.",
        sourceUrl: "https://twitter.com/schwarz_design",
        authorHandle: "@schwarz_design",
        tags: "design,ux,minimalism",
      },
      {
        key: generateKey(8),
        content: "TypeScript type-level assertions are the closest thing to automatic correctness for configuration files. Validate early, validate hard.",
        sourceUrl: "https://twitter.com/dan_abramov",
        authorHandle: "@dan_abramov",
        tags: "typescript,programming",
      },
      {
        key: generateKey(9),
        content: "Fast queries are built in the schema definition phase, not in production performance tuning.",
        sourceUrl: "https://twitter.com/database_guru",
        authorHandle: "@database_guru",
        tags: "sql,performance,scaling",
      }
    ];

    for (const i of seedInspirations) {
      try {
        await db.insert(inspirationPosts).values(i);
        console.log(`Seeded inspiration: ${i.key}`);
      } catch (insertErr) {
        console.warn(`Could not seed inspiration with key ${i.key}:`, insertErr);
      }
    }
    console.log('Successfully completed Inspirations seeding!');

  } catch (error) {
    console.error('Failed to setup/seed database', error);
    process.exit(1);
  }

  console.log('Database setup complete.');
  process.exit(0);
}

main().catch((e) => {
  console.error('Fatal initialization error:', e);
  process.exit(1);
});
