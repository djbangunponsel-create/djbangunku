/**
 * ─────────────────────────────────────────────────────────────────────
 *  KSP Server Database Storage Layer
 * ─────────────────────────────────────────────────────────────────────
 *  This module provides server-side database operations for KSP data.
 *  All data is persisted in SQLite/Turso database and survives rebuilds.
 * ─────────────────────────────────────────────────────────────────────
 */

const API_BASE = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Anggota ───────────────────────────────────────────────────────────
export async function getAnggota() {
  return fetchAPI<any[]>('/anggota');
}

export async function upsertAnggota(data: any) {
  return fetchAPI<{ success: boolean; noAnggota: string }>('/anggota', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Simpanan ─────────────────────────────────────────────────────────
export async function getSimpanan() {
  return fetchAPI<any[]>('/simpanan');
}

export async function upsertSimpanan(data: any) {
  return fetchAPI<{ success: boolean; id: string }>('/simpanan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Pinjaman ─────────────────────────────────────────────────────────
export async function getPinjaman() {
  return fetchAPI<any[]>('/pinjaman');
}

export async function upsertPinjaman(data: any) {
  return fetchAPI<{ success: boolean; id: string }>('/pinjaman', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Pengaturan ───────────────────────────────────────────────────────
export async function getPengaturan() {
  return fetchAPI<any>('/pengaturan');
}

export async function upsertPengaturan(data: any) {
  return fetchAPI<{ success: boolean }>('/pengaturan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}