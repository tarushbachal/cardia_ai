/**
 * Encryption key management (server-only). The key is a 32-byte (AES-256) secret
 * provided as base64 in `ENCRYPTION_KEY`. Reads are lazy + cached so the rest of
 * the app (and tests) import cleanly when the key is absent.
 */

let cachedKey: Buffer | null = null;

/** True when a valid 32-byte base64 key is configured (never throws). */
export function hasEncryptionKey(): boolean {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) return false;
  try {
    return Buffer.from(raw, "base64").length === 32;
  } catch {
    return false;
  }
}

/** The AES-256 key as a 32-byte Buffer. Throws a clear error if missing/invalid. */
export function getEncryptionKey(): Buffer {
  if (cachedKey) return cachedKey;

  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "ENCRYPTION_KEY is not set (server-only). Generate one with `openssl rand -base64 32`.",
    );
  }

  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(
      `ENCRYPTION_KEY must decode to 32 bytes (got ${key.length}). Generate one with \`openssl rand -base64 32\`.`,
    );
  }

  cachedKey = key;
  return key;
}

/** Test-only: clear the cached key so a new ENCRYPTION_KEY can be picked up. */
export function resetEncryptionKeyCache(): void {
  cachedKey = null;
}
