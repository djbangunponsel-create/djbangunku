import { drizzle } from 'drizzle-orm/libsql';
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

// ── Run SQL migrations at startup — idempotent (CREATE TABLE IF NOT EXISTS) ──────────
let _migrationsDone = false;

export async function runMigrations() {
  if (_migrationsDone) return;
  _migrationsDone = true;

  const migrationsDir = path.join(process.cwd(), 'drizzle');
  if (!fs.existsSync(migrationsDir)) return;

  const sqlFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of sqlFiles) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8').trim();
    if (!sql) continue;

    try {
      // Split on semicolons so the file with multiple CREATE statements
      // (e.g. CREATE TABLE + CREATE INDEX) can be executed individually.
      const statements = sql
        .replace(/--[^\n]*/g, '')  // strip line comments
        .split(';')
        .map(s => s.trim())
        .filter(Boolean);

      for (const stmt of statements) {
        await libsqlDb.execute(stmt);
      }
    } catch (e: any) {
      // silently ignore "table already exists" style errors;
      // surface everything else to the dev console
      const msg = e.message ?? '';
      if (!msg.toLowerCase().includes('table') || !msg.toLowerCase().includes('already')) {
        console.error(`[db] Migration ${file} error:`, msg);
      }
    }
  }
}

runMigrations().catch(() => {});
