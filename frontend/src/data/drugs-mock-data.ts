// 50 Common Drugs with realistic mock data
export interface DrugVariant {
  id: string;
  name: string;
  dosage: string;
  formulation: string;
  manufacturer: string;
  approvalDate: string;
  status: "active" | "discontinued" | "pending";
}

export interface ExperimentRequest {
  id: string;
  doctorName: string;
  institution: string;
  requestDate: string;
  status: "pending" | "approved" | "completed" | "rejected";
  patientCount: number;
  purpose: string;
}

export interface DataRecord {
  id: string;
  ageGroup: "pediatric" | "adult" | "geriatric";
  recordCount: number;
  region: string;
  dataType: string;
  lastUpdated: string;
}

export interface SafetyEvent {
  id: string;
  eventType: string;
  severity: "mild" | "moderate" | "severe";
  reportedDate: string;
  status: "investigating" | "resolved" | "monitoring";
  description: string;
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  drugClass: string;
  status: "active" | "phase-3" | "phase-2" | "phase-1" | "discontinued";
  experimentRequests: number;
  totalRecords: number;
  ageBreakdown: {
    pediatric: number;
    adult: number;
    geriatric: number;
  };
  variantCount: number;
  lastUpdated: string;
  region: string;
  description: string;
  variants: DrugVariant[];
  requests: ExperimentRequest[];
  records: DataRecord[];
  safetyEvents: SafetyEvent[];
}

const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"];
const institutions = [
  "Johns Hopkins Medicine", "Mayo Clinic", "Cleveland Clinic", "Mass General",
  "Stanford Health", "UCLA Medical", "Mount Sinai", "Duke University Hospital",
  "Northwestern Memorial", "Cedars-Sinai", "UCSF Medical Center", "NYU Langone"
];

const doctorNames = [
  "Dr. Sarah Chen", "Dr. Michael Rodriguez", "Dr. Emily Watson", "Dr. James Liu",
  "Dr. Amanda Foster", "Dr. Robert Kim", "Dr. Lisa Park", "Dr. David Miller",
  "Dr. Jennifer Adams", "Dr. Christopher Lee", "Dr. Maria Garcia", "Dr. Thomas Brown"
];

const manufacturers = [
  "Pfizer", "Johnson & Johnson", "Merck", "AbbVie", "Bristol-Myers Squibb",
  "Roche", "Novartis", "Sanofi", "AstraZeneca", "GlaxoSmithKline", "Eli Lilly", "Gilead"
];

const safetyEventTypes = [
  "Allergic Reaction", "Drug Interaction", "Adverse Effect", "Overdose Report",
  "Efficacy Concern", "Manufacturing Issue", "Labeling Error", "Off-label Use Issue"
];

const purposes = [
  "Efficacy study in elderly patients",
  "Combination therapy evaluation",
  "Long-term safety monitoring",
  "Pediatric dosage optimization",
  "Drug interaction analysis",
  "Comparative effectiveness research",
  "Real-world evidence collection",
  "Biomarker identification study"
];

function generateVariants(drugName: string, count: number): DrugVariant[] {
  const formulations = ["Tablet", "Capsule", "Injectable", "Syrup", "Patch", "Cream"];
  const dosages = ["5mg", "10mg", "25mg", "50mg", "100mg", "250mg"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `var-${drugName.toLowerCase().replace(/\s/g, '-')}-${i + 1}`,
    name: `${drugName} ${dosages[i % dosages.length]}`,
    dosage: dosages[i % dosages.length],
    formulation: formulations[i % formulations.length],
    manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
    approvalDate: new Date(2018 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: ["active", "active", "active", "discontinued", "pending"][Math.floor(Math.random() * 5)] as DrugVariant["status"]
  }));
}

function generateRequests(count: number): ExperimentRequest[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `req-${Date.now()}-${i}`,
    doctorName: doctorNames[Math.floor(Math.random() * doctorNames.length)],
    institution: institutions[Math.floor(Math.random() * institutions.length)],
    requestDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: ["pending", "approved", "completed", "rejected"][Math.floor(Math.random() * 4)] as ExperimentRequest["status"],
    patientCount: Math.floor(Math.random() * 500) + 50,
    purpose: purposes[Math.floor(Math.random() * purposes.length)]
  }));
}

function generateRecords(totalCount: number, ageBreakdown: Drug["ageBreakdown"]): DataRecord[] {
  const dataTypes = ["Clinical Trial", "Real-World Evidence", "Registry Data", "EHR Extract", "Claims Data"];
  const records: DataRecord[] = [];
  
  Object.entries(ageBreakdown).forEach(([ageGroup, count]) => {
    const numRecords = Math.ceil(count / 1000);
    for (let i = 0; i < numRecords; i++) {
      records.push({
        id: `rec-${ageGroup}-${i}`,
        ageGroup: ageGroup as DataRecord["ageGroup"],
        recordCount: Math.floor(count / numRecords),
        region: regions[Math.floor(Math.random() * regions.length)],
        dataType: dataTypes[Math.floor(Math.random() * dataTypes.length)],
        lastUpdated: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
      });
    }
  });
  
  return records;
}

function generateSafetyEvents(count: number): SafetyEvent[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `safety-${Date.now()}-${i}`,
    eventType: safetyEventTypes[Math.floor(Math.random() * safetyEventTypes.length)],
    severity: ["mild", "moderate", "severe"][Math.floor(Math.random() * 3)] as SafetyEvent["severity"],
    reportedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: ["investigating", "resolved", "monitoring"][Math.floor(Math.random() * 3)] as SafetyEvent["status"],
    description: `Safety event reported from clinical observation. Under review by pharmacovigilance team.`
  }));
}

const drugData: Omit<Drug, "variants" | "requests" | "records" | "safetyEvents">[] = [
  { id: "1", name: "Lisinopril", genericName: "Lisinopril", drugClass: "ACE Inhibitor", status: "active", experimentRequests: 156, totalRecords: 45230, ageBreakdown: { pediatric: 2100, adult: 28400, geriatric: 14730 }, variantCount: 8, lastUpdated: "2024-01-15", region: "North America", description: "First-line treatment for hypertension and heart failure" },
  { id: "2", name: "Atorvastatin", genericName: "Atorvastatin", drugClass: "Statin", status: "active", experimentRequests: 234, totalRecords: 67890, ageBreakdown: { pediatric: 890, adult: 42000, geriatric: 25000 }, variantCount: 12, lastUpdated: "2024-01-18", region: "Europe", description: "Cholesterol-lowering medication for cardiovascular risk reduction" },
  { id: "3", name: "Metformin", genericName: "Metformin HCl", drugClass: "Biguanide", status: "active", experimentRequests: 312, totalRecords: 89450, ageBreakdown: { pediatric: 4500, adult: 62000, geriatric: 22950 }, variantCount: 15, lastUpdated: "2024-01-20", region: "North America", description: "First-line therapy for type 2 diabetes mellitus" },
  { id: "4", name: "Amlodipine", genericName: "Amlodipine Besylate", drugClass: "Calcium Channel Blocker", status: "active", experimentRequests: 145, totalRecords: 38900, ageBreakdown: { pediatric: 1200, adult: 24700, geriatric: 13000 }, variantCount: 6, lastUpdated: "2024-01-12", region: "Asia Pacific", description: "Long-acting calcium channel blocker for hypertension" },
  { id: "5", name: "Omeprazole", genericName: "Omeprazole", drugClass: "Proton Pump Inhibitor", status: "active", experimentRequests: 198, totalRecords: 52340, ageBreakdown: { pediatric: 8900, adult: 31440, geriatric: 12000 }, variantCount: 9, lastUpdated: "2024-01-22", region: "Europe", description: "Acid suppression for GERD and peptic ulcer disease" },
  { id: "6", name: "Losartan", genericName: "Losartan Potassium", drugClass: "ARB", status: "active", experimentRequests: 167, totalRecords: 41200, ageBreakdown: { pediatric: 1800, adult: 26400, geriatric: 13000 }, variantCount: 7, lastUpdated: "2024-01-10", region: "North America", description: "Angiotensin receptor blocker for hypertension" },
  { id: "7", name: "Albuterol", genericName: "Salbutamol", drugClass: "Beta-2 Agonist", status: "active", experimentRequests: 245, totalRecords: 71230, ageBreakdown: { pediatric: 28000, adult: 32230, geriatric: 11000 }, variantCount: 11, lastUpdated: "2024-01-25", region: "North America", description: "Bronchodilator for asthma and COPD" },
  { id: "8", name: "Gabapentin", genericName: "Gabapentin", drugClass: "Anticonvulsant", status: "active", experimentRequests: 189, totalRecords: 48760, ageBreakdown: { pediatric: 3200, adult: 31560, geriatric: 14000 }, variantCount: 10, lastUpdated: "2024-01-08", region: "Europe", description: "Anticonvulsant used for neuropathic pain and seizures" },
  { id: "9", name: "Hydrochlorothiazide", genericName: "HCTZ", drugClass: "Thiazide Diuretic", status: "active", experimentRequests: 112, totalRecords: 29870, ageBreakdown: { pediatric: 870, adult: 18000, geriatric: 11000 }, variantCount: 5, lastUpdated: "2024-01-05", region: "North America", description: "Thiazide diuretic for hypertension and edema" },
  { id: "10", name: "Sertraline", genericName: "Sertraline HCl", drugClass: "SSRI", status: "active", experimentRequests: 278, totalRecords: 63450, ageBreakdown: { pediatric: 12000, adult: 42450, geriatric: 9000 }, variantCount: 8, lastUpdated: "2024-01-28", region: "North America", description: "SSRI antidepressant for depression and anxiety disorders" },
  { id: "11", name: "Levothyroxine", genericName: "Levothyroxine Sodium", drugClass: "Thyroid Hormone", status: "active", experimentRequests: 134, totalRecords: 54320, ageBreakdown: { pediatric: 4320, adult: 35000, geriatric: 15000 }, variantCount: 14, lastUpdated: "2024-01-30", region: "Europe", description: "Synthetic thyroid hormone for hypothyroidism" },
  { id: "12", name: "Metoprolol", genericName: "Metoprolol Tartrate", drugClass: "Beta Blocker", status: "active", experimentRequests: 201, totalRecords: 47890, ageBreakdown: { pediatric: 1890, adult: 29000, geriatric: 17000 }, variantCount: 9, lastUpdated: "2024-01-14", region: "North America", description: "Beta blocker for hypertension and heart failure" },
  { id: "13", name: "Prednisone", genericName: "Prednisone", drugClass: "Corticosteroid", status: "active", experimentRequests: 223, totalRecords: 58340, ageBreakdown: { pediatric: 11340, adult: 34000, geriatric: 13000 }, variantCount: 7, lastUpdated: "2024-01-19", region: "North America", description: "Corticosteroid for inflammatory and autoimmune conditions" },
  { id: "14", name: "Fluticasone", genericName: "Fluticasone Propionate", drugClass: "Inhaled Corticosteroid", status: "active", experimentRequests: 176, totalRecords: 43210, ageBreakdown: { pediatric: 15210, adult: 21000, geriatric: 7000 }, variantCount: 8, lastUpdated: "2024-01-23", region: "Europe", description: "Inhaled corticosteroid for asthma management" },
  { id: "15", name: "Tramadol", genericName: "Tramadol HCl", drugClass: "Opioid Analgesic", status: "active", experimentRequests: 145, totalRecords: 36780, ageBreakdown: { pediatric: 780, adult: 28000, geriatric: 8000 }, variantCount: 6, lastUpdated: "2024-01-11", region: "North America", description: "Opioid analgesic for moderate to severe pain" },
  { id: "16", name: "Clopidogrel", genericName: "Clopidogrel Bisulfate", drugClass: "Antiplatelet", status: "active", experimentRequests: 289, totalRecords: 71230, ageBreakdown: { pediatric: 230, adult: 45000, geriatric: 26000 }, variantCount: 5, lastUpdated: "2024-01-26", region: "Europe", description: "Antiplatelet agent for cardiovascular event prevention" },
  { id: "17", name: "Montelukast", genericName: "Montelukast Sodium", drugClass: "Leukotriene Inhibitor", status: "active", experimentRequests: 198, totalRecords: 52340, ageBreakdown: { pediatric: 24340, adult: 21000, geriatric: 7000 }, variantCount: 6, lastUpdated: "2024-01-17", region: "North America", description: "Leukotriene receptor antagonist for asthma" },
  { id: "18", name: "Duloxetine", genericName: "Duloxetine HCl", drugClass: "SNRI", status: "active", experimentRequests: 234, totalRecords: 48920, ageBreakdown: { pediatric: 2920, adult: 36000, geriatric: 10000 }, variantCount: 7, lastUpdated: "2024-01-29", region: "North America", description: "SNRI for depression, anxiety, and neuropathic pain" },
  { id: "19", name: "Pantoprazole", genericName: "Pantoprazole Sodium", drugClass: "Proton Pump Inhibitor", status: "active", experimentRequests: 156, totalRecords: 41230, ageBreakdown: { pediatric: 3230, adult: 28000, geriatric: 10000 }, variantCount: 5, lastUpdated: "2024-01-09", region: "Asia Pacific", description: "PPI for acid-related gastrointestinal disorders" },
  { id: "20", name: "Furosemide", genericName: "Furosemide", drugClass: "Loop Diuretic", status: "active", experimentRequests: 178, totalRecords: 45670, ageBreakdown: { pediatric: 2670, adult: 26000, geriatric: 17000 }, variantCount: 8, lastUpdated: "2024-01-21", region: "Europe", description: "Loop diuretic for edema and heart failure" },
  { id: "21", name: "Rosuvastatin", genericName: "Rosuvastatin Calcium", drugClass: "Statin", status: "active", experimentRequests: 267, totalRecords: 58430, ageBreakdown: { pediatric: 430, adult: 38000, geriatric: 20000 }, variantCount: 9, lastUpdated: "2024-01-24", region: "North America", description: "High-potency statin for hypercholesterolemia" },
  { id: "22", name: "Escitalopram", genericName: "Escitalopram Oxalate", drugClass: "SSRI", status: "active", experimentRequests: 245, totalRecords: 51230, ageBreakdown: { pediatric: 8230, adult: 35000, geriatric: 8000 }, variantCount: 6, lastUpdated: "2024-01-27", region: "Europe", description: "SSRI antidepressant for major depressive disorder" },
  { id: "23", name: "Warfarin", genericName: "Warfarin Sodium", drugClass: "Anticoagulant", status: "active", experimentRequests: 312, totalRecords: 78450, ageBreakdown: { pediatric: 450, adult: 48000, geriatric: 30000 }, variantCount: 11, lastUpdated: "2024-01-16", region: "North America", description: "Vitamin K antagonist for thromboembolism prevention" },
  { id: "24", name: "Carvedilol", genericName: "Carvedilol", drugClass: "Beta Blocker", status: "active", experimentRequests: 189, totalRecords: 42340, ageBreakdown: { pediatric: 1340, adult: 26000, geriatric: 15000 }, variantCount: 7, lastUpdated: "2024-01-13", region: "North America", description: "Non-selective beta blocker for heart failure" },
  { id: "25", name: "Trazodone", genericName: "Trazodone HCl", drugClass: "SARI", status: "active", experimentRequests: 167, totalRecords: 38760, ageBreakdown: { pediatric: 1760, adult: 27000, geriatric: 10000 }, variantCount: 5, lastUpdated: "2024-01-07", region: "North America", description: "Antidepressant commonly used for insomnia" },
  { id: "26", name: "Sitagliptin", genericName: "Sitagliptin Phosphate", drugClass: "DPP-4 Inhibitor", status: "active", experimentRequests: 234, totalRecords: 47890, ageBreakdown: { pediatric: 890, adult: 32000, geriatric: 15000 }, variantCount: 6, lastUpdated: "2024-01-31", region: "North America", description: "DPP-4 inhibitor for type 2 diabetes" },
  { id: "27", name: "Empagliflozin", genericName: "Empagliflozin", drugClass: "SGLT2 Inhibitor", status: "active", experimentRequests: 289, totalRecords: 52340, ageBreakdown: { pediatric: 340, adult: 35000, geriatric: 17000 }, variantCount: 4, lastUpdated: "2024-02-01", region: "Europe", description: "SGLT2 inhibitor for diabetes and heart failure" },
  { id: "28", name: "Apixaban", genericName: "Apixaban", drugClass: "Factor Xa Inhibitor", status: "active", experimentRequests: 345, totalRecords: 68920, ageBreakdown: { pediatric: 120, adult: 42800, geriatric: 26000 }, variantCount: 4, lastUpdated: "2024-02-02", region: "North America", description: "Direct oral anticoagulant for stroke prevention" },
  { id: "29", name: "Rivaroxaban", genericName: "Rivaroxaban", drugClass: "Factor Xa Inhibitor", status: "active", experimentRequests: 312, totalRecords: 61230, ageBreakdown: { pediatric: 230, adult: 39000, geriatric: 22000 }, variantCount: 5, lastUpdated: "2024-02-03", region: "Europe", description: "Factor Xa inhibitor for VTE and stroke prevention" },
  { id: "30", name: "Insulin Glargine", genericName: "Insulin Glargine", drugClass: "Long-acting Insulin", status: "active", experimentRequests: 278, totalRecords: 72340, ageBreakdown: { pediatric: 8340, adult: 44000, geriatric: 20000 }, variantCount: 8, lastUpdated: "2024-02-04", region: "North America", description: "Long-acting basal insulin for diabetes" },
  { id: "31", name: "Liraglutide", genericName: "Liraglutide", drugClass: "GLP-1 Agonist", status: "active", experimentRequests: 256, totalRecords: 48760, ageBreakdown: { pediatric: 760, adult: 35000, geriatric: 13000 }, variantCount: 3, lastUpdated: "2024-02-05", region: "Europe", description: "GLP-1 receptor agonist for diabetes and obesity" },
  { id: "32", name: "Semaglutide", genericName: "Semaglutide", drugClass: "GLP-1 Agonist", status: "active", experimentRequests: 423, totalRecords: 56780, ageBreakdown: { pediatric: 280, adult: 42500, geriatric: 14000 }, variantCount: 5, lastUpdated: "2024-02-06", region: "North America", description: "Once-weekly GLP-1 agonist for diabetes and weight loss" },
  { id: "33", name: "Tirzepatide", genericName: "Tirzepatide", drugClass: "GIP/GLP-1 Agonist", status: "phase-3", experimentRequests: 534, totalRecords: 34560, ageBreakdown: { pediatric: 60, adult: 28500, geriatric: 6000 }, variantCount: 4, lastUpdated: "2024-02-07", region: "North America", description: "Dual GIP/GLP-1 receptor agonist for diabetes" },
  { id: "34", name: "Adalimumab", genericName: "Adalimumab", drugClass: "TNF Inhibitor", status: "active", experimentRequests: 367, totalRecords: 62340, ageBreakdown: { pediatric: 5340, adult: 45000, geriatric: 12000 }, variantCount: 6, lastUpdated: "2024-02-08", region: "Europe", description: "Anti-TNF biologic for autoimmune diseases" },
  { id: "35", name: "Pembrolizumab", genericName: "Pembrolizumab", drugClass: "PD-1 Inhibitor", status: "active", experimentRequests: 456, totalRecords: 45230, ageBreakdown: { pediatric: 1230, adult: 32000, geriatric: 12000 }, variantCount: 2, lastUpdated: "2024-02-09", region: "North America", description: "Immune checkpoint inhibitor for various cancers" },
  { id: "36", name: "Nivolumab", genericName: "Nivolumab", drugClass: "PD-1 Inhibitor", status: "active", experimentRequests: 389, totalRecords: 41230, ageBreakdown: { pediatric: 730, adult: 29500, geriatric: 11000 }, variantCount: 2, lastUpdated: "2024-02-10", region: "Europe", description: "PD-1 blocking antibody for cancer immunotherapy" },
  { id: "37", name: "Trastuzumab", genericName: "Trastuzumab", drugClass: "HER2 Inhibitor", status: "active", experimentRequests: 312, totalRecords: 52340, ageBreakdown: { pediatric: 340, adult: 42000, geriatric: 10000 }, variantCount: 4, lastUpdated: "2024-02-11", region: "North America", description: "HER2-targeted therapy for breast cancer" },
  { id: "38", name: "Rituximab", genericName: "Rituximab", drugClass: "CD20 Antibody", status: "active", experimentRequests: 278, totalRecords: 48760, ageBreakdown: { pediatric: 2760, adult: 35000, geriatric: 11000 }, variantCount: 3, lastUpdated: "2024-02-12", region: "Europe", description: "Anti-CD20 antibody for lymphoma and autoimmune diseases" },
  { id: "39", name: "Bevacizumab", genericName: "Bevacizumab", drugClass: "VEGF Inhibitor", status: "active", experimentRequests: 234, totalRecords: 38920, ageBreakdown: { pediatric: 920, adult: 28000, geriatric: 10000 }, variantCount: 2, lastUpdated: "2024-02-13", region: "North America", description: "Anti-VEGF therapy for various solid tumors" },
  { id: "40", name: "Lenalidomide", genericName: "Lenalidomide", drugClass: "Immunomodulator", status: "active", experimentRequests: 289, totalRecords: 32450, ageBreakdown: { pediatric: 150, adult: 22300, geriatric: 10000 }, variantCount: 5, lastUpdated: "2024-02-14", region: "North America", description: "Immunomodulatory drug for multiple myeloma" },
  { id: "41", name: "Ibrutinib", genericName: "Ibrutinib", drugClass: "BTK Inhibitor", status: "active", experimentRequests: 256, totalRecords: 28760, ageBreakdown: { pediatric: 260, adult: 18500, geriatric: 10000 }, variantCount: 3, lastUpdated: "2024-02-15", region: "Europe", description: "BTK inhibitor for B-cell malignancies" },
  { id: "42", name: "Osimertinib", genericName: "Osimertinib Mesylate", drugClass: "EGFR Inhibitor", status: "active", experimentRequests: 312, totalRecords: 24560, ageBreakdown: { pediatric: 60, adult: 17500, geriatric: 7000 }, variantCount: 2, lastUpdated: "2024-02-16", region: "Asia Pacific", description: "Third-generation EGFR TKI for NSCLC" },
  { id: "43", name: "Palbociclib", genericName: "Palbociclib", drugClass: "CDK4/6 Inhibitor", status: "active", experimentRequests: 234, totalRecords: 31230, ageBreakdown: { pediatric: 30, adult: 23200, geriatric: 8000 }, variantCount: 3, lastUpdated: "2024-02-17", region: "North America", description: "CDK4/6 inhibitor for hormone receptor-positive breast cancer" },
  { id: "44", name: "Venetoclax", genericName: "Venetoclax", drugClass: "BCL-2 Inhibitor", status: "active", experimentRequests: 198, totalRecords: 21340, ageBreakdown: { pediatric: 140, adult: 14200, geriatric: 7000 }, variantCount: 3, lastUpdated: "2024-02-18", region: "Europe", description: "BCL-2 inhibitor for CLL and AML" },
  { id: "45", name: "Durvalumab", genericName: "Durvalumab", drugClass: "PD-L1 Inhibitor", status: "active", experimentRequests: 267, totalRecords: 28450, ageBreakdown: { pediatric: 150, adult: 21300, geriatric: 7000 }, variantCount: 2, lastUpdated: "2024-02-19", region: "North America", description: "PD-L1 blocking antibody for various cancers" },
  { id: "46", name: "Atezolizumab", genericName: "Atezolizumab", drugClass: "PD-L1 Inhibitor", status: "active", experimentRequests: 245, totalRecords: 26780, ageBreakdown: { pediatric: 280, adult: 19500, geriatric: 7000 }, variantCount: 2, lastUpdated: "2024-02-20", region: "Europe", description: "Anti-PD-L1 antibody for cancer immunotherapy" },
  { id: "47", name: "Upadacitinib", genericName: "Upadacitinib", drugClass: "JAK Inhibitor", status: "active", experimentRequests: 289, totalRecords: 32340, ageBreakdown: { pediatric: 1340, adult: 25000, geriatric: 6000 }, variantCount: 4, lastUpdated: "2024-02-21", region: "North America", description: "JAK inhibitor for rheumatoid arthritis and other conditions" },
  { id: "48", name: "Tofacitinib", genericName: "Tofacitinib Citrate", drugClass: "JAK Inhibitor", status: "active", experimentRequests: 234, totalRecords: 38920, ageBreakdown: { pediatric: 1920, adult: 28000, geriatric: 9000 }, variantCount: 4, lastUpdated: "2024-02-22", region: "Europe", description: "First oral JAK inhibitor for rheumatoid arthritis" },
  { id: "49", name: "Secukinumab", genericName: "Secukinumab", drugClass: "IL-17A Inhibitor", status: "active", experimentRequests: 198, totalRecords: 29340, ageBreakdown: { pediatric: 1340, adult: 22000, geriatric: 6000 }, variantCount: 3, lastUpdated: "2024-02-23", region: "North America", description: "IL-17A inhibitor for psoriasis and spondyloarthritis" },
  { id: "50", name: "Dupilumab", genericName: "Dupilumab", drugClass: "IL-4/13 Inhibitor", status: "active", experimentRequests: 312, totalRecords: 41230, ageBreakdown: { pediatric: 12230, adult: 23000, geriatric: 6000 }, variantCount: 3, lastUpdated: "2024-02-24", region: "Europe", description: "IL-4/13 blocking antibody for atopic dermatitis and asthma" }
];

export const drugs: Drug[] = drugData.map(drug => ({
  ...drug,
  variants: generateVariants(drug.name, drug.variantCount),
  requests: generateRequests(drug.experimentRequests > 10 ? 10 : drug.experimentRequests),
  records: generateRecords(drug.totalRecords, drug.ageBreakdown),
  safetyEvents: generateSafetyEvents(Math.floor(Math.random() * 8) + 2)
}));

// Mock API functions with realistic delays
export const mockApi = {
  getDrugs: async (filters?: {
    status?: string;
    ageGroup?: string;
    region?: string;
    search?: string;
  }): Promise<Drug[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filtered = [...drugs];
    
    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter(d => d.status === filters.status);
    }
    if (filters?.region && filters.region !== "all") {
      filtered = filtered.filter(d => d.region === filters.region);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(search) || 
        d.genericName.toLowerCase().includes(search) ||
        d.drugClass.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  },
  
  getDrugById: async (id: string): Promise<Drug | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return drugs.find(d => d.id === id) || null;
  },
  
  getKPIs: async (): Promise<{
    totalDrugs: number;
    activeExperiments: number;
    totalRecords: number;
    pendingRequests: number;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      totalDrugs: drugs.length,
      activeExperiments: drugs.reduce((sum, d) => sum + d.experimentRequests, 0),
      totalRecords: drugs.reduce((sum, d) => sum + d.totalRecords, 0),
      pendingRequests: drugs.reduce((sum, d) => 
        sum + d.requests.filter(r => r.status === "pending").length, 0
      )
    };
  },

  getRequestsOverTime: async (drugId: string): Promise<{ month: string; requests: number }[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => ({
      month,
      requests: Math.floor(Math.random() * 50) + 10
    }));
  }
};
