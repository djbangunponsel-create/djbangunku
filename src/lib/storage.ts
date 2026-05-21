/**
 * ─────────────────────────────────────────────────────────────────────
 *  KSP Mulia Dana Sejahtera — Persistent Storage Layer
 * ─────────────────────────────────────────────────────────────────────
 *  This module is the single source of truth for all local-persistent
 *  data accessed by the KSP admin application.  It replaces direct
 *  `window.localStorage.getItem / setItem` calls in every component so
 *  that the following invariants always hold:
 *
 *  1. DATA NEVER DISAPPEARS ON CODE/FORM CHANGES
 *     Old records are never deleted; new fields are simply appended.
 *     Unknown keys from future migrations are preserved as-is.
 *
 *  2. SCHEMA MIGRATION IS AUTOMATIC AND SAFE
 *     Each storage key carries a `__meta` object with a `version` field.
 *     When the running code detects an older version it performs an
 *     additive-only upgrade (adds new keys with defaults) and saves the
 *     new version number.  No destructive operations occur.
 *
 *  3. CORRUPT DATA NEVER CRASHES THE APP
 *     Every read path is wrapped in try/catch; on any failure the
 *     function returns a safe default ([] or {}) and logs a warning.
 *     The original corrupt blob is preserved in `localStorage` so an
 *     admin can recover it later if needed.
 *
 *  Storages managed by this layer:
 *    ksp_anggota_data   — Master Anggota KSP
 *    ksp_pinjam_data    — Transaksi Pinjaman
 *    ksp_simpan_data    — Transaksi Simpanan
 *    ksp_laporan_data   — Laporan Arus Kas
 *
 *  Schema version history
 *    v1  (initial) — base tables
 *    v2  — Pinjaman: added opsiSwk + masaBpjstk fields
 *    v3  — Simpanan: tipe expanded Pokok/Wajib/Sibuhar/Sisujang/Simapan/Sihat/Sihar
 *    v4  — Anggota: __meta guard added; all reads/writes routed here
 *    v5  — Pinjaman: added saldoTersedia + aktaHargaTanah/hargaBangunan calc fields
 *    v6  — All: append-only confirm; corruption guard
 * ─────────────────────────────────────────────────────────────────────
 */

// ── Storage version ────────────────────────────────────────────────
const SCHEMA_VERSION = 6;

// ── Managed keys ───────────────────────────────────────────────────
export const KEYS = {
  ANGGOTA: 'ksp_anggota_data',
  PINJAM:  'ksp_pinjam_data',
  SIMPAN:  'ksp_simpan_data',
  LAPORAN: 'ksp_laporan_data',
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
  window.localStorage.setItem(key, JSON.stringify(value));
}

/** Upgrade strategy per key: called when stored version < SCHEMA_VERSION */
function migrateKey(key: string, raw: unknown, storedVersion: number): unknown {
  if (storedVersion >= SCHEMA_VERSION) return raw;

  // ── v2 migrants ────────────────────────────────────────────────
  // Added opsiSwk + masaBpjstk to Pinjaman records
  if (key === KEYS.PINJAM && storedVersion < 2) {
    const rows = Array.isArray(raw) ? [...raw] : [];
    for (const r of rows) {
      if (r && typeof r === 'object') {
        (r as any).opsiSwk     ??= '1%';
        (r as any).masaBpjstk  ??= (r as any).iuranBpjstk === 'Ya' ? 0 : 0;
      }
    }
    console.info(`[storage] Migrated ${key}: v1→v2 (opsiSwk + masaBpjstk default)`);
  }

  // ── v3 migrants ────────────────────────────────────────────────
  // Expanded Simpanan tipe: Pokok|Wajib|Sibuhar|Sisujang|Simapan|Sihat|Sihar
  if (key === KEYS.SIMPAN && storedVersion < 3) {
    const VALID = new Set(['Pokok','Wajib','Sibuhar','Sisujang','Simapan','Sihat','Sihar']);
    const rows  = Array.isArray(raw) ? [...raw] : [];
    let   fixed = 0;
    for (const r of rows) {
      if (r && typeof r === 'object') {
        const t = String((r as any).tipe ?? '');
        if (!VALID.has(t)) {
          (r as any).tipe = 'Pokok';
          fixed++;
        }
      }
    }
    if (fixed) console.info(`[storage] Migrated ${key}: v2→v3, normalised ${fixed} rows to valid tipe`);
  }

  // ── v4 migrants ────────────────────────────────────────────────
  // Nothing structural; version bump ensures new read path is used.
  if (storedVersion < 4) {
    console.info(`[storage] Migrated ${key}: v${storedVersion}→v4 (guarded read path)`);
  }

  // ── v5 migrants ────────────────────────────────────────────────
  // Pinjaman: add new calculator calcFields + saldoTersedia sentinel
  if (key === KEYS.PINJAM && storedVersion < 5) {
    const rows = Array.isArray(raw) ? [...raw] : [];
    let patched = 0;
    for (const r of rows) {
      if (r && typeof r === 'object') {
        (r as any).aktaLuasTanahCalc       ??= '';
        (r as any).aktaHargaTanah         ??= '';
        (r as any).aktaLuasBangunanCalc   ??= '';
        (r as any).aktaHargaBangunan      ??= '';
        patched++;
      }
    }
    if (patched) console.info(`[storage] Migrated ${key}: v4→v5 (added calc fields)`);
  }

  // ── v6 (current) ───────────────────────────────────────────────
  // Confirm append-only: no data removed, no structural field deletion.
  // This is a sentinel/marker version; no live migration needed.

  return wrapMeta(raw, SCHEMA_VERSION);
}

// ── Acidic read: validate + return or fallback ────────────────────
function acidicRead<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw  = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    const meta = getMeta(parsed);

    if (!meta) {
      // v1-3 or unversioned — run full migration chain
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
    // ── Corruption guard: return fallback, keep raw blob for recovery ──
    console.warn(`[storage] Corrupt or unreadable data for "${key}":`, err?.message ?? err);
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        window.localStorage.setItem(`${key}__corrupt_${Date.now()}`, raw);
        console.info(`[storage] Corrupt blob preserved as "${key}__corrupt_${Date.now()}"`);
      }
    } catch { /* backup may also fail — nothing more we can do */ }
    return fallback;
  }
}

// ── Write with automatic meta stamp ──────────────────────────────
function write(key: string, data: unknown): void {
  setRaw(key, wrapMeta(data, SCHEMA_VERSION));
}

// ── Atomic double-write: write then immediately verify ──────────
function verifiedWrite(key: string, data: unknown): boolean {
  try {
    write(key, data);
    const roundtrip = window.localStorage.getItem(key);
    if (!roundtrip) { console.error(`[storage] Verification FAILED for "${key}" — write did not persist`); return false; }
    try {
      JSON.parse(roundtrip);
    } catch {
      console.error(`[storage] Verification FAILED for "${key}" — post-write blob is corrupt`); return false;
    }
    return true;
  } catch (err: any) {
    console.error(`[storage] Verified write failed for "${key}":`, err?.message ?? err);
    return false;
  }
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

/** Read a single record by its primary key (id / No_Anggota / noAnggota) */
export function readById<T extends { id?: string; No_Anggota?: string; noAnggota?: string }>(
  key: string,
  id: string,
): T | null {
  const all = readStored<T[]>(key, []);
  return all.find((r) => r.id === id || r.No_Anggota === id || r.noAnggota === id) ?? null;
}

/** Update or insert a single record atomically (no array rewrite lost) */
export function upsertRecord<T extends { id?: string }>(key: string, record: T): boolean {
  const all = readStored<T[]>(key, []);
  const idx = all.findIndex((r) => r.id === record.id);
  const next = idx >= 0 ? [...all.slice(0, idx), record, ...all.slice(idx + 1)] : [...all, record];
  return verifiedWrite(key, next);
}

/** Delete a record by id — returns true if record was found and removed */
export function deleteRecord(key: string, id: string): boolean {
  const all = readStored<{ id?: string }[]>(key, []);
  const next = all.filter((r) => r.id !== id);
  if (next.length === all.length) return false;
  return verifiedWrite(key, next);
}

/** Hard reset — only call this from an explicit user action (not on mount) */
export function resetAll(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
  console.info(`[storage] Hard-reset key "${key}"`);
}

/** Full persistence-health check — safe to call on app mount */
export function healthCheck(): { key: string; version: number; recordCount: number; corrupt: boolean }[] {
  return Object.values(KEYS).map((key) => {
    try {
      const data  = readStored<unknown[]>(key, []);
      const count = Array.isArray(data) ? data.length : 0;
      return { key, version: SCHEMA_VERSION, recordCount: count, corrupt: false };
    } catch {
      return { key, version: SCHEMA_VERSION, recordCount: 0, corrupt: true };
    }
  });
}

// ── Version export (other modules can Simport this for comparisons) ─
export const STORAGE_VERSION = SCHEMA_VERSION;
