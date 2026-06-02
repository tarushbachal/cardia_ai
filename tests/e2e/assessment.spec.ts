import { test, expect } from "@playwright/test";

test.describe("Cardia AI — critical flow", () => {
  test("complete an assessment and see a calm, sourced result", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/without the fear/i);

    await page.getByRole("link", { name: /start your assessment/i }).click();
    await expect(page).toHaveURL(/\/assessment/);

    // Step 1 — context. Sex drives the sex-specific HDL threshold.
    await page.getByRole("radio", { name: "Male", exact: true }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();

    // Step 2 — lipids
    await expect(page.getByRole("heading", { name: /cholesterol & lipids/i })).toBeVisible();
    await page.locator("#bm-ldl").fill("96");
    await page.locator("#bm-hdl").fill("38");
    await page.getByRole("button", { name: /^continue$/i }).click();

    // Step 3 — blood sugar
    await page.locator("#bm-hba1c").fill("5.4");
    await page.getByRole("button", { name: /^continue$/i }).click();

    // Step 4 — blood pressure
    await page.locator("#bm-systolicBP").fill("124");
    await page.locator("#bm-diastolicBP").fill("78");
    await page.getByRole("button", { name: /^continue$/i }).click();

    // Step 5 — inflammation
    await page.locator("#bm-hsCRP").fill("0.8");
    await page.getByRole("button", { name: /^continue$/i }).click();

    // Step 6 — body, then submit
    await page.locator("#bm-bmi").fill("26.5");
    await page.getByRole("button", { name: /see my results/i }).click();

    // Results: calm summary first
    await expect(page).toHaveURL(/\/results/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/within guideline-recommended ranges/i)).toBeVisible();
    // Reserved (inactive) AI slot is present
    const aiSlot = page.getByRole("region", { name: /plain-language explanation/i });
    await expect(aiSlot).toBeVisible();
    await expect(aiSlot).toContainText(/coming soon/i);

    // Opt-in detail second
    await page.getByRole("button", { name: /see your biomarker breakdown/i }).click();
    await expect(page.getByText("LDL cholesterol")).toBeVisible();

    // Each biomarker links to its source guideline (the trust differentiator)
    await page.getByRole("button", { name: /HDL cholesterol/i }).click();
    await expect(page.getByRole("link", { name: /NCEP ATP III/i })).toBeVisible();

    // Context & action third
    await expect(page.getByRole("heading", { name: /bring this to your doctor/i })).toBeVisible();
  });

  test("reduced-motion users still see the full result (reveal never gates content)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const data = { sex: "male", values: { ldl: 96, hdl: 38, hba1c: 5.4 } };
      sessionStorage.setItem(
        "cardia.assessment.v1",
        JSON.stringify({ data, savedAt: new Date().toISOString() }),
      );
    });
    await page.goto("/results");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/within guideline-recommended ranges/i)).toBeVisible();
    await context.close();
  });

  test("results with no assessment shows the calm empty state", async ({ page }) => {
    await page.goto("/results");
    await expect(page.getByRole("heading", { name: /no results yet/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /start your assessment/i })).toBeVisible();
  });

  test("submitting with no values asks for at least one", async ({ page }) => {
    await page.goto("/assessment");
    // Skip straight through every step without entering anything (6 steps total).
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: /^continue$/i }).click();
    }
    await page.getByRole("button", { name: /see my results/i }).click();
    await expect(page).toHaveURL(/\/assessment/);
    await expect(
      page.getByText("Enter at least one value to see your results.", { exact: true }),
    ).toBeVisible();
  });
});
