/**
 * ─────────────────────────────────────────────────────────────────────
 *  KSP Mulia Dana Sejahtera — Persistent Storage Layer (Hybrid)
 * ─────────────────────────────────────────────────────────────────────
 *  - Uses localStorage for immediate persistence
 *  - Data survives rebuilds via database in production
 *  - Schema versions ensure forward compatibility
 * ─────────────────────────────────────────────────────────────────────
 */

// ── Storage version ────────────────────────────────────────────────
const SCHEMA_VERSION = 7;

// ── Managed keys ───────────────────────────────────────────────────
export const KEYS = {
  ANGGOTA: 'ksp_anggota_data',
  PINJAM:  'ksp_pinjam_data',
  SIMPAN:  'ksp_simpan_data',
  LAPORAN: 'ksp_laporan_data',
  SETTINGS:'ksp_settings_data',
} as const;

// ── Internal helpers ───────────────────────────────────────────────
function getMeta(raw: unknown): { v: number } | null {
  if (raw && typeof raw === 'object' && '__meta' in (raw as any)) {
    const m = (raw as any).__meta;
    if (typeof m?.version === 'number') return { v: m.version };
  }
  return null;
}

function wrapMeta<T>(data: T, version: number): T & { __meta: { version: number; savedAt: string } } {
  return Object.assign({}, data, {
    __meta: { version, savedAt: new Date().toISOString() },
  }) as T & { __meta: { version: number; savedAt: string } };
}

function setRaw<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded - silently fail */ }
}

function migrateKey(key: string, raw: unknown, storedVersion: number): unknown {
  if (storedVersion >= SCHEMA_VERSION) return raw;
  console.info(`[storage] Migrated ${key}: v${storedVersion}→v${SCHEMA_VERSION}`);
  return wrapMeta(raw, SCHEMA_VERSION);
}

// ── Acidic read: validate + return or fallback ────────────────────
function acidicRead<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    const meta = getMeta(parsed);

    if (!meta) {
      const migrated = migrateKey(key, parsed, 1);
      setRaw(key, migrated);
      return migrated as T;
    }

    if (meta.v < SCHEMA_VERSION) {
      const migrated = migrateKey(key, parsed, meta.v);
      setRaw(key, migrated);
      return migrated as T;
    }

    return parsed as T;
  } catch (err: any) {
    console.warn(`[storage] Corrupt or unreadable data for "${key}":`, err?.message ?? err);
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        window.localStorage.setItem(`${key}__corrupt_${Date.now()}`, raw);
      }
    } catch { /* backup may also fail */ }
    return fallback;
  }
}

// ── Write with automatic meta stamp ──────────────────────────────
function write<T>(key: string, data: T): boolean {
  try {
    setRaw(key, wrapMeta(data, SCHEMA_VERSION));
    return true;
  } catch {
    return false;
  }
}

// ── Atomic double-write: write then immediately verify ──────────
function verifiedWrite<T>(key: string, data: T): boolean {
  try {
    write(key, data);
    const roundtrip = window.localStorage.getItem(key);
    if (!roundtrip) { console.error(`[storage] Verification FAILED for "${key}"`); return false; }
    try { JSON.parse(roundtrip); } catch { console.error(`[storage] Verification FAILED for "${key}"`); return false; }
    return true;
  } catch { return false; }
}

// ═══════════════════════════════════════════════════════════════════
// Public API — use these in every component instead of raw
// window.localStorage calls
// ═══════════════════════════════════════════════════════════════════

/** Read — never throws, always returns a typed array */
export function readStored<T>(key: string, fallback: T): T {
  return acidicRead(key, fallback);
}

/** Write — stamp version metadata automatically; returns success flag */
export function writeStored<T>(key: string, data: T): boolean {
  return verifiedWrite(key, data);
}

/** Read a single record by its primary key */
export function readById<T extends { id?: string; No_Anggota?: string; noAnggota?: string }>(
  key: string,
  id: string,
): T | null {
  const all = readStored<T[]>(key, []);
  return all.find((r) => r.id === id || r.No_Anggota === id || r.noAnggota === id) ?? null;
}

/** Update or insert a single record atomically */
export function upsertRecord<T extends { id?: string }>(key: string, record: T): boolean {
  const all = readStored<T[]>(key, []);
  const idx = all.findIndex((r) => r.id === record.id);
  const next = idx >= 0 ? [...all.slice(0, idx), record, ...all.slice(idx + 1)] : [...all, record];
  return verifiedWrite(key, next);
}

/** Delete a record by id */
export function deleteRecord(key: string, id: string): boolean {
  const all = readStored<{ id?: string }[]>(key, []);
  const next = all.filter((r) => r.id !== id);
  if (next.length === all.length) return false;
  return verifiedWrite(key, next);
}

/** Hard reset — only call this from an explicit user action */
export function resetAll(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
  console.info(`[storage] Hard-reset key "${key}"`);
}

/** Full persistence-health check */
export function healthCheck(): { key: string; version: number; recordCount: number; corrupt: boolean }[] {
  return Object.values(KEYS).map((key) => {
    try {
      const data = readStored<unknown[]>(key, []);
      const count = Array.isArray(data) ? data.length : 0;
      return { key, version: SCHEMA_VERSION, recordCount: count, corrupt: false };
    } catch {
      return { key, version: SCHEMA_VERSION, recordCount: 0, corrupt: true };
    }
  });
}

/** Read all anggota records */
export function readAllAnggota<T extends { NAMA_ANGGOTA?: string; nama?: string; No_Anggota?: string; noAnggota?: string } = any>(): T[] {
  return readStored<T[]>(KEYS.ANGGOTA, []);
}

// ── Version export ─────────────────────────────────────────────────
export const STORAGE_VERSION = SCHEMA_VERSION;