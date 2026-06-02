import { FLAGS } from "@/lib/config/flags";
import { createSupabaseServerClient } from "./supabase/server";
import type { ReadingRow, StoredReadingPayload } from "./types";

/**
 * Centralized readings data-access (§6.3). All Supabase access for assessments
 * goes through this repository so Phase 2 turns persistence on without scattering
 * queries through components. RLS guarantees a user only ever touches their own
 * rows; the `user_id` is taken from the authenticated session, never the client.
 *
 * Phase 1: `FLAGS.persistenceEnabled` is false, so `getReadingsRepository()`
 * throws if called. The implementation below is complete and ready for Phase 2.
 */

export interface SaveReadingInput {
  payload: StoredReadingPayload;
  guidelineVersion: string;
}

export interface ReadingsRepository {
  save(input: SaveReadingInput): Promise<ReadingRow>;
  list(): Promise<ReadingRow[]>;
  get(id: string): Promise<ReadingRow | null>;
}

export function assertPersistenceEnabled(): void {
  if (!FLAGS.persistenceEnabled) {
    throw new Error(
      "Server persistence is disabled in Phase 1. Set NEXT_PUBLIC_PERSISTENCE_ENABLED=true to enable (Phase 2).",
    );
  }
}

export async function getReadingsRepository(): Promise<ReadingsRepository> {
  assertPersistenceEnabled();
  const supabase = await createSupabaseServerClient();

  return {
    async save({ payload, guidelineVersion }) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated.");

      const { data, error } = await supabase
        .from("readings")
        .insert({
          user_id: user.id,
          payload,
          guideline_version: guidelineVersion,
        })
        .select()
        .single();
      if (error) throw error;
      return data as ReadingRow;
    },

    async list() {
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReadingRow[];
    },

    async get(id) {
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as ReadingRow) ?? null;
    },
  };
}
