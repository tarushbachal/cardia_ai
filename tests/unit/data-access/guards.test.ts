import { describe, it, expect, vi } from "vitest";

// next/headers is Server-Component-only; stub it so the module graph imports in node.
vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [], set: () => {} }),
}));

import {
  hasPublicSupabaseConfig,
  requirePublicSupabaseConfig,
  requireServiceRoleKey,
} from "@/lib/config/env";
import { FLAGS } from "@/lib/config/flags";
import { assertPersistenceEnabled, getReadingsRepository } from "@/lib/data-access/readings";

describe("data-access guards (Phase 1: persistence OFF)", () => {
  it("persistence flag defaults off", () => {
    expect(FLAGS.persistenceEnabled).toBe(false);
  });

  it("assertPersistenceEnabled throws while disabled", () => {
    expect(() => assertPersistenceEnabled()).toThrow(/disabled in Phase 1/i);
  });

  it("getReadingsRepository rejects while disabled (never touches Supabase)", async () => {
    await expect(getReadingsRepository()).rejects.toThrow(/disabled/i);
  });

  it("supabase config is absent by default and required-getters throw", () => {
    expect(hasPublicSupabaseConfig()).toBe(false);
    expect(() => requirePublicSupabaseConfig()).toThrow(/not configured/i);
    expect(() => requireServiceRoleKey()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });
});
