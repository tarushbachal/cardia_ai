import type { GuidelineSource } from "../types";

/**
 * Shared guideline citations, verified against primary sources during build
 * (see VERIFICATION.md for the per-threshold audit + flags). Citations are data,
 * not comments, so the UI can surface and link them (§4.1).
 */
export const SOURCES = {
  /** Population lipid reference categories (LDL/TC/HDL cut points originate here). */
  atpIII: {
    name: "NCEP ATP III: Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults",
    body: "National Cholesterol Education Program (NHLBI/NIH)",
    year: 2002,
    reference: "Lipid reference categories (ATP III, full report)",
    url: "https://www.nhlbi.nih.gov/files/docs/guidelines/atp3xsum.pdf",
  },
  /** Current US lipid guideline, risk based LDL goals + statin-discussion thresholds. */
  accAhaDyslipidemia2026: {
    name: "2026 ACC/AHA Guideline on the Management of Dyslipidemia",
    body: "American College of Cardiology / American Heart Association",
    year: 2026,
    reference: "LDL goals; ≥190 mg/dL therapy-discussion threshold",
    url: "https://www.acc.org/latest-in-cardiology/journal-scans/2026/03/13/15/20/acc-aha-release-new-clinical-guideline-for-managing-dyslipidemia",
  },
  /** Fasting triglyceride categories. */
  ahaTriglycerides2011: {
    name: "AHA Scientific Statement: Triglycerides and Cardiovascular Disease",
    body: "American Heart Association",
    year: 2011,
    reference: "Fasting triglyceride categories",
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0b013e3182160726",
  },
  /** ApoB ≥130 mg/dL as a risk enhancing factor. */
  accAhaPrevention2019: {
    name: "2019 ACC/AHA Guideline on the Primary Prevention of Cardiovascular Disease",
    body: "American College of Cardiology / American Heart Association",
    year: 2019,
    reference: "Risk enhancing factors (ApoB ≥130 mg/dL)",
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000678",
  },
  /** Lp(a) risk modifying threshold. */
  escEasDyslipidaemia2019: {
    name: "2019 ESC/EAS Guidelines for the Management of Dyslipidaemias",
    body: "European Society of Cardiology / European Atherosclerosis Society",
    year: 2019,
    reference: "Lp(a) ≥50 mg/dL (~125 nmol/L) risk modifier",
    url: "https://academic.oup.com/eurheartj/article/41/1/111/5556353",
  },
  /** hsCRP cardiovascular relative risk categories. */
  ahaCdcInflammation2003: {
    name: "AHA/CDC Scientific Statement: Markers of Inflammation and Cardiovascular Disease",
    body: "American Heart Association / Centers for Disease Control and Prevention",
    year: 2003,
    reference: "hsCRP relative risk categories (<1, 1 to 3, >3 mg/L)",
    url: "https://www.ahajournals.org/doi/10.1161/01.CIR.0000052939.59093.45",
  },
  /** A1C + fasting glucose diagnostic cut points. */
  adaStandards2026: {
    name: "ADA Standards of Care in Diabetes, 2026",
    body: "American Diabetes Association",
    year: 2026,
    reference: "Section 2: Diagnosis & Classification (A1C, fasting plasma glucose)",
    url: "https://diabetesjournals.org/care/article/49/Supplement_1/S27/163926/2-Diagnosis-and-Classification-of-Diabetes",
  },
  /** Blood-pressure categories (unchanged from 2017). */
  accAhaBloodPressure2025: {
    name: "2025 AHA/ACC Guideline for the Management of High Blood Pressure in Adults",
    body: "American Heart Association / American College of Cardiology",
    year: 2025,
    reference: "Blood-pressure categories (normal / elevated / stage 1 / stage 2)",
    url: "https://www.jacc.org/doi/10.1016/j.jacc.2025.07.010",
  },
  /** Adult BMI classification. */
  whoBmi: {
    name: "WHO Body Mass Index Classification for Adults",
    body: "World Health Organization",
    year: 2004,
    reference: "BMI categories (underweight / healthy / overweight / obesity)",
    url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
  },
} as const satisfies Record<string, GuidelineSource>;
