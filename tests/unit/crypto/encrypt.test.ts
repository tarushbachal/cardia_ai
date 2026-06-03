import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt } from "@/lib/crypto/encrypt";
import { resetEncryptionKeyCache } from "@/lib/crypto/key";

const KEY_A = Buffer.alloc(32, 7).toString("base64");
const KEY_B = Buffer.alloc(32, 9).toString("base64");

beforeAll(() => {
  process.env.ENCRYPTION_KEY = KEY_A;
  resetEncryptionKeyCache();
});

describe("AES-256-GCM encryption", () => {
  it("round-trips arbitrary UTF-8", () => {
    const plain = JSON.stringify({ ldl: 96, note: "café ☕ — 120/80" });
    expect(decrypt(encrypt(plain))).toBe(plain);
  });

  it("produces the v1 packed format (4 colon-separated parts)", () => {
    const parts = encrypt("hi").split(":");
    expect(parts).toHaveLength(4);
    expect(parts[0]).toBe("v1");
  });

  it("uses a fresh IV each time (ciphertext is non-deterministic)", () => {
    expect(encrypt("same")).not.toBe(encrypt("same"));
  });

  it("rejects tampered ciphertext", () => {
    const parts = encrypt("secret").split(":");
    const ct = parts[3]!;
    parts[3] = ct.slice(0, -1) + (ct.at(-1) === "A" ? "B" : "A");
    expect(() => decrypt(parts.join(":"))).toThrow();
  });

  it("rejects a wrong key (GCM auth fails)", () => {
    const packed = encrypt("secret");
    process.env.ENCRYPTION_KEY = KEY_B;
    resetEncryptionKeyCache();
    expect(() => decrypt(packed)).toThrow();
    process.env.ENCRYPTION_KEY = KEY_A;
    resetEncryptionKeyCache();
  });

  it("rejects malformed / unsupported input", () => {
    expect(() => decrypt("not-valid")).toThrow(/malformed|unsupported/i);
    expect(() => decrypt("v2:a:b:c")).toThrow(/malformed|unsupported/i);
  });
});
