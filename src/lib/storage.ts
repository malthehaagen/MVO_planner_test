import { SCHEMA_VERSION, type StoredDraft } from '../types';
import { migrateDraft } from './migrate';

export const STORAGE_KEY = 'hagen-growth.mvo-planner.draft.v1';

export type SaveResult = 'saved' | 'failed';

function getStore(): Storage | null {
  try {
    const store = globalThis.localStorage;
    if (!store) return null;
    // Some browsers expose localStorage but throw on use (private mode, blocked cookies).
    const probe = '__mvo_probe__';
    store.setItem(probe, '1');
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

export function isStorageAvailable(): boolean {
  return getStore() !== null;
}

export function loadDraft(): StoredDraft | null {
  const store = getStore();
  if (!store) return null;
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return migrateDraft(parsed);
  } catch {
    // Corrupted or unreadable saved data: treat as no draft rather than crashing.
    return null;
  }
}

export function saveDraft(draft: StoredDraft): SaveResult {
  const store = getStore();
  if (!store) return 'failed';
  try {
    store.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...draft, version: SCHEMA_VERSION }),
    );
    return 'saved';
  } catch {
    // Quota exceeded, or storage disabled mid-session.
    return 'failed';
  }
}

export function clearDraft(): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(STORAGE_KEY);
  } catch {
    // Nothing more we can do; the caller continues with in-memory state.
  }
}
