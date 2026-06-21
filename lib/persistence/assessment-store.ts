import type { ParsedAssessment } from "@/lib/schemas";

/**
 * Phase 1 persistence: client-only, no server. By default an assessment lives in
 * `sessionStorage` (gone when the tab closes). If the user opts into "keep on
 * this device," it is mirrored to `localStorage`. Nothing ever leaves the
 * browser (§6.1, §6.3). All access is guarded + try/catch so SSR and private-mode
 * storage failures degrade quietly.
 */

const DATA_KEY = "cardia.assessment.v1";
const PREF_KEY = "cardia.persistLocal.v1";

export interface StoredAssessment {
  data: ParsedAssessment;
  savedAt: string;
}

const canUseDom = () => typeof window !== "undefined";

export function isLocalPersistEnabled(): boolean {
  if (!canUseDom()) return false;
  try {
    return window.localStorage.getItem(PREF_KEY) === "true";
  } catch {
    return false;
  }
}

export function setLocalPersistEnabled(enabled: boolean): void {
  if (!canUseDom()) return;
  try {
    if (enabled) {
      window.localStorage.setItem(PREF_KEY, "true");
      const session = window.sessionStorage.getItem(DATA_KEY);
      if (session) window.localStorage.setItem(DATA_KEY, session);
    } else {
      window.localStorage.removeItem(PREF_KEY);
      window.localStorage.removeItem(DATA_KEY);
    }
  } catch {
    /* storage unavailable, ignore */
  }
}

export function saveAssessment(data: ParsedAssessment): void {
  if (!canUseDom()) return;
  const payload = JSON.stringify({
    data,
    savedAt: new Date().toISOString(),
  } satisfies StoredAssessment);
  try {
    window.sessionStorage.setItem(DATA_KEY, payload);
    if (isLocalPersistEnabled()) window.localStorage.setItem(DATA_KEY, payload);
  } catch {
    /* storage unavailable, ignore */
  }
}

export function loadAssessment(): StoredAssessment | null {
  if (!canUseDom()) return null;
  try {
    const raw = window.localStorage.getItem(DATA_KEY) ?? window.sessionStorage.getItem(DATA_KEY);
    return raw ? (JSON.parse(raw) as StoredAssessment) : null;
  } catch {
    return null;
  }
}

export function clearAssessment(): void {
  if (!canUseDom()) return;
  try {
    window.sessionStorage.removeItem(DATA_KEY);
    window.localStorage.removeItem(DATA_KEY);
  } catch {
    /* ignore */
  }
}
