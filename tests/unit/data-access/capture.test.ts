import { describe, it, expect } from "vitest";
import { buildAssessmentRecord } from "@/lib/data-access/capture";
import { decrypt } from "@/lib/crypto/encrypt";
import { resetEncryptionKeyCache } from "@/lib/crypto/key";

// Set before the describe body runs (it builds a record at collection time).
process.env.ENCRYPTION_KEY = Buffer.alloc(32, 3).toString("base64");
resetEncryptionKeyCache();

describe("buildAssessmentRecord", () => {
  const record = buildAssessmentRecord({
    submissionId: "11111111-1111-1111-1111-111111111111",
    anonId: "22222222-2222-2222-2222-222222222222",
    age: 52,
    sex: "female",
    smoker: false,
    familyHistory: true,
    values: { ldl: 171, hdl: 44, hba1c: 5.1 },
  });

  it("stores de-identified plaintext with no raw values", () => {
    expect(record.sex).toBe("female");
    expect(record.age_band).toBe("50-59");
    expect(record.markers_entered).toBe(3);
    expect(record.tiers.ldl).toBe("attention"); // 171 → "High"
    expect(record.tiers.hdl).toBe("attention"); // 44 < 50 (female) → below range
    expect(record.guideline_version).toMatch(/^\d{4}\./);

    const plaintextOnly = JSON.stringify({ ...record, ciphertext: "" });
    expect(plaintextOnly).not.toContain("171");
    expect(plaintextOnly).not.toContain("44");
  });

  it("encrypts exact values, recoverable only via decrypt()", () => {
    expect(record.ciphertext).not.toContain("171");
    const recovered = JSON.parse(decrypt(record.ciphertext));
    expect(recovered.values.ldl).toBe(171);
    expect(recovered.values.hdl).toBe(44);
    expect(recovered.context.sex).toBe("female");
  });
});
