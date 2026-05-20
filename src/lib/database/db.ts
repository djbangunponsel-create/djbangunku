import { drizzle } from 'drizzle-orm/@libsql/client';
import { migrate } from 'drizzle-orm/@libsql/migrator';
import * as schema from './schema';
import path from 'node:path';
import fs from 'node:fs';

// ── Database connection ─────────────────────────────────────────
// Local dev : SQLite file  →  file:./ksp.db
// Production: Turso / any Turso-compatible libsql:// URL → set TURSO_DATABASE_URL env var

function createClient() {
  const tursoUrl   = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    // Turso / remote libsql (production or remote dev)
    return drizzle({
      client:   'libsql',
      url:      tursoUrl,
      authToken: tursoToken,
      schema,
    });
  }

  // Local SQLite fallback
  const dbPath = path.join(process.cwd(), 'ksp.db');
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
  }
  return drizzle({
    client:  'libsql',
    url:     `file:${dbPath}`,
    schema,
  });
}

export const db = createClient();

// ── Run migrations on startup (idempotent) ─────────────────────
export async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'drizzle');
  if (fs.existsSync(migrationsDir)) {
    await migrate(db, { migrationsFolder: migrationsDir });
  }
}
