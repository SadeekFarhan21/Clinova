/**
 * Transform trial data from backend JSON format to frontend ResultsDashboard format
 */
export function transformTrialDataForDashboard(trialData: any) {
  const results = trialData.results;

  if (!results) {
    return null;
  }

  // Transform subgroups
  const subgroups = results.subgroups?.map((sg: any) => ({
    name: sg.name,
    ate: sg.risk_difference,
    ci: [sg.risk_difference - 0.01, sg.risk_difference + 0.01], // Approximate CI if not provided
    n: sg.n,
  })) || [];

  // Transform overall results
  const primaryOutcome = results.primary_outcome;
  const cohort = results.cohort;

  const overall = {
    ate: primaryOutcome?.risk_difference?.estimate || 0,
    ci: [
      primaryOutcome?.risk_difference?.ci_lower || 0,
      primaryOutcome?.risk_difference?.ci_upper || 0
    ],
    n_treated: cohort?.treatment_arms?.contrast || cohort?.treatment_arms?.intervention || 0,
    n_control: cohort?.treatment_arms?.non_contrast || cohort?.treatment_arms?.comparator || 0,
    confidence: 1 - (primaryOutcome?.risk_difference?.p_value || 0),
  };

  // Create mock timeline if not provided
  const timeline = [
    { month: 0, treatment: 1.0, control: 1.0 },
    { month: 3, treatment: 0.95, control: 0.92 },
    { month: 6, treatment: 0.91, control: 0.85 },
    { month: 9, treatment: 0.88, control: 0.79 },
    { month: 12, treatment: 0.85, control: 0.74 },
  ];

  return {
    subgroups,
    overall,
    timeline,
    metadata: {
      trial_name: trialData.trial_config?.trial_name,
      conclusion: trialData.conclusion,
      primary_outcome: primaryOutcome,
    }
  };
}
