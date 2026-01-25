# SOTAstack: State-of-the-Art Causal Inference Methods

A comprehensive reference for the trialRunnerAgent, extracted from CausalContrastStudy methodology.

---

## Table of Contents

1. [Query Extraction from OMOP Tables](#1-query-extraction-from-omop-tables)
2. [Propensity Score Model (LSPS - L1 Lasso)](#2-propensity-score-model-lsps---l1-lasso)
3. [SuperLearner AIPW Engine](#3-superlearner-aipw-engine)
4. [Robustness Checks](#4-robustness-checks)
5. [Endpoint Enumeration](#5-endpoint-enumeration)
6. [Subgroup Analysis (ITE-Based)](#6-subgroup-analysis-ite-based)
7. [Important Metrics](#7-important-metrics)
8. [Feature Engineering](#8-feature-engineering)
9. [Propensity Score Trimming](#9-propensity-score-trimming)
10. [Survival Analysis (IPTW-Weighted)](#10-survival-analysis-iptw-weighted)
11. [Negative Control Definitions](#11-negative-control-definitions)
12. [Clinical Procedure Groups](#12-clinical-procedure-groups)
13. [Model Checkpointing](#13-model-checkpointing)

---

## 1. Query Extraction from OMOP Tables

### Core OMOP Tables Used

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `procedure_occurrence` | Index date, treatment assignment | procedure_concept_id, procedure_datetime |
| `measurement` | Lab values (eGFR, creatinine) | measurement_concept_id, value_as_number, measurement_date |
| `condition_occurrence` | Outcomes, comorbidities | condition_concept_id, condition_start_date |
| `drug_exposure` | Medication history | drug_concept_id, drug_exposure_start_date |
| `observation` | Clinical observations | observation_concept_id, observation_date |
| `device_exposure` | Device history | device_concept_id, device_exposure_start_date |
| `person` | Demographics, death | person_id, birth_datetime, death_date, gender_concept_id |

### SQL Query Patterns

#### A. Cohort Identification (Index Date)

```sql
SELECT person_id,
       CAST(procedure_datetime AS DATE) AS index_date,
       procedure_concept_id
FROM `{CDR}.procedure_occurrence`
WHERE procedure_concept_id IN ({TREATMENT_CONCEPT_IDS})
```

#### B. Lab Value Extraction (Baseline)

```sql
SELECT m.person_id,
       m.measurement_date AS date,
       m.value_as_number AS value
FROM `{CDR}.measurement` m
WHERE m.measurement_concept_id IN ({LAB_CONCEPT_IDS})
-- Join to cohort and filter: most recent value before index_date
```

#### C. Outcome Extraction

```sql
SELECT c.person_id,
       c.condition_start_date AS event_date
FROM `{CDR}.condition_occurrence` c
WHERE c.condition_concept_id IN ({OUTCOME_CONCEPT_IDS})
-- Filter: event_date BETWEEN index_date AND index_date + {WINDOW_DAYS}
```

#### D. High-Dimensional Feature Extraction

```sql
-- Conditions before index
SELECT person_id, CAST(condition_concept_id AS STRING) as feature_id, 'COND' as domain
FROM `{CDR}.condition_occurrence`
WHERE condition_start_date < index_date

UNION ALL

-- Procedures before index
SELECT person_id, CAST(procedure_concept_id AS STRING), 'PROC'
FROM `{CDR}.procedure_occurrence`
WHERE procedure_date < index_date

UNION ALL

-- Drugs before index
SELECT person_id, CAST(drug_concept_id AS STRING), 'DRUG'
FROM `{CDR}.drug_exposure`
WHERE drug_exposure_start_date < index_date

UNION ALL

-- Measurements before index
SELECT person_id, CAST(measurement_concept_id AS STRING), 'MEAS'
FROM `{CDR}.measurement`
WHERE measurement_date < index_date

UNION ALL

-- Observations before index
SELECT person_id, CONCAT(CAST(observation_concept_id AS STRING), '_',
       CAST(COALESCE(value_as_concept_id, 0) AS STRING)), 'OBS'
FROM `{CDR}.observation`
WHERE observation_date < index_date

UNION ALL

-- Devices before index
SELECT person_id, CAST(device_concept_id AS STRING), 'DEV'
FROM `{CDR}.device_exposure`
WHERE device_exposure_start_date < index_date
```

---

## 2. Propensity Score Model (LSPS - L1 Lasso)

### What is LSPS (Large-Scale Propensity Score)?

LSPS is an approach where **L1 regularized logistic regression is applied to ALL available features** (70k+ in OMOP data), letting the Lasso penalty naturally select the most predictive covariates. This avoids manual feature selection while maintaining interpretability.

### Why L1 Lasso (SAGA Solver)

| Feature | SAGA Solver | liblinear |
|---------|-------------|-----------|
| Parallelization | **Yes** (`n_jobs=-1`) | No |
| Sparse Data | Native CSR support | Yes |
| Large N | Scales to millions | Slower |
| L1 Penalty | Yes | Yes |
| Incremental Learning | Supported | No |

### Propensity Score Model Configuration

```python
from sklearn.linear_model import LogisticRegression

# LSPS: L1 Lasso on ALL features - regularization does the selection
lsps_model = LogisticRegression(
    penalty='l1',
    solver='saga',           # RECOMMENDED: Fast, parallel, sparse-friendly
    C=0.2,                   # Regularization strength (tuned via CV)
    class_weight='balanced', # Handle class imbalance
    max_iter=1000,
    n_jobs=-1,               # Full parallelization
    tol=1e-4,
    random_state=42
)
```

### Hyperparameter Tuning

```python
from sklearn.model_selection import GridSearchCV, StratifiedKFold

param_grid = {'C': [0.01, 0.1, 0.2, 0.5, 1.0]}
cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

grid_search = GridSearchCV(
    LogisticRegression(penalty='l1', solver='saga', class_weight='balanced', max_iter=1000),
    param_grid,
    cv=cv,
    scoring='roc_auc',
    n_jobs=-1
)
grid_search.fit(X_subsample, T_subsample)
best_C = grid_search.best_params_['C']
print(f"Best C: {best_C}")
```

### Cross-Fitted Propensity Score

```python
from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression
from joblib import Parallel, delayed
import numpy as np

def fit_lasso_fold(fold_id, train_idx, test_idx, X, T, C_val):
    """Train L1 Lasso on one fold."""
    model = LogisticRegression(
        penalty='l1', solver='saga', C=C_val,
        class_weight='balanced', max_iter=1000, n_jobs=1
    )
    model.fit(X[train_idx], T[train_idx])
    ps_fold = model.predict_proba(X[test_idx])[:, 1]
    return fold_id, test_idx, ps_fold

# Cross-fitting
cv_outer = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
results = Parallel(n_jobs=5, verbose=10)(
    delayed(fit_lasso_fold)(i, tr, te, X_all, T, best_C)
    for i, (tr, te) in enumerate(cv_outer.split(X_all, T))
)

# Reassemble
ps = np.zeros(len(T), dtype=float)
for _, test_idx, ps_pred in results:
    ps[test_idx] = ps_pred
```

### Feature Importance (L1 Lasso)

```python
# Train global model for interpretation
lsps_model = LogisticRegression(
    penalty='l1', solver='saga', C=best_C,
    class_weight='balanced', max_iter=1000, n_jobs=-1
)
lsps_model.fit(X_all, T)

# Get coefficients (L1 Lasso uses .coef_)
coefficients = lsps_model.coef_[0]

# Create dataframe
coef_df = pd.DataFrame({
    'Feature': all_feature_names,
    'Coefficient': coefficients,
    'AbsCoef': np.abs(coefficients)
})

# Filter to non-zero coefficients (selected by Lasso)
nonzero_df = coef_df[coef_df['AbsCoef'] > 0].copy()
print(f"Selected {len(nonzero_df)} features out of {len(coef_df)}")

# Top predictors (sorted by absolute coefficient)
print(nonzero_df.sort_values('AbsCoef', ascending=False).head(30))
```

---

## 3. SuperLearner AIPW Engine

### SuperLearner Architecture (Lasso + Random Forest)

The SuperLearner combines **L1 Lasso** (linear, interpretable) with **Random Forest** (non-linear, robust) to capture both linear and complex relationships:

```python
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression

def get_super_learner(n_jobs_inner=1):
    """
    Returns a StackingClassifier combining Lasso and Random Forest.

    Library Strategy:
    1. Lasso: Linear model with automatic feature selection
    2. Random Forest: Non-linear interactions, robust to noise
    """
    estimators = [
        # 1. L1 Lasso (Linear, sparse, interpretable)
        ('lasso', LogisticRegression(
            penalty='l1',
            solver='saga',
            C=0.2,
            class_weight='balanced',
            max_iter=1000,
            n_jobs=n_jobs_inner
        )),

        # 2. Random Forest (Non-linear interactions)
        ('rf', RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            min_samples_leaf=10,
            class_weight='balanced',
            n_jobs=n_jobs_inner,
            random_state=42
        ))
    ]

    # Meta-Learner: Logistic Regression learns optimal combination weights
    stack = StackingClassifier(
        estimators=estimators,
        final_estimator=LogisticRegression(solver='lbfgs', fit_intercept=True),
        cv=3,
        n_jobs=1,
        passthrough=False
    )
    return stack
```

### Optional: Expanded Diversity Library

For more robust ensemble, add additional learners:

```python
from sklearn.ensemble import GradientBoostingClassifier

def get_super_learner_expanded(n_jobs_inner=1):
    """Expanded SuperLearner with more diversity."""
    estimators = [
        # 1. Strong Lasso (sparse)
        ('lasso_strong', LogisticRegression(
            penalty='l1', solver='saga', C=0.1,
            class_weight='balanced', max_iter=1000, n_jobs=n_jobs_inner
        )),

        # 2. Weak Lasso (more features)
        ('lasso_weak', LogisticRegression(
            penalty='l1', solver='saga', C=1.0,
            class_weight='balanced', max_iter=1000, n_jobs=n_jobs_inner
        )),

        # 3. Random Forest (deep)
        ('rf', RandomForestClassifier(
            n_estimators=100, max_depth=20,
            class_weight='balanced', n_jobs=n_jobs_inner, random_state=42
        )),

        # 4. Gradient Boosting (optional - slower but accurate)
        ('gb', GradientBoostingClassifier(
            n_estimators=100, max_depth=4, learning_rate=0.1,
            random_state=42
        ))
    ]

    stack = StackingClassifier(
        estimators=estimators,
        final_estimator=LogisticRegression(solver='lbfgs'),
        cv=3, n_jobs=1, passthrough=False
    )
    return stack
```

### Cross-Fitted AIPW with EIF

```python
from sklearn.model_selection import StratifiedKFold
from sklearn.base import clone
from joblib import Parallel, delayed
from scipy.stats import norm
import numpy as np

def calculate_e_value(rr_or_hr):
    """Calculates E-Value for unmeasured confounding."""
    if rr_or_hr <= 1: return 1
    return rr_or_hr + np.sqrt(rr_or_hr * (rr_or_hr - 1))

def _fit_super_learner_fold(train_idx, eval_idx, X_sparse, T_full, Y_full):
    """Worker function for a single fold of Cross-Fitting."""
    X_train, X_eval = X_sparse[train_idx], X_sparse[eval_idx]
    T_train, T_eval = T_full[train_idx], T_full[eval_idx]
    Y_train, Y_eval = Y_full[train_idx], Y_full[eval_idx]

    # 1. Propensity Score Model (Pi)
    sl_ps = get_super_learner(n_jobs_inner=1)
    sl_ps.fit(X_train, T_train)
    pi_hat = sl_ps.predict_proba(X_eval)[:, 1]
    pi_hat = np.clip(pi_hat, 0.025, 0.975)  # Trimming

    # 2. Outcome Models (Mu)
    mask0 = (T_train == 0)
    mask1 = (T_train == 1)

    # Mu0 (Outcome if No Treatment)
    sl_mu0 = get_super_learner(n_jobs_inner=1)
    sl_mu0.fit(X_train[mask0], Y_train[mask0])
    mu0_hat = sl_mu0.predict_proba(X_eval)[:, 1]

    # Mu1 (Outcome if Treatment)
    sl_mu1 = get_super_learner(n_jobs_inner=1)
    sl_mu1.fit(X_train[mask1], Y_train[mask1])
    mu1_hat = sl_mu1.predict_proba(X_eval)[:, 1]

    # 3. Compute Efficient Influence Function (EIF)
    term1 = mu1_hat - mu0_hat
    term2 = (T_eval * (Y_eval - mu1_hat)) / pi_hat
    term3 = ((1 - T_eval) * (Y_eval - mu0_hat)) / (1 - pi_hat)
    eif_chunk = term1 + term2 - term3

    return eval_idx, mu0_hat, mu1_hat, pi_hat, eif_chunk


def run_cross_fitted_aipw(X_sparse_matrix, T_full, Y_full, n_folds=5):
    """Main driver for K-Fold Cross-Fitting."""
    kf = StratifiedKFold(n_splits=n_folds, shuffle=True, random_state=42)
    n = len(T_full)

    mu0_hat = np.zeros(n)
    mu1_hat = np.zeros(n)
    pi_hat  = np.zeros(n)
    eif_val = np.zeros(n)

    print(f"Running {n_folds}-Fold Super Learner (Lasso + RF) in PARALLEL...")

    results = Parallel(n_jobs=n_folds, verbose=10)(
        delayed(_fit_super_learner_fold)(train_idx, eval_idx, X_sparse_matrix, T_full, Y_full)
        for train_idx, eval_idx in kf.split(X_sparse_matrix, T_full)
    )

    for eval_idx, mu0_c, mu1_c, pi_c, eif_c in results:
        mu0_hat[eval_idx] = mu0_c
        mu1_hat[eval_idx] = mu1_c
        pi_hat[eval_idx]  = pi_c
        eif_val[eval_idx] = eif_c

    # Statistics & Inference
    ate = np.mean(eif_val)
    se = np.std(eif_val) / np.sqrt(n)
    p_value = 2 * (1 - norm.cdf(np.abs(ate / se))) if se > 0 else 0.0

    risk_1 = np.mean(mu1_hat)
    risk_0 = np.mean(mu0_hat)
    rr = risk_1 / risk_0 if risk_0 > 0 else 0.0

    # ESS from AIPW weights
    w = np.where(T_full==1, 1/pi_hat, 1/(1-pi_hat))
    ess = (np.sum(w) ** 2) / np.sum(w ** 2)

    # E-Value
    e_calc_rr = 1/rr if (rr < 1 and rr > 0) else rr
    e_val = calculate_e_value(e_calc_rr) if not np.isnan(rr) else 1.0

    stats = {
        'ATE': ate, 'SE': se, 'P_Value': p_value,
        'Risk_1': risk_1, 'Risk_0': risk_0,
        'RR': rr, 'ESS': ess, 'E_Value': e_val,
        'CI_Lower': ate - 1.96*se, 'CI_Upper': ate + 1.96*se
    }

    predictions = {'mu0': mu0_hat, 'mu1': mu1_hat, 'pi': pi_hat, 'eif': eif_val}
    return stats, predictions
```

### EIF Formula Explained

```
psi_i = [mu1(Xi) - mu0(Xi)]                    # Outcome model component
      + Ti * (Yi - mu1(Xi)) / pi(Xi)           # Treated augmentation
      - (1-Ti) * (Yi - mu0(Xi)) / (1-pi(Xi))   # Control augmentation

ATE = mean(psi_i)
SE(ATE) = std(psi_i) / sqrt(n)
```

**Doubly Robust Property:** Consistent if EITHER propensity OR outcome model is correctly specified.

---

## 4. Robustness Checks

### A. Overlap Coefficient (Weighted Histogram Method)

```python
def calculate_overlap_coefficient(data0, data1, weights0, weights1, bins=100):
    """
    Calculates the overlapping area of two weighted density distributions.

    Returns: float between 0 (no overlap) and 1 (perfect overlap)
    """
    # Create common bin edges
    min_val = min(data0.min(), data1.min())
    max_val = max(data0.max(), data1.max())
    bins_edges = np.linspace(min_val, max_val, bins)

    # Calculate weighted histograms
    hist0, _ = np.histogram(data0, bins=bins_edges, weights=weights0, density=True)
    hist1, _ = np.histogram(data1, bins=bins_edges, weights=weights1, density=True)

    # Calculate intersection area
    bin_width = bins_edges[1] - bins_edges[0]
    overlap_area = np.sum(np.minimum(hist0, hist1)) * bin_width
    return overlap_area

# Usage
ps_control = df_final[df_final['contrast_received']==0]['ps']
w_control = df_final[df_final['contrast_received']==0]['iptw']
ps_treated = df_final[df_final['contrast_received']==1]['ps']
w_treated = df_final[df_final['contrast_received']==1]['iptw']

overlap_score = calculate_overlap_coefficient(ps_control, ps_treated, w_control, w_treated)

# Interpretation
if overlap_score < 0.1:
    print("WARNING: Poor overlap. Estimates rely heavily on extrapolation.")
elif overlap_score > 0.5:
    print("SUCCESS: Strong clinical equipoise between groups.")
```

### B. Sparse Matrix SMD Calculation

```python
import scipy.sparse as sp

def sparse_weighted_mean_var(X, weights):
    """
    Calculates means/vars of sparse matrix X with weights WITHOUT densifying.
    Critical for 70k+ features.
    """
    W = sp.diags(weights)
    X_weighted = W @ X
    sum_w = np.sum(weights)
    means = np.array(X_weighted.sum(axis=0) / sum_w).flatten()

    # Var = E[X^2] - (E[X])^2
    X2 = X.power(2)
    means2 = np.array((W @ X2).sum(axis=0) / sum_w).flatten()
    vars_ = means2 - (means ** 2)
    return means, vars_


def get_smd(X, t, w):
    """Calculate SMD using sparse-aware weighted means."""
    mu_1, var_1 = sparse_weighted_mean_var(X[t==1], w[t==1])
    mu_0, var_0 = sparse_weighted_mean_var(X[t==0], w[t==0])

    pooled_sd = np.sqrt((var_1 + var_0) / 2)
    pooled_sd[pooled_sd == 0] = 1e-6  # Avoid div/0

    return np.abs((mu_1 - mu_0) / pooled_sd)


# Love Plot (Top 50 imbalanced features)
smd_unw = get_smd(X_final, T_final, np.ones(len(T_final)))
smd_w = get_smd(X_final, T_final, df_final['iptw'].values)

top_idx = np.argsort(smd_unw)[-50:]
plt.figure(figsize=(8, 10))
plt.scatter(smd_unw[top_idx], range(50), label='Unadjusted', alpha=0.6)
plt.scatter(smd_w[top_idx], range(50), label='Adjusted', alpha=0.8)
plt.axvline(0.1, color='r', linestyle='--')
plt.title("Covariate Balance (Top 50 Variates)")
plt.xlabel("Absolute SMD")
plt.legend()
```

### C. E-Value (Unmeasured Confounding Sensitivity)

```python
def calculate_e_value(rr):
    """
    Calculate E-value: minimum confounding strength to explain away effect.

    Interpretation: E-value of 2.5 means unmeasured confounder would need
    to be associated with both treatment and outcome by RR >= 2.5 to
    fully explain away the observed effect.
    """
    if rr <= 1:
        return 1
    return rr + np.sqrt(rr * (rr - 1))
```

### D. Empirical Null Calibration Engine

```python
from scipy.stats import norm

def calibrate_estimates(results_df):
    """
    Fits an Empirical Null distribution to Negative Controls and calibrates
    the P-values and CIs for Main Outcomes.

    Assumption: Negative Controls have True Log-RR = 0.
    """
    # 1. Identify Negative Controls
    nc_df = results_df[results_df['Outcome'].str.startswith('NC_')].copy()

    if len(nc_df) < 10:
        print("WARNING: Too few negative controls (<10) for robust calibration.")
        return results_df

    # 2. Extract Log-RR and SE
    nc_df['log_rr'] = np.log(nc_df['HR_Cox'].astype(float))
    nc_df['se_log_rr'] = (np.log(nc_df['HR_CI_High'].astype(float)) -
                          np.log(nc_df['HR_CI_Low'].astype(float))) / 3.92

    nc_df = nc_df.replace([np.inf, -np.inf], np.nan).dropna(subset=['log_rr', 'se_log_rr'])

    # 3. Fit Null Distribution (Inverse Variance Weighting)
    weights = 1.0 / (nc_df['se_log_rr'] ** 2)
    null_mean = np.average(nc_df['log_rr'], weights=weights)

    raw_var = np.average((nc_df['log_rr'] - null_mean)**2, weights=weights)
    expected_sampling_var = np.average(nc_df['se_log_rr']**2, weights=weights)
    null_var = max(0, raw_var - expected_sampling_var)
    null_sd = np.sqrt(null_var)

    print(f"Empirical Null: Mean Bias = {null_mean:.4f}, SD Bias = {null_sd:.4f}")

    # 4. Calibrate All Estimates
    calibrated_results = results_df.copy()
    log_rr = np.log(calibrated_results['HR_Cox'].astype(float))
    se_log_rr = (np.log(calibrated_results['HR_CI_High'].astype(float)) -
                 np.log(calibrated_results['HR_CI_Low'].astype(float))) / 3.92

    # Calibrated Z-Score
    z_cal = (log_rr - null_mean) / np.sqrt(se_log_rr**2 + null_sd**2)
    calibrated_results['P_Calibrated'] = 2 * (1 - norm.cdf(np.abs(z_cal)))

    # Calibrated CIs
    calibrated_se = np.sqrt(se_log_rr**2 + null_sd**2)
    calibrated_results['HR_Calibrated'] = np.exp(log_rr - null_mean)
    calibrated_results['HR_Cal_Low'] = np.exp((log_rr - null_mean) - 1.96 * calibrated_se)
    calibrated_results['HR_Cal_High'] = np.exp((log_rr - null_mean) + 1.96 * calibrated_se)

    return calibrated_results
```

### E. ESS (Effective Sample Size)

```python
def calculate_ess(weights):
    """Kish's Effective Sample Size."""
    if len(weights) == 0: return 0
    return (np.sum(weights) ** 2) / np.sum(weights ** 2)

# Target: ESS > 0.5 * N indicates stable weights
```

---

## 5. Endpoint Enumeration

### Defining Multiple Outcomes

```python
ANALYSIS_OUTCOMES = {
    'AKI_30': ({761083, 197320, 40481064, 4328366, 37116432, 45757442, 37016366}, 30),
    'NEW_DIALYSIS_90': ({4032243, 4146536, 4324124, 4019967, 40482357}, 90),
    'MORTALITY_30': ('DEATH', 30),
    'MAE_30': ('COMPOSITE', 30),  # min(AKI, Dialysis, Death)
    'THYROID_90': ({138384, 37016342, 45757058, 4032331}, 90)
}

ADDITIONAL_ENDPOINTS = {
    'AKI_7': ('date_AKI_30', 7),
    'MORTALITY_30': ('date_DEATH', 30),
    'THYROID_90': ('date_THYROID_90', 90)
}
```

### Multi-Endpoint AIPW Loop

```python
all_outcome_data = {}

for name, (date_col, window) in ADDITIONAL_ENDPOINTS.items():
    print(f">>> PROCESSING OUTCOME: {name} ({window} day window) <<<")

    # Define Binary Y
    Y_vec_new = (
        (df_final[date_col] - df_final['index_date']).dt.days <= window
    ).fillna(False).astype(int).values

    n_events = Y_vec_new.sum()
    print(f"Event Count: {n_events} ({100*n_events/len(df_final):.2f}%)")

    if n_events < 10:
        print(f"SKIPPING {name}: Insufficient events.")
        continue

    # Run AIPW (uses same X_final, T_final from primary outcome)
    stats, preds_new = run_cross_fitted_aipw(X_final, T_final, Y_vec_new, n_folds=5)

    all_outcome_data[name] = {
        'stats': stats,
        'preds': preds_new,
        'Y': Y_vec_new
    }
```

---

## 6. Subgroup Analysis (ITE-Based)

### Key Principle: NO REFITTING

The ITE-based approach uses pre-computed predictions from the main AIPW run. This avoids:
- Computational cost of refitting per subgroup
- Overfitting on small subgroups
- Inconsistent nuisance estimates across subgroups

### Computing ITEs from Pre-Computed Predictions

```python
# Pre-computed from main AIPW run
gamma_1_all = preds["mu1"] + (T_vec / preds["pi"]) * (Y_vec - preds["mu1"])
gamma_0_all = preds["mu0"] + ((1 - T_vec) / (1 - preds["pi"])) * (Y_vec - preds["mu0"])
delta_all = gamma_1_all - gamma_0_all  # ITE: effect of treatment (positive = harm)
```

### eGFR Category Analysis

```python
egfr_subgroups = {
    "eGFR < 30": [0],
    "eGFR 30-44": [1],
    "eGFR 45-59": [2],
    "eGFR >= 60": [3],
}

min_N = 50
egfr_results = []

for label, cats in egfr_subgroups.items():
    mask = df_final["egfr_cat"].isin(cats)
    N = int(mask.sum())

    if N < min_N:
        print(f"Skipping {label}: N={N}")
        continue

    # Slice pre-computed ITEs (NO REFIT)
    gamma1_S = gamma_1_all[mask]
    gamma0_S = gamma_0_all[mask]
    delta_S = delta_all[mask]

    risk1_S = float(gamma1_S.mean())
    risk0_S = float(gamma0_S.mean())
    rd_S = float(delta_S.mean())
    se_rd_S = float(delta_S.std(ddof=1) / np.sqrt(N))

    egfr_results.append({
        "Subgroup": label,
        "N": N,
        "Risk_1": risk1_S,
        "Risk_0": risk0_S,
        "ATE_RD": rd_S,
        "RD_SE": se_rd_S,
        "CI_Lower": rd_S - 1.96 * se_rd_S,
        "CI_Upper": rd_S + 1.96 * se_rd_S,
        "RR": risk1_S / risk0_S if risk0_S > 0 else np.nan,
    })
```

### Clinical Use Group Analysis

```python
clinical_groups_map = {
    "Routine Abdominal/Pelvic": {21492176, 3047782, 4335400, 37109313, 3049940,
                                  4139745, 36713200, 3018999, 4252907, 3019625,
                                  40771605, 36713202, 3035568},
    "Routine Chest (Thorax)": {4327032, 3013610, 37117305, 3047921},
    "Neuro / Head (Brain)": {4197203, 36717294, 36713262, 36713243, 3024397}
}

# Thresholds
min_total_N = 150
min_events_per_arm = 5

for group_label, codes in clinical_groups_map.items():
    mask = df_final['procedure_concept_id'].isin(codes)
    N_sub = mask.sum()

    if N_sub < min_total_N:
        continue

    # Slice ITEs (NO REFIT)
    delta_sub = delta_all[mask]

    ate = np.mean(delta_sub)
    se = np.std(delta_sub, ddof=1) / np.sqrt(N_sub)
    # ... compute CI, RR, etc.
```

---

## 7. Important Metrics

### Primary Causal Metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| ATE (Risk Difference) | E[Y1 - Y0] | Absolute risk change per patient |
| RR (Risk Ratio) | E[Y1] / E[Y0] | Relative risk multiplier |
| NNT | 1 / ATE (when ATE > 0) | Number needed to treat |
| NNH | -1 / ATE (when ATE < 0) | Number needed to harm |
| E-Value | RR + sqrt(RR*(RR-1)) | Confounding sensitivity |

### Diagnostic Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| SMD | < 0.1 | Covariate balance after weighting |
| Overlap Coefficient | > 0.5 | Common support between groups |
| ESS / N | > 0.5 | Weight stability |
| PS AUC | 0.6 - 0.85 | Propensity model discrimination |

### Inference

| Metric | Formula |
|--------|---------|
| Standard Error | std(EIF) / sqrt(n) |
| 95% CI | ATE +/- 1.96 * SE |
| P-value | 2 * (1 - Phi(|ATE/SE|)) |
| Calibrated P | From negative controls |

---

## 8. Feature Engineering

### Dense Features with Missing Value Handling

L1 Lasso requires explicit handling of missing values. Use **missing indicators + median imputation**:

```python
import numpy as np
import pandas as pd
import scipy.sparse as sp
from sklearn.impute import SimpleImputer

dense_cols = ['age', 'baseline_egfr', 'baseline_creat', 'site_contrast_rate', 'hx_thyrotoxicosis']

# Force numeric types
df_dense = df_cohort_aligned[dense_cols].apply(pd.to_numeric, errors='coerce')

# 1. Create Missing Indicators (before imputation)
missing_indicators = df_dense.isna().astype(float)
missing_indicators.columns = [f'{col}_missing' for col in dense_cols]

# 2. Impute with Median
imputer = SimpleImputer(strategy='median')
df_dense_imputed = pd.DataFrame(
    imputer.fit_transform(df_dense),
    columns=dense_cols,
    index=df_dense.index
)

# 3. Combine: Imputed Values + Missing Flags
df_dense_final = pd.concat([df_dense_imputed, missing_indicators], axis=1)

# Convert to Sparse
X_dense = sp.csr_matrix(df_dense_final.values.astype(float))
```

### Alternative: Drop Rows with Critical Missing Values

```python
# For critical vars like eGFR, consider filtering instead of imputing
critical_cols = ['baseline_egfr']
mask_complete = df_cohort_aligned[critical_cols].notna().all(axis=1)

print(f"Rows with complete data: {mask_complete.sum()} / {len(df_cohort_aligned)}")
df_cohort_filtered = df_cohort_aligned[mask_complete].copy()
```

### Site Rate Smoothing (Instrumental Variable)

```python
if 'zip_code' in df_cohort_aligned.columns:
    site_counts = df_cohort_aligned.groupby('zip_code')['contrast_received'].agg(['mean', 'count'])
    global_mean = df_cohort_aligned['contrast_received'].mean()
    C_smooth = 10  # Smoothing constant

    site_counts['smoothed_rate'] = (
        site_counts['mean'] * site_counts['count'] + global_mean * C_smooth
    ) / (site_counts['count'] + C_smooth)

    df_cohort_aligned['site_contrast_rate'] = df_cohort_aligned['zip_code'].map(
        site_counts['smoothed_rate']
    ).fillna(global_mean)
```

### Sparse Feature Matrix (High-Dimensional OMOP)

```python
import scipy.sparse as sp

# Filter by prevalence >= 50 patients
feature_counts = df_features['feature_name'].value_counts()
valid_feats_set = set(feature_counts[feature_counts >= 50].index)
feat_to_idx = {feat: i for i, feat in enumerate(sorted(list(valid_feats_set)))}

# Build sparse matrix
row_indices = df_features_valid['person_id'].map(pid_to_idx).values
col_indices = df_features_valid['feature_name'].map(feat_to_idx).values
values = np.ones(len(row_indices))

X_sparse = sp.coo_matrix(
    (values, (row_indices, col_indices)),
    shape=(len(df_cohort), len(valid_feats_set))
).tocsr()

# Binarize
X_sparse.data = np.ones_like(X_sparse.data)
```

### Final Stack

```python
# Stack dense + sparse
# Note: L1 Lasso is scale-invariant due to regularization, but scaling can help convergence
X_all = sp.hstack([X_dense, X_sparse], format='csr')

# Optional: Scale dense features for faster convergence
from sklearn.preprocessing import StandardScaler

# If you want to scale just the dense portion:
scaler = StandardScaler(with_mean=False)  # with_mean=False for sparse compatibility
X_dense_scaled = scaler.fit_transform(df_dense_final.values)
X_dense_scaled_sparse = sp.csr_matrix(X_dense_scaled)

X_all_scaled = sp.hstack([X_dense_scaled_sparse, X_sparse], format='csr')
```

---

## 9. Propensity Score Trimming

```python
PS_MIN = 0.025
PS_MAX = 0.975

# Trim extremes
mask_keep = (ps > PS_MIN) & (ps < PS_MAX)
df_final = df_cohort_aligned[mask_keep].copy()
X_final = X_all[mask_keep]
T_final = T[mask_keep]
ps_final = ps[mask_keep]

# Stabilized IPTW Weights
p_t = T_final.mean()
weights = np.where(
    T_final == 1,
    p_t / ps_final,
    (1 - p_t) / (1 - ps_final)
)
df_final['iptw'] = weights

# Check ESS
ess = calculate_ess(weights)
print(f"Effective Sample Size (ESS): {ess:.0f}")
```

---

## 10. Survival Analysis (IPTW-Weighted)

```python
from lifelines import KaplanMeierFitter, CoxPHFitter

# Time-to-event
event_date = df_viz['date_AKI_30']
idx_date = df_viz['index_date']
event_date_filled = event_date.fillna(idx_date + pd.Timedelta(days=30))
t_days = (event_date_filled - idx_date).dt.days.clip(lower=0, upper=30)

df_viz['T_viz'] = t_days
df_viz['E_viz'] = ((event_date.notnull()) &
                   ((event_date - idx_date).dt.days <= 30)).astype(int)

# IPTW-Weighted Kaplan-Meier
kmf0 = KaplanMeierFitter()
kmf1 = KaplanMeierFitter()

kmf0.fit(
    df_viz[df_viz['contrast_received'] == 0]['T_viz'],
    df_viz[df_viz['contrast_received'] == 0]['E_viz'],
    weights=df_viz[df_viz['contrast_received'] == 0]['iptw'],
    label='Withheld'
)
kmf1.fit(
    df_viz[df_viz['contrast_received'] == 1]['T_viz'],
    df_viz[df_viz['contrast_received'] == 1]['E_viz'],
    weights=df_viz[df_viz['contrast_received'] == 1]['iptw'],
    label='Contrast'
)

# Cox Model
cph = CoxPHFitter(penalizer=0.1)
cph.fit(
    df_viz[['T_viz', 'E_viz', 'contrast_received', 'iptw']],
    duration_col='T_viz',
    event_col='E_viz',
    weights_col='iptw'
)
```

---

## 11. Negative Control Definitions

65 negative control outcomes for empirical calibration:

```python
NEGATIVE_CONTROLS = {
    # General conditions
    'NC_Ingrown_Nail': {139900},
    'NC_Ankle_Sprain': {4196156},
    'NC_Cataract': {375545},
    'NC_Otitis_Media': {378534},
    'NC_T2DM': {201826},
    'NC_Hypertension': {320128},
    'NC_Hyperlipidemia': {432867},
    'NC_Gout': {439392},
    'NC_Depression': {4282316},
    'NC_Anxiety': {436073},
    'NC_Insomnia': {436962},
    'NC_Osteoarthritis': {4079750, 4155298},
    'NC_Low_Back_Pain': {4213162},
    'NC_Allergic_Rhinitis': {379805},
    'NC_GERD': {192279},
    'NC_Migraine': {375527},
    'NC_Hypothyroidism': {140673},
    'NC_Varicose_Veins': {318800},

    # Dermatology
    'NC_Constipation': {75860},
    'NC_Ulcer_Lower_Extremity': {197304},
    'NC_Ulcer_Foot': {74719},
    'NC_Cellulitis_Lower_Limb': {42709838},
    'NC_Iron_Deficiency_Anemia': {436659},
    'NC_Actinic_Keratosis': {138825},
    'NC_Senile_Hyperkeratosis': {141932},
    'NC_Pressure_Ulcer': {135333},

    # ENT / Eye
    'NC_Wax_In_Ear_Canal': {4155902},
    'NC_Impacted_Cerumen': {374375},
    'NC_Otitis_Externa': {380731},
    'NC_Hearing_Loss': {377889},
    'NC_Hearing_Difficulty': {4038030},
    'NC_Blepharitis': {378425},
    'NC_Acute_Conjunctivitis': {376707},
    'NC_Dry_Eyes': {4036620},
    'NC_Glaucoma': {437541},
    'NC_AMD_Age_Related_Macular_Degeneration': {374028},
    'NC_Cataract_Bilateral': {4317977},

    # MSK / Pain
    'NC_Foot_Pain': {4169905},
    'NC_Laceration_Lower_Leg': {4155040},
    'NC_Laceration_Injury': {443419},
    'NC_Open_Wound_Lower_Leg': {4053604},
    'NC_Traumatic_Wound': {46287159},
    'NC_Osteopenia': {4195039},
    'NC_Low_Back_Pain_Alt': {194133},

    # GI / GU
    'NC_Rectal_Hemorrhage': {4026112},
    'NC_Hemorrhoids': {195562},
    'NC_Acid_Reflux': {44783954},
    'NC_Colon_Polyp': {4285898},
    'NC_Gallstone': {196456},
    'NC_Urinary_Incontinence': {197672},

    # Endocrine / Metabolic
    'NC_Vitamin_D_Deficiency': {436070},
    'NC_Acquired_Hypothyroidism': {138384},

    # Skin Cancers
    'NC_Basal_Cell_Carcinoma_Skin': {4112752},
    'NC_Squamous_Cell_Carcinoma_Skin': {4111921},

    # Reproductive / GU
    'NC_Irregular_Menses': {196168},
    'NC_Vulval_Irritation': {4060207},
    'NC_Vaginal_Irritation': {4058568},
    'NC_Prostatism': {4016155},
    'NC_BPH': {198803},

    # Neuro / Psych
    'NC_Mild_Depression': {4149320},
    'NC_Chest_Pain': {77670},
    'NC_Throat_Irritation': {4038048},
    'NC_Migraine_Alt': {318736},

    # Hernia
    'NC_Inguinal_Hernia': {4288544},
}

ALL_NEGATIVE_CONTROL_IDS = set().union(*NEGATIVE_CONTROLS.values())
```

---

## 12. Clinical Procedure Groups

```python
# Exposure Definitions
CONTRAST_CT = {4139745, 21492176, 4335400, 3047782, 4327032, 3013610, 36713226, 3053128, 4252907, 3019625}
CONTRAST_MRI = {4335399, 4161393, 4202274, 4197203, 36717294, 45765683, 37117806, 37109194, 37109196}
CONTRAST_IDS = CONTRAST_CT.union(CONTRAST_MRI)

NON_CONTRAST_CT = {37109313, 3049940, 37117305, 3047921, 36713200, 3018999, 40771605, 36713202, 3035568}
NON_CONTRAST_MRI = {37109312, 36713204, 36713045, 36713262, 3024397, 36713243, 3053040, 37109329, 42535581, 42535582}
NON_CONTRAST_IDS = NON_CONTRAST_CT.union(NON_CONTRAST_MRI)

# Clinical Use Groups
CHEST_CODES = {4327032, 3013610, 37117305, 3047921}
ABD_PEL_CODES = {21492176, 3047782, 4335400, 37109313, 3049940, 4139745, 36713200, 3018999,
                 4252907, 3019625, 40771605, 36713202, 3035568}

# Exclusions (Structural Zeros + Low N)
STRUCTURAL_ZEROS = {3018999, 3035568, 3049940}
LOW_N_NOISE = {3013610, 3047921, 3047782, 37109313}

TARGET_PROCEDURES = CHEST_CODES.union(ABD_PEL_CODES) - STRUCTURAL_ZEROS - LOW_N_NOISE
```

---

## 13. Model Checkpointing

### Saving Checkpoints

```python
import joblib
import scipy.sparse as sp

# Save dataframe
df_cohort.to_parquet("df_cohort.parquet")

# Save sparse matrix
sp.save_npz("X_sparse.npz", X_sparse)

# Save mappings
joblib.dump(pid_to_idx, "pid_to_idx.joblib")
joblib.dump(feat_to_idx, "feat_to_idx.joblib")
joblib.dump(dense_cols, "dense_cols.joblib")

# Save LSPS model (L1 Lasso)
joblib.dump(lsps_model, 'lsps_model_global.joblib')

# Save PS scores
df_cohort_aligned.to_parquet('df_cohort_with_ps.parquet')

# Save AIPW results
joblib.dump(all_outcome_data, "aipw_all_outcomes_results.joblib")
```

### Loading Checkpoints

```python
import joblib
import scipy.sparse as sp
import pandas as pd

# Load dataframe
df_cohort = pd.read_parquet("df_cohort.parquet")

# Load sparse matrix
X_sparse = sp.load_npz("X_sparse.npz")

# Load mappings
pid_to_idx = joblib.load("pid_to_idx.joblib")
feat_to_idx = joblib.load("feat_to_idx.joblib")

# Load model
lsps_model = joblib.load('lsps_model_global.joblib')

# Load AIPW results
all_outcome_data = joblib.load("aipw_all_outcomes_results.joblib")
```

---

## Quick Reference Card

### Model Setup
```python
# Propensity Score (LSPS - L1 Lasso)
ps = LogisticRegression(
    penalty='l1', solver='saga', C=0.2,
    class_weight='balanced', max_iter=1000, n_jobs=-1
)

# SuperLearner (Lasso + Random Forest)
sl = StackingClassifier([
    ('lasso', LogisticRegression(penalty='l1', solver='saga', C=0.2)),
    ('rf', RandomForestClassifier(n_estimators=100, max_depth=20))
], cv=3)
```

### Key Thresholds
| Metric | Target |
|--------|--------|
| SMD | < 0.1 |
| ESS/N | > 0.5 |
| Overlap Coeff | > 0.5 |
| PS Range | [0.025, 0.975] |
| Min Events | 10 per group |
| Min Subgroup N | 100-150 |
| Min NC for Calibration | 10 |

### Formula Reference
```
EIF = (mu1 - mu0) + T*(Y - mu1)/pi - (1-T)*(Y - mu0)/(1-pi)
ATE = mean(EIF)
SE = std(EIF) / sqrt(n)
E-value = RR + sqrt(RR * (RR - 1))
ESS = sum(w)^2 / sum(w^2)
Overlap = sum(min(hist0, hist1)) * bin_width
```

---

*Source: Extracted from CausalContrastStudy methodology (LSPS - L1 Lasso implementation)*
*For use by trialRunnerAgent*
