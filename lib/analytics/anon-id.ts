const ANON_ID_KEY = "cardia.anonId.v1";

/**
 * A stable, pseudonymous browser id (not personal identity). Persisted in
 * localStorage so repeat submissions from the same browser can be grouped for
 * analysis. Falls back to an ephemeral id when storage is unavailable.
 */
export function getOrCreateAnonId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    let id = window.localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
