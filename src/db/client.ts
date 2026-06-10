import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { Result, Ok, Err } from 'ts-results-es';
import { DatabaseError } from '@/lib/errors';

export function initializeDatabase() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not defined in environment variables');
  }

  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client);
}

// Lazy initialization wrapper
let dbInstance: ReturnType<typeof initializeDatabase> | null = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = initializeDatabase();
  }
  return dbInstance;
}

// Utility to wrap database calls in Monadic Results safely
export async function withDb<T>(
  operation: (db: ReturnType<typeof getDb>) => Promise<T>
): Promise<Result<T, DatabaseError>> {
  try {
    const db = getDb();
    const result = await operation(db);
    return Ok(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Err(new DatabaseError(`Database operation failed: ${message}`));
  }
}
