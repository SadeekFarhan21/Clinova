// Persistent store for trial analysis data per drug

interface TrialData {
  cohort: {
    initialN: number;
    eligibleN: number;
    treatmentN: number;
    controlN: number;
  };
  propensityScore: {
    overlapCoef: string;
    essRatio: string;
  };
  primaryOutcome: {
    treatmentRate: number;
    controlRate: number;
    riskDiff: string;
    ciLow: string;
    ciHigh: string;
    pValue: string;
  };
  conclusion: {
    riskDiff: string;
    ciLow: string;
    ciHigh: string;
    pValue: string;
    isSignificant: boolean;
    favorsDrug: boolean;
  };
  kaplanMeier: Array<{
    time: number;
    treatment: number;
    control: number;
    treatmentCI: [number, number];
    controlCI: [number, number];
    atRiskTreatment: number;
    atRiskControl: number;
  }>;
  hazardRatio: Array<{
    subgroup: string;
    hr: number;
    ciLow: number;
    ciHigh: number;
    pValue: number;
    n: number;
  }>;
  validation: {
    iterations: number;
    gatesPassed: number[];
  };
}

// In-memory cache for trial data
const trialDataCache: Map<string, TrialData> = new Map();

// Generate deterministic random based on seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Hash function to create numeric seed from string
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const getTrialData = (drugId: string, drugName: string, totalRecords: number): TrialData => {
  // Return cached data if exists
  if (trialDataCache.has(drugId)) {
    return trialDataCache.get(drugId)!;
  }
  
  // Generate new data using drug ID as seed for consistency
  const seed = hashString(drugId + drugName);
  
  const initialN = Math.floor(totalRecords * 1.5);
  const eligibleN = Math.floor(initialN * (0.35 + seededRandom(seed) * 0.1));
  const treatmentN = Math.floor(eligibleN * (0.3 + seededRandom(seed + 1) * 0.15));
  const controlN = eligibleN - treatmentN;
  
  // Primary outcome
  const treatmentRate = 4 + seededRandom(seed + 10) * 4;
  const controlRate = 4 + seededRandom(seed + 11) * 4;
  const riskDiff = (treatmentRate - controlRate).toFixed(2);
  const ciLow = (parseFloat(riskDiff) - 1.5 - seededRandom(seed + 12)).toFixed(2);
  const ciHigh = (parseFloat(riskDiff) + 1.5 + seededRandom(seed + 13)).toFixed(2);
  const pValue = (0.2 + seededRandom(seed + 14) * 0.7).toFixed(3);
  
  // Conclusion
  const conclusionRiskDiff = (-2 + seededRandom(seed + 20) * 4).toFixed(2);
  const conclusionCiLow = (parseFloat(conclusionRiskDiff) - 2 - seededRandom(seed + 21)).toFixed(2);
  const conclusionCiHigh = (parseFloat(conclusionRiskDiff) + 2 + seededRandom(seed + 22)).toFixed(2);
  const conclusionPValue = (0.3 + seededRandom(seed + 23) * 0.6).toFixed(3);
  
  // Kaplan-Meier data
  const kaplanMeier = generateKMData(seed);
  
  // Hazard ratio data
  const hazardRatio = generateHRData(seed);
  
  const data: TrialData = {
    cohort: { initialN, eligibleN, treatmentN, controlN },
    propensityScore: {
      overlapCoef: (0.7 + seededRandom(seed + 30) * 0.15).toFixed(3),
      essRatio: (0.6 + seededRandom(seed + 31) * 0.2).toFixed(2),
    },
    primaryOutcome: { treatmentRate, controlRate, riskDiff, ciLow, ciHigh, pValue },
    conclusion: {
      riskDiff: conclusionRiskDiff,
      ciLow: conclusionCiLow,
      ciHigh: conclusionCiHigh,
      pValue: conclusionPValue,
      isSignificant: parseFloat(conclusionPValue) < 0.05,
      favorsDrug: parseFloat(conclusionRiskDiff) < 0,
    },
    kaplanMeier,
    hazardRatio,
    validation: {
      iterations: Math.floor(seededRandom(seed + 40) * 3) + 2,
      gatesPassed: [1, 2, 3, 4, 5, 6],
    },
  };
  
  // Cache the data
  trialDataCache.set(drugId, data);
  
  return data;
};

function generateKMData(seed: number) {
  const data = [];
  let treatmentSurvival = 1;
  let controlSurvival = 1;
  
  for (let month = 0; month <= 24; month += 2) {
    const treatmentDrop = month === 0 ? 0 : 0.01 + seededRandom(seed + month * 2) * 0.03;
    const controlDrop = month === 0 ? 0 : 0.015 + seededRandom(seed + month * 2 + 100) * 0.035;
    
    treatmentSurvival = Math.max(0.5, treatmentSurvival - treatmentDrop);
    controlSurvival = Math.max(0.45, controlSurvival - controlDrop);
    
    data.push({
      time: month,
      treatment: treatmentSurvival,
      control: controlSurvival,
      treatmentCI: [treatmentSurvival * 0.92, Math.min(1, treatmentSurvival * 1.05)] as [number, number],
      controlCI: [controlSurvival * 0.9, Math.min(1, controlSurvival * 1.06)] as [number, number],
      atRiskTreatment: Math.floor(412 * treatmentSurvival),
      atRiskControl: Math.floor(435 * controlSurvival),
    });
  }
  return data;
}

function generateHRData(seed: number) {
  const subgroups = [
    { name: "Overall", n: 847 },
    { name: "Age < 65", n: 423 },
    { name: "Age ≥ 65", n: 424 },
    { name: "Male", n: 512 },
    { name: "Female", n: 335 },
    { name: "No Comorbidities", n: 298 },
    { name: "With Comorbidities", n: 549 },
    { name: "Prior Treatment", n: 187 },
    { name: "Treatment Naive", n: 660 },
  ];
  
  return subgroups.map((sg, idx) => {
    const hr = 0.5 + seededRandom(seed + idx * 17) * 0.8;
    const ciWidth = 0.15 + seededRandom(seed + idx * 23) * 0.25;
    return {
      subgroup: sg.name,
      hr,
      ciLow: Math.max(0.2, hr - ciWidth),
      ciHigh: Math.min(1.8, hr + ciWidth),
      pValue: seededRandom(seed + idx * 31) < 0.3 ? seededRandom(seed + idx * 37) * 0.04 : 0.05 + seededRandom(seed + idx * 41) * 0.5,
      n: sg.n,
    };
  });
}

export const clearTrialDataCache = () => {
  trialDataCache.clear();
};
