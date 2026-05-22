import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import path from 'node:path';
import fs from 'node:fs';

// ── shared config ─────────────────────────────────────────────────
function getConnectionConfig(): { url: string; authToken?: string } {
  const tursoUrl   = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) return { url: tursoUrl, authToken: tursoToken };

  // Local SQLite fallback
  const dbPath = path.join(process.cwd(), 'ksp.db');
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '');
  return { url: `file:${dbPath}` };
}

const connConfig  = getConnectionConfig();
const libsql      = createClient(connConfig);   // raw @libsql/client instance

export const db         = drizzle(libsql, { schema });
export const libsqlDb   = libsql;   // raw @libsql/client instance — used by API route raw-SQL handlers

// ── Run migrations once at startup (idempotent) ─────────────────────
let _migrationsDone = false;

export async function runMigrations() {
  if (_migrationsDone) return;
  _migrationsDone = true;
  const migrationsDir = path.join(process.cwd(), 'drizzle');
  if (fs.existsSync(migrationsDir)) {
    await migrate(db, { migrationsFolder: migrationsDir });
  }
}

runMigrations().catch(() => {});
