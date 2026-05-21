'use client';

import { useEffect } from 'react';
import { healthCheck } from '@/lib/storage';

export default function StorageGuard() {
  useEffect(() => {
    const results = healthCheck();
    console.info('[StorageGuard] health check:', results);
    results.forEach((r) => {
      if (r.corrupt) console.error(`[StorageGuard] CORRUPT key "${r.key}"`);
    });
  }, []);
  return null;
}
