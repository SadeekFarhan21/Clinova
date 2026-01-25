The Grace Checklist: https://pmc.ncbi.nlm.nih.gov/articles/PMC10398313/pdf/jmcp-022-010-1107.pdf#/

Guidelines for nonintervetional, comparative effectiveness studies 

Goal: Determine *reliability* for use in decision support trials (or more broadly, health tech assessments)

> solely focuses on comparative treatment effect 

> based on human judgement (human experts as a judge)

> used for drug effectiveness (isn't really translateble to RWE-TTE outcomes)

finds features *predictive* (not associated) with quality

some outcomes:
> robustness / sensitivity tests are extremely important

> write down confounders >> have a good trial spec but that is also pretty obvious
> use of concurrent comparators

> limiting study to only new initators of study drug? 

> equivalent outcomes btwn groups (pretty easy add for the rubric, but obvious in the TTE framework)


ROBINS: https://www.bmj.com/content/bmj/355/bmj.i4919.full.pdf#/

Goal: Estimate risk of bias in non-randomized studies of interventions

> may not translate to TTE b/c TTE emulates randomization, but in the case of unmeasured confounding, etc., this may be useful

> but their method is interesting: "The tool views each study as an attempt to emulate (mimic) a hypothetical pragmatic randomised trial, and covers seven distinct domains through which bias might be introduced"

their work focuses on cohort and case-control studies inparticular but note that their work extends to "quasi-randomized studies where method of allocation falls short of full randomization"...in worst-case TTEs there is overlap here

specifically, the estimate they concerns themselves with is effectiveness/safety of interventions 

this is a very complicaed problem -- they note that "Evaluations of risk of bias in the results of NRSI are
facilitated by considering each NRSI as an attempt to
emulate (mimic) a “target” trial. This is the hypothetical pragmatic randomised trial, conducted on the
same participant group and without features putting it
at risk of bias, whose results would answer the question addressed by the NRSI.11 12 Such a “target” trial 
"..

so if they are running a TTE to estimate risk in a non-randomized study...can we use this method to estimate a TTE's risk? is this even any better than an e-val / robustness+senstivity? checks. im going to hold off on notes till thsi question is anwsered.

this goes over the Robins-1 paper: 
TODO!!!:
- need to extend to: 
> Robins-2 which meaningfully updates on robins 1: https://www.riskofbias.info/welcome/robins-i-v2, https://drive.google.com/file/d/1tXCLVa7aFVaiV3OnitZDgAnX3kXWXor0/view?usp=sharing

> https://www.riskofbias.info/welcome/rob-2-0-tool#/, which assess risk of bias in randomized trials with subvariants for:

individually-randomized, parallel-group trials

cluster-randomized

crossover 

idk if these have any meaningfullness for TTEs

>ROBINS-E

Risk Of Bias In Non-randomized Studies - of Exposures

also unsure if meaningufl for our work

> ROB-ME

A tool for assessing Risk Of Bias due to Missing Evidence in a synthesis

also unsure

RCT DUPLICATE initiative: https://pmc.ncbi.nlm.nih.gov/articles/PMC7940583/pdf/nihms-1666246.pdf#/

RCT-DUPLICATE evaluates the *design* of RWE-TTE-RCTs. (Search) i think the RCT-Duplicate program is much much larger than just this paper, and probably are new extentntions of this work from 2021

they attempt to reproduce 10 RCTs (note: they subgroups by active-controlled vs. placebo-controlled RCTs) using TTEs

their TTEs use a IPTW-PS on a small set of confounders, use Hazard Ratios as their estimates, all hand-designed

conclusion: 6/10 matched the same *regulatory conclusion* (this is an important note we need to translate too -- TTEs and real RCTs shouldn't have the exact same design, but the interpretation of their results should point to the same conclusion / decision for regulators)

in 8/10 the HR estimate was within CI (note: why more with same HRthan reg conclusion?) and 9/10 either regulatory or estimate agreement was filled (interpret this: what does this mean??, what does this tell us about theeir performance?)

"The goal is threefold: 1) identify a process of
transparent RWE development that predefines and preregisters all study parameters for a
single primary analysis; 2) following this process, quantify how often RWE studies would
come to the same conclusion; and 3) identify the factors that influence whether these two
study approaches yield similar results.20 In this paper, we report the findings of the first 10
attempted replications of RCTs of antidiabetic medications and antiplatelets."

thier method is a lot worse than the method we'll use (i dont think we can expect order-better estimate results, but certainly in robustness to hard to emulate trials eg. heavy confounding, and perhaps better sensitivity, easier to design estimates, etc.)

outcome was measured by MACE

they used intention to treat estimates, Cox regression, etc. 

agreement metrics (important in desining our study!): 
 1) “Regulatory agreement” was defined as the
ability of the RWE study to replicate the direction and statistical significance of the RCT
finding; 2) “Estimate agreement” was defined as a RWE-HR estimate that was within the
95% CI for the RCT estimate; 3) we conducted hypothesis tests to evaluate whether there
was a difference in findings by calculating the standardized difference between the RCT and
RWE effect estimates.

Comparator emulation was considered good if the RCT had an active comparator; moderate
if a placebo comparison was emulated by an alternative drug thought to be unrelated with
the endpoint of interest, and it was shown to be used in patients with highly similar
characteristics, as shown in the covariate balance; and poor if a placebo comparison was
emulated by an alternative drug thought to be unrelated to the endpoint of interest, but it was
shown to be used in patients with different characteristics, as shown in the covariate balance.
Endpoint emulation was considered good if the trial outcome could be assessed with high
specificity, moderate if key aspects of the RCT outcome definition were likely to be captured
with lower specificity, as shown in the event rates.

their endpoint evaluation ended up being moderate b/c lower specificivity of eventcaputre and MACE was always a little bit lower than RCT

in their study, majority or patients were censored b/c of discontinuation of index exposure -- only relevant in a subset of our trials...in general i want to stay away from censoring logic/design that is a giant rabbit hole


"we found that 6 out of 10 emulations met the
Franklin et al. Page 8
Circulation. Author manuscript; available in PMC 2022 March 09.
Author Manuscript Author Manuscript Author Manuscript Author Manuscript
criteria for full regulatory agreement. Eight out of 10 emulations achieved estimate
agreement. In only one emulation, the standardized difference was >2 (p=0.002)"
but..."Some emulations would be expected to fail to produce findings similar to the RCT, even in
the absence of any bias,20 just as RCTs sometimes fail to replicate prior RCT findings."

i think the followup to the study can be found here: https://doi.org/10.1001/jama.2023.4221 with a correction here: https://pmc.ncbi.nlm.nih.gov/articles/PMC11004825/

they look at n=32 in the same manner, but they use a new (maybe better?) methodology in terms of comparing the RCTs to the TTEs.

they use pearson correlation (over statistical signficiance interval overlap) , and a standarized difference ageement. in the subgroup with higher design similarity, they say a much higher agreement, and much lower in trials that were not designed similarily / weaker, most often b/c of low-n in the data

i only wrote notes for the abstract, TODO: still need to enumerate over the rest of the study and its nuances


RECORD-PE: https://www.bmj.com/content/bmj/363/bmj.k3532.full.pdf#/

not relevant (for non-randomized) but still a good example of how to share rubrics/standards


TARGET Standards (Most important!): https://www.bmj.com/content/bmj/390/bmj-2025-087179.full.pdf

> Guidance on how to report on studies >> we can take the inverse to see what is required in a good / stable TTE design

> main pts: (1) identify the study as an observational emulation of
a target trial; (2) summarize the causal question and
reason for emulating a target trial; (3) clearly specify
the target trial protocol (ie, the causal estimand,
identifying assumptions, data analysis plan) and
how it was mapped to the observational data; and
(4) report the estimate obtained for each causal
estimand, its precision, and findings from additional
analyses to assess the sensitivity of the estimates to
assumptions, and design and analysis choices.


> first step si to specifc the causal question in terms of a target trial protocol by defining the causal effect of interest (causal estimand), the key assumptions, the data analysis plan, 2) describing how each omponent of the
target trial protocol is mapped to the observational
data. When followed correctly, the framework should
eliminate some biases that are due to an incorrect use
of the observational data (eg, selection bias due to
inclusion of individuals after initiation of treatment or
other biases that generate “immortal time”5 6), so that
investigators can focus on other sources of bias due to
limitations of the observational data (eg, confounding,
measurement error, and missing data).


it outlines a giant checklist (both in a table that should be captured as an image, and as text) we need to verifiably enumerate over all the pages


Need to look at other TARGET group literature, it is the highest quality guidelines, reporting, reccomendations


BenchExCal: https://pmc.ncbi.nlm.nih.gov/articles/PMC12087693/pdf/CPT-117-1820.pdf#/


introduces an approach to using RWE to support clinicl indication expansions. isn't methodology but one of many papers which seek to or are examples of a TTE being used for some purpose. with these types of papers, it is important to know when they were published b/c go old quickly and SOTA methods move

i do enjoy this paper b/c it does good analysis on RCT-Duplicate and its shortcomings/designs improvements. 

for ex. this is a good point: "Nonetheless, some aspects of RCT designs are difficult to emulate
with secondary data collected as part of routine clinical care.11,21,24 While
RCTs that study the efficacy of drugs are often designed to isolate the
treatment experiment from particular practice patterns, database studies
evaluate a mix of the drug effect and the system in which it is used.21 Even
when database studies use the same pre-defined inclusion/exclusion criteria, including age range and sex, RCT participants are usually younger, and
fewer are female, which can have implications if the effects of the drug vary
based on these characteristics.22 "

see: benchex.png 

there are multiple approaches similar to benchexcal, for ex. Hernan's ROAD, which pair RCT evidence with RWE to account for unmeasured biases


---

# GPT-5.2-Thinking Paper Notes (Papers 1-15)

*Papers processed using GPT-5.2-Thinking with web search and high reasoning effort.*

---

## Paper 1: The target trial framework for causal inference from observational data: why and when is it helpful?

**Citation**: Hernán MA et al. (2025) - The target trial framework for causal inference from observational data: why and when is it helpful?
**Journal**: Ann Intern Med
**DOI**: [10.7326/ANNALS-24-01871](https://doi.org/10.7326/ANNALS-24-01871)

### Notes (via GPT-5.2-Thinking with Web Search)

### Paper
Hernán MA, Dahabreh IJ, Dickerman BA, Swanson SA. *The target trial framework for causal inference from observational data: Why and when is it helpful?* **Ann Intern Med.** 2025 Feb 18;178(3):402–407. doi:10.7326/ANNALS-24-01871.

---

## 1) Goal: What is this paper trying to achieve?
- **Clarify the utility/scope of target trial emulation (TTE)** as a *two-step framework*: (1) specify the protocol of the hypothetical randomized pragmatic trial that would answer the question (the "target trial"), then (2) use observational data to emulate it.
- **Positioning:** TTE is emphasized as a way to (a) reduce ambiguity in causal questions, (b) prevent "design-induced" biases, and (c) make assumptions explicit—**but it does not fix biases caused by data limitations** (e.g., unmeasured/mismeasured confounding).

---

## 2) TTE relevance: does it inform what makes a "valid" TTE design?
Yes—this paper is essentially about **what "valid design" means in TTE** (distinct from "valid identification given data").

### Core standard: explicitly define the target trial protocol (causal estimand components)
They restate the idea that a well-conducted randomized trial asks a well-defined causal question because the protocol specifies:
- eligibility criteria
- treatment strategies
- treatment assignment procedure
- outcomes
- start/end of follow-up
- causal contrast (estimand; e.g., intention-to-treat)
…and additionally, a statistical analysis plan (estimator).

### Updated structure (Figure/table) for target trial specification + emulation mapping
The paper's Figure provides an actionable "protocol template" organized into:
- **Causal estimand** (specification) + **data mapping** (emulation)
- **Identifying assumptions** (specification) + **operationalization/mapping** (emulation)
- **Estimator** (specification) + **modifications + sensitivity analyses** (emulation)

---

## 3) Bias considerations: immortal time, confounding, selection bias, other pitfalls
### "Design-induced" biases TTE is meant to prevent
- The framework is framed as preventing common **design biases**, explicitly calling out **selection bias** and **immortal time bias**, by ensuring the population is defined by eligibility criteria met **at the time of assignment** (not earlier/later).
- Concrete pitfalls they highlight:
  - Defining a comparison arm as "people who never started treatment during follow-up" can induce **selection bias**.
  - Defining a comparison arm as "people who started treatment at some point during follow-up" can induce **immortal time bias**.
- They connect these issues to failures where observational estimates disagreed with RCTs (e.g., hormone therapy–CHD; statins–cancer), arguing later work showed the discrepancies could be greatly reduced when the causal question was translated into an explicit target trial protocol and emulation.

### Confounding / selection due to censoring are *not* magically solved
- TTE helps avoid **design biases**, but **does not eliminate data-driven biases** like measurement error, unmeasured confounding, or selection bias from loss to follow-up—if important confounders are unmeasured/mismeasured, a baseline-confounder-adjusted emulation "will fail."

### Per-protocol vs intention-to-treat framing (bias implications)
- They distinguish:
  - **Effect of assignment (intention-to-treat)**: unbiased in trials via randomization (absent loss to follow-up).
  - **Per-protocol effect**: can be biased if estimated naively (e.g., excluding non-adherers) because treatment received is not randomized; valid estimation may require adjusting **baseline and time-varying confounders**.

---

## 4) Methodology: statistical methods, estimands, agreement metrics recommended
### Estimands emphasized
- **Effect of assignment (ITT)** and **per-protocol effect** are the key causal contrasts discussed.
- They also emphasize explicitly incorporating:
  - **loss to follow-up** (selection)
  - **competing events** (competing risks)
  into the estimand/assumptions as needed.

### Identification strategies acknowledged (beyond "adjust for baseline confounders")
- While their example emphasizes **conditional exchangeability given measured baseline confounders** for the ITT analogue, they explicitly note the target trial framework can be paired with other identification strategies:
  - instrumental variables
  - difference-in-differences
  - proximal causal inference

### What they *don't* provide here
- This short perspective **does not prescribe specific estimators** (e.g., IPTW-PS, TMLE) nor does it propose RCT-duplicate *agreement metrics*; it instead frames TTE as a "unifying approach" rather than a statistical method.

---

## 5) Design requirements: what does a good TTE need (checklists/protocols)?
### Two "when helpful" conditions = high-level requirements gate
They propose two key conditions under which TTE is especially helpful:
1. Treatment strategies correspond to **sufficiently well-defined interventions**
2. You can **map the target trial protocol components to existing or newly generated data**

They further assert TTE is **not possible** when the corresponding randomized trial is not possible "even in principle," including:
- interventions too ill-defined/vague (ill-defined counterfactual contrast)
- or protocol components can't be mapped to data (question too complex / not tethered to real world)

### "Target trial is constrained by emulability" requirement
- They explicitly state the target trial is **not an idealized trial**; it is the randomized trial that can be **reasonably emulated** with available observational data (often implying a pragmatic-trial flavor).
- Key operational implication: **specification and emulation are not independent**—if a criterion can't be mapped, you revise the specification (e.g., drop/modify eligibility criteria).

### Actionable "protocol template" from the Figure
The Figure's structure is a practical checklist your agent can implement:

**A) Causal estimand (specification) + mapping (emulation)**
- Eligibility criteria → mapping for each criterion
- Treatment strategies → mapping for each component
- Assignment → mapping for assignment proxy (e.g., prescription/dispensation)
- Outcomes → mapping for each outcome
- Start/end follow-up → same time-zero alignment concept
- Causal contrasts → observational analogues of the causal contrasts

**B) Identifying assumptions (specification) + mapping (emulation)**
- For ITT analogue: conditional exchangeability given **measured baseline confounders** (and list/map them)
- For loss to follow-up and competing events: list relevant factors and map
- For per-protocol: conditional exchangeability given **baseline + time-varying confounders** (list/map them)

**C) Estimator**
- Specify analysis approach + subgroup analyses + modeling assumptions
- In emulation: document modifications required + plan sensitivity analyses

---

## 6) Agent implications: rules/checks trialRunnerAgent should implement
Below are concrete, "automatable" rules derived from the paper's claims/structure.

### A. "Can we/should we emulate?" gating checks (fail fast)
1. **Intervention well-definedness check**
   - If the user's question targets an exposure that cannot be articulated as a sufficiently well-defined intervention/strategy (paper examples: "loneliness," debated example: "social media"), the agent should *not* proceed as if TTE will yield meaningful quantitative causal inference; instead, it should prompt to refine the intervention.
2. **Data-mappability check**
   - For each protocol component (eligibility, treatment strategy, assignment proxy, outcomes, follow-up), require a concrete mapping to available fields; if any component cannot be mapped, the agent must revise the target trial spec (or decline).

### B. Protocol completeness checks (the "target trial spec must include…" rule)
Implement a schema validator that refuses to run unless the target trial includes:
- eligibility criteria
- explicit treatment strategies (possibly dynamic/sustained)
- explicit time-zero assignment definition (and its proxy in data)
- outcome definitions
- follow-up start/end
- causal contrast(s): at minimum specify whether ITT analogue vs per-protocol (or both)
- estimator plan + assumptions + sensitivity analyses plan

### C. Time-zero alignment + immortal time/selection bias guards
Hard rules the agent should enforce:
- **Eligibility must be assessed at the same time as "assignment"** (time zero). If not, flag high risk of design bias.
- Disallow (or strongly warn on) group definitions like:
  - "never treated during follow-up" (selection bias risk)
  - "treated at any point during follow-up" without cloning/re-indexing or explicit time-zero handling (immortal time risk)

### D. Estimand/assumption coupling (ITT vs per-protocol)
- If user wants "effect of treatment received" (per-protocol-like), the agent must:
  - require a plan for handling **time-varying confounding** (not necessarily a specific method, but explicit acknowledgment + chosen approach)
  - list required baseline/time-varying confounders and check measurement availability

### E. "TTE doesn't solve data problems" transparency requirements
- Force an "assumptions & data limitations" section in the output report:
  - measured confounding assumptions (conditional exchangeability) and what variables operationalize them
  - measurement error / missingness / loss-to-follow-up risks
  - competing events handling, if relevant

### F. Transportability warning logic (external validity)
- The agent should automatically warn that estimates from a trial/emulation in one population/time may not transport to others without additional assumptions, and should surface likely effect modifiers / interference concerns when applicable.

---

## Paper 2: Target trial emulation: a framework for causal inference from observational data

**Citation**: Hernán MA, Wang W, Leaf DE (2022) - Target trial emulation: a framework for causal inference from observational data
**Journal**: JAMA
**DOI**: [10.1001/jama.2022.21383](https://doi.org/10.1001/jama.2022.21383)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal — what the 2022 JAMA paper is trying to achieve
- Re-ground causal inference as comparing outcomes under **different courses of action** (interventions/strategies).
- Explain why randomized trials have an advantage: randomization tends to make groups **comparable**, so outcome differences can be attributed to treatment rather than prognosis.
- Describe **target trial emulation (TTE)** as a way to design observational analyses to preserve key advantages of an RCT where possible.

---

## 2) TTE relevance — does it specify requirements/standards for valid trial design?
- It explicitly frames validity as hinging on whether the observational comparison can approximate the **comparability** achieved by random assignment.
- It positions TTE primarily as a **design framework** for observational studies that aims to preserve RCT-like properties (not merely a modeling trick).

---

## 3) Bias considerations — immortal time, confounding, selection bias, pitfalls
**In the accessible excerpt,** the only bias issue that is directly implied is **confounding** (prognostic differences) and how randomization addresses it.

**Operational bias guidance (from related Hernán/Robins open-access work, for agent rules):**
- A core "self-inflicted injury" in observational emulations is **misalignment of**:
  - eligibility,
  - treatment strategy assignment,
  - and start of follow-up ("time zero"),
  which can induce **immortal time bias** and/or selection/misclassification biases.
- A particularly common immortal time failure mode: using **post–time-zero treatment information** to assign baseline treatment groups (e.g., "received ≥3 refills"), which guarantees survival long enough to qualify for treatment classification.

---

## 4) Methodology — estimands, statistical methods, agreement metrics
### Estimands
- Target-trial work in this lineage explicitly distinguishes **intention-to-treat (ITT)** vs **per-protocol** effects as causal contrasts to define up front.

### Confounding control / causal estimation
- Common adjustment families consistent with the target-trial framework include propensity-score–based approaches and g-methods (e.g., matching/stratification/standardization/IP weighting/g-estimation), depending on the estimand and time-varying structure.

### "Agreement / benchmarking" style metrics (relevant to RCT-DUPLICATE-like validation)
From the RCT-DUPLICATE description of emulating trials in claims data:
- They compared RCT vs database-emulation results using agreement metrics including **correlation (Pearson r)** and **κ (kappa)**, plus "binary agreement metrics" (e.g., significance agreement / estimate agreement) in post hoc subgrouping where emulation quality was closer.
- They emphasize feasibility checks (measurability, confounder balance after PS matching, power) and protocol registration prior to outcome analysis.

---

## 5) Design requirements — what a "good TTE" needs (actionable checklist items)

### Minimum target-trial protocol fields (agent should require these)
A commonly cited protocol skeleton includes (at least) the following components:
- eligibility criteria
- treatment strategies (incl. start/end; sustained vs point)
- assignment procedure
- follow-up period (time zero to end)
- outcome
- causal contrast (ITT / per-protocol)
- analysis plan

### Time-zero alignment checks (agent must enforce)
- Ensure eligibility is met **at** time zero and treatment strategy assignment is defined **using only information available at/attributable to time zero** (or a formally specified grace period handled correctly).

### Grace periods / delayed initiation (agent must handle explicitly)
- If strategies allow initiation within a grace window, then early follow-up can be consistent with multiple strategies; one principled approach is **cloning + censoring** with adjustment (e.g., IP weighting) for informative censoring.

### Reporting/traceability checklist (useful for "regulatory-grade" outputs)
- The TARGET guideline (BMJ 2025) provides a 21-item reporting checklist and explicitly requires:
  - clearly specifying the **target trial protocol** (estimand, identifying assumptions, analysis plan) and
  - how each component was mapped to observational data,
  - plus reporting precision and sensitivity analyses.

---

## 6) Agent implications — concrete rules/checks your **trialRunnerAgent** should implement

### A. Protocol compiler (hard requirement)
Refuse to run unless the agent can materialize a target-trial protocol object with:
- `eligibility`, `strategies`, `assignment`, `time_zero`, `followup_end`, `outcome`, `estimand`, `analysis_plan`.

### B. Time-zero / immortal-time linting (hard requirement)
Static checks on the generated design:
- No covariate used for baseline eligibility/assignment may be measured after time zero.
- Treatment classification cannot depend on "future adherence/refills/events" unless implemented via a per-protocol design with explicit censoring/weights.
- Ensure outcomes are only counted **after** time zero (no left truncation unless explicitly modeled and justified).

### C. Feasibility gate (like RCT-DUPLICATE; hard requirement)
Before running estimation, run an automated feasibility report:
- Can the data express the key PICOT/protocol fields (esp. treatment/comparator/outcome definitions)?
- Is there sufficient sample size / expected events for the planned estimand?
- Can confounders be measured and balanced (e.g., standardized mean differences after PS method)?
- Pre-register (internally) the emulation spec and planned analyses before looking at outcomes.

### D. Estimation method selection (soft rule with logging)
- If time-varying treatment/adherence/censoring is present and per-protocol is requested, prefer methods that can address time-varying confounding/censoring (e.g., IPTW for treatment + censoring with MSM), and log identifying assumptions.

### E. Output must include "assumptions & limitations" (hard requirement)
Even when estimation runs, generate a structured limitations section:
- exchangeability/no unmeasured confounding (as applicable),
- positivity,
- well-defined interventions/strategies,
- measurement error, missingness, outcome ascertainment limitations.

---

## Paper 3: Specifying a target trial prevents immortal time bias and other self-inflicted injuries

**Citation**: Hernán MA et al. (2016) - Specifying a target trial prevents immortal time bias and other self-inflicted injuries
**Journal**: J Clin Epidemiol
**DOI**: [10.1016/j.jclinepi.2016.04.014](https://doi.org/10.1016/j.jclinepi.2016.04.014)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal: what is this paper trying to achieve?
- The paper argues that **many observational analyses are implicitly trying to emulate a "hypothetical pragmatic randomized trial" (the "target trial")**, and that avoidable biases often come from **violating basic randomized-trial design principles** rather than from "inevitable" confounding alone.
- Its central objective is to provide a **design-first framework** to prevent "self-inflicted injuries," especially **immortal time bias**, by enforcing **synchronization of (a) eligibility, (b) treatment assignment, and (c) time zero / start of follow-up**.

---

## 2) TTE relevance: what makes a valid trial design (requirements/standards)?
The paper's key "valid TTE" standard is:

> **Time zero (baseline) must be when eligibility is met and the treatment strategy is assigned.**

More concretely, a valid emulation requires:
- **Define the target trial explicitly** (they illustrate with an aspirin-initiation-after-surgery trial), including: eligibility criteria, time zero, treatment strategies, follow-up window, outcome, and estimand.
- In the observational emulation:
  - **Identify people at the moment they meet eligibility**, and
  - **Assign strategy at that same moment** based on treatment initiation at time zero (not on future exposure patterns).
- **Include all eligible individuals at time zero** and **count all outcomes after time zero** for the chosen effect measure.
- **Confounding control** is still needed to emulate randomization, but the paper's emphasis is that **even with "perfect" confounding adjustment, misalignment can still bias results**.

---

## 3) Bias considerations: immortal time, confounding, selection, other pitfalls
### Core failure mode: misalignment of {eligibility, assignment, time zero}
They describe **four common emulation failures** and the biases each induces:

1) **Time zero set after eligibility + after strategy assignment** (left truncation / prevalent user problems)
   - If follow-up is effectively "reset" after initiation/eligibility, you analyze only those who survived/continued until that reset, causing bias.

2) **Time zero set at eligibility but after strategy assignment**, plus post-treatment eligibility
   - Adding eligibility criteria at the reset time increases **selection bias**.

3) **Time zero set before eligibility and before treatment assignment** when eligibility is sequential
   - If treatment assignment precedes completion of eligibility, you can introduce selection bias; additionally, the period between assignment and completed eligibility can become **"immortal time"**.

4) **Classic immortal time bias: time zero at eligibility, but strategy assigned using post–time-zero exposure**
   - Example: defining "treated" as those who fill ≥3 prescriptions after baseline implies guaranteed survival long enough to fill them; this makes treated look artificially better even under null.
   - They generalize: bias occurs whenever **future treatment information** is used to define baseline strategies.

### Confounding vs "self-inflicted" biases
- They acknowledge the classic concern that observational data may have **insufficient confounder information** to approximate randomization.
- But their main point is: **avoid misalignment first**, because it creates extra bias *even if* confounding were perfectly addressed.

---

## 4) Methodology: statistical methods, estimands, agreement metrics
### Estimands emphasized
- **Intention-to-treat (ITT) analog**: in their example, a **5-year mortality risk ratio** comparing strategies assigned at time zero.
- **Per-protocol analog**: when adherence to sustained strategies is low, they recommend estimating a per-protocol effect by:
  - assigning at time zero, then
  - **censoring when data stop matching the assigned strategy** (deviate from protocol).

### Adjustment / estimation approaches mentioned
They explicitly list many acceptable confounding-adjustment options (for baseline confounding), including:
- matching, standardization, stratification/regression (with or without propensity scores),
- **inverse probability (IP) weighting**, and **g-estimation**.

For per-protocol with censoring (time-varying adherence):
- you must adjust for selection bias induced by censoring and for time-varying prognostic factors predicting treatment, i.e., **treatment–confounder feedback**; they cite **IP weighting** as an appropriate approach.

---

## 5) Design requirements: what does a "good TTE" need (checklists/protocols)?

### A. Hard requirement: "synchronization"
A good TTE must ensure:
- **Eligibility criteria are evaluated at the same moment as strategy assignment**
- **Follow-up starts at that same moment (time zero)**

### B. Strategy assignment must be baseline-only
- **Strategy definitions must be based exclusively on information available by time zero**, not on future exposure intensity/thresholds.

### C. Handle hard real-world issues with *valid* patterns
They give "justifications investigators use" and valid solution patterns:

1) **Multiple possible eligibility times ("time zero is hard to define")**
   Valid options:
   - pick one (first eligibility or random),
   - use **all eligible times** as nested trials (requires variance adjustment),
   - or sample some eligibility times.

2) **Nonadherence for sustained strategies**
   - Don't reclassify using future adherence.
   - Instead: **baseline assignment → censor deviations → adjust for selection bias with IP weighting**.

3) **Strategies not uniquely determined at baseline (dynamic regimes / thresholds)**
   - Valid approaches: **random assignment** to strategies or **cloning** (duplicate individuals across strategies), with variance adjustment.
   - To estimate per-protocol analog: **censor clones when they violate assigned strategy + IPW for censoring**.

4) **Too few initiators at baseline**
   - Reconsider the relevant target trial (e.g., discontinuation vs continuation among prevalent users).
   - Consider adding a **grace period** for initiation; but then baseline assignment becomes ambiguous and requires **cloning + censoring + adjustment**.

---

## 6) Agent implications: concrete rules/checks for an automated `trialRunnerAgent`

### A. Require an explicit Target Trial Specification object (TTS)
Your agent should not run unless it can fully instantiate:
- eligibility criteria (with timestamps),
- time zero definition,
- treatment strategies (baseline assignment rules),
- follow-up horizon (start/end),
- outcome definition and estimand (ITT vs per-protocol analog).

### B. Enforce synchronization invariants (core anti–immortal-time logic)
Implement strict validation that:
1. `time0 == eligibility_time == assignment_time`
2. strategy assignment uses **only data available at/just before time zero**—never summary measures over a post-baseline window
3. **no post-baseline eligibility criteria** unless implemented via a per-protocol design with censoring + proper adjustment

### C. Detect common "self-inflicted injury" patterns automatically
Add static checks on the exposure/strategy definition:
- If exposure definition references **future windows** (counts/means/minimum fills after baseline), label as **classical immortal time bias risk**.
- If cohort construction truncates early follow-up (e.g., "exclude first year"), label **left truncation / prevalent user bias risk**.

### D. Provide built-in solution templates (auto-redesign suggestions)
When the agent detects a problem, it should propose one of the valid patterns:
1) **Multiple eligibility times** → offer "first eligible," "random eligible," or "nested trial emulation"
2) **Per-protocol effect requested** → implement baseline assignment → censor deviations → IP weights for censoring
3) **Grace period initiation trial** → cloning + censor when incompatible + IPW
4) **Too few initiators** → recommend alternative target trial (discontinuation vs continuation)

---

## Paper 4: A structural description of biases that generate immortal time

**Citation**: Hernán MA et al. (2025) - A structural description of biases that generate immortal time
**Journal**: Epidemiology
**DOI**: [10.1097/EDE.0000000000001808](https://doi.org/10.1097/EDE.0000000000001808)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal: what the paper is trying to achieve
- Provide a **structural (causal/operational) description** of how "immortal time" gets *generated* in analyses, and argue that the label **"immortal time bias" is misleading** because the root causes are **selection** or **misclassification**, which *then* create immortal time and bias.
- Clarify two main mechanisms by which immortal time appears in survival analyses:
  1) **Selection based on post-assignment eligibility criteria** (conditioning on survival/event-free status after treatment assignment).
  2) **Misclassification of assignment to treatment strategies based on post-eligibility information** (classifying people using future treatment data, when strategies weren't distinguishable at time 0).

---

## 2) TTE relevance: does it inform what makes a valid target trial / TTE?
Yes—at a high level, it reinforces a core TTE standard:
- **Target trial emulation prevents immortal time** by explicitly specifying:
  - **Eligibility** criteria, and
  - **Assignment** to treatment strategies,
  - and **synchronizing eligibility + assignment at the start of follow-up (time zero)**.

**Implication for your rubric:** a "valid TTE" must make it *impossible* for arm membership to depend on information that occurs after time zero.

---

## 3) Bias considerations: what it says about immortal time bias, selection, confounding

### A. Immortal time from **post-assignment selection**
- Applying eligibility criteria **after treatment assignment** can create immortal time **when analysis starts follow-up at assignment**.
- Conditioning on **Y₃ = 0** (survive/event-free at 3 months), which is a **post-assignment eligibility criterion**, induces immortal time if follow-up is still counted from time 0.

### B. Immortal time from **post-eligibility exposure / strategy misclassification**
- Immortal time also arises when people are "assigned" to strategies using **treatment received after eligibility**, i.e., strategies were **not distinguishable at follow-up start**.
- Two ways to avoid immortal time:
  1) Reconfigure data to emulate assignment to strategies **distinguishable at time zero**, or
  2) Allocate person-time to **exposed/unexposed** categories (time-varying exposure style).

### C. Link to confounding (esp. by survival)
- Conditioning on survival/event-free status can open biasing paths (selection).
- Post-eligibility assignment **Z\*** constructed as a deterministic function of early treatments **A₀–₂** and early outcomes **Y₁–₂** forces survival to be eligible for a strategy.

---

## 4) Methodology: statistical methods / estimands / metrics recommended?
Two broad methodological "fix families" are implied:
1) **Redesign to strategies distinguishable at time zero** (i.e., define assignment so arm membership is known at time zero).
2) **Reallocate person-time / model exposure as time-varying** (so pre-exposure time is not miscounted as exposed).

---

## 5) Design requirements: what a "good TTE" needs per this paper
1) **Synchronize time zero**: eligibility determination, treatment assignment, and start of follow-up must be aligned.
2) **Eligibility must not depend on post-assignment information** (e.g., "must survive 3 months after assignment").
3) **Treatment strategies must be distinguishable at the start of follow-up**; do not classify strategies using future treatment behavior.
4) For longitudinal/dynamic regimes: avoid defining "assigned strategy" as a deterministic function of early post-baseline outcomes/treatments.

---

## 6) Agent implications: rules/checks trialRunnerAgent should implement

### A. "Immortal time audit" checks (static validation on the protocol)
1) **Time-zero alignment check**: Verify `follow_up_start == assignment_time == eligibility_time`.
2) **No post-assignment eligibility check**: Scan for conditions like "survive/event-free for X days after index."
3) **Strategy distinguishability check**: Determine whether arm membership is knowable at time zero.
4) **Constructed-assignment check (Z\*)**: Detect if "assignment" is being derived from post-baseline sequences.

### B. If a check fails: force the agent into an allowed redesign pattern
- **Redefine strategies to be distinguishable at time zero**, *or*
- **Switch to time-varying exposure / person-time allocation**.

### C. Reporting requirements
- A **timeline diagram**: eligibility window, assignment, follow-up start, exposure ascertainment windows.
- A one-paragraph **immortal-time risk statement**: which of the two generating mechanisms is possible.

---

## Paper 5: Target trial emulation: applying principles of randomised trials to observational studies

**Citation**: Matthews AA et al. (2022) - Target trial emulation: applying principles of randomised trials to observational studies
**Journal**: BMJ
**DOI**: [10.1136/bmj-2022-071108](https://doi.org/10.1136/bmj-2022-071108)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal (what the paper is trying to achieve)
- The paper explains **how to use observational data to emulate a "target" pragmatic randomized trial** when an actual RCT is infeasible.
- A central objective is to reduce **"self-inflicted" design biases** that come from incorrect observational study design choices (especially around defining time zero / start of follow-up).
- It positions the target-trial protocol as a **formal design framework** for causal questions in observational settings.

---

## 2) TTE relevance (valid design requirements / standards it specifies)
The paper is explicitly a "what makes a valid TTE" guide: it says the first step is to **specify the protocol of the hypothetical trial that you would have liked to run**.

It enumerates the required protocol components (Box 1) as:
- **Eligibility criteria**
- **Treatment strategies**
- **Assignment procedures**
- **Outcome(s)**
- **Follow-up**
- **Causal contrast of interest** (estimand; e.g., ITT vs per-protocol)
- **Statistical analysis plan**

It also states a key constraint: The target trial must be **pragmatic** because "observational data cannot be used to emulate a placebo controlled trial."

---

## 3) Bias considerations (immortal time, confounding, selection, other pitfalls)

### Immortal time bias / time-zero misalignment
- The paper gives a crisp rule: **start of follow-up should coincide with three conditions**:
  1) eligibility criteria are met
  2) treatment strategies are assigned
  3) outcomes begin to be counted
- It warns that deviations from this alignment create **immortal time bias**.

### Selection bias from prevalent users
- It explicitly flags observational analyses that include **prevalent users** as prone to **selection bias**, because treated participants must have survived and remained event-free up to the arbitrary follow-up start.

### Confounding by indication / lack of randomization
- It emphasizes that observational studies are prone to **confounding** due to lack of randomization, and that the emulation requires adjustment for baseline covariates.
- It states an **untestable assumption**: treatment is "randomly assigned within levels of the baseline covariates identified as potential confounders."

### Bias from adjusting for post-treatment variables
- In per-protocol emulation, using "traditional statistical methods" (instead of appropriate g-method approaches) can introduce bias by **falsely adjusting for consequences of treatment**.

---

## 4) Methodology (methods / estimands / metrics it recommends)

### Estimands (causal contrasts)
- **Intention-to-treat (ITT) effect** (effect of treatment assignment)
- **Per-protocol effect** (effect under full adherence to assigned strategy)

### Methods
- **ITT analogue in observational data**: can use "standard statistical methods" adjusting for baseline covariates.
- **Per-protocol in observational (and RCTs)**:
  - **censor participants when they deviate** from the assigned strategy
  - use **g-methods** to adjust for prognostic factors (measured before and after baseline) associated with adherence
- It also points to a concrete per-protocol implementation pattern: **"cloning, censoring, and weighting"**.

### Covariate selection approach
- It recommends choosing the "minimum set" of confounders using a **causal DAG (directed acyclic graph)**.

---

## 5) Design requirements (what a "good TTE" needs per this paper)
1) **Eligibility based only on baseline information** — never use post-baseline values to determine eligibility.
2) **Clearly specified treatment strategies** — Must define timing, duration/adherence window, and legitimate reasons for discontinuation/switching.
3) **Explicit assignment procedures for observational emulation** — Assign each person to the strategy **their observed data are compatible with**, and adjust for baseline covariates.
4) **Outcome definitions must be operationalized and validated** — E.g., ICD-10 code definitions plus "validity and reliability."
5) **Follow-up definition must enforce time-zero alignment**.
6) **Causal contrast must be specified (ITT vs per-protocol)** — This determines analysis choices.
7) **Statistical analysis plan includes sensitivity/subgroup analyses**.

---

## 6) Agent implications (actionable rules/checks for your automated trialRunnerAgent)

### A. Protocol completeness gate (hard fail if missing)
Your agent should not run a TTE unless it can instantiate all Box 1 fields:
- eligibility (baseline-only), strategies (detailed), assignment, outcomes, follow-up (with aligned time zero), causal contrast (ITT vs PP), analysis plan.

### B. Baseline-only eligibility validator (hard fail)
Rule: **eligibility criteria can only reference baseline variables**.

### C. Time-zero alignment validator (hard fail; prevents immortal time bias)
Rule: enforce the paper's 3-way coincidence at follow-up start: eligibility met, strategies assigned, and outcomes begin counting.

### D. Prevalent-user / "already on treatment" detector (warn/fail)
Rule: if treated arm includes patients who started treatment before follow-up start, flag **prevalent user selection bias** risk.

### E. Confounding control plan must be explicit (warn/fail)
Rule: assignment in observational emulation requires baseline confounder adjustment; recommend selecting a minimal adjustment set using a **DAG**.

### F. Estimand-driven analysis selection (core routing logic)
- If **ITT analogue**: allow "standard statistical methods" with baseline adjustment.
- If **per-protocol**: implement censoring at deviation + g-methods-style adjustment for time-varying factors.

### G. Post-treatment adjustment avoidance (warn/fail)
Rule: avoid "falsely adjusting for consequences of treatment."

### H. Outcome operationalization + measurement quality (warn/fail)
Rule: outcomes must be defined with code algorithms and with consideration of "validity and reliability."

---

## Paper 6: NICE Real-World Evidence Framework

**Citation**: NICE Development Team (2022) - NICE Real-World Evidence Framework
**Journal**: NICE Guidelines
**DOI/URL**: [https://www.nice.org.uk/corporate/ecd9/chapter/overview](https://www.nice.org.uk/corporate/ecd9/chapter/overview)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- **Primary purpose:** NICE's RWE Framework (published **23 June 2022**) is guidance to **improve the quality and transparency** of RWE that informs NICE guidance, by identifying **when** real-world data can reduce decision uncertainty and describing **best practices**.
- **Not a "minimum bar" document:** it explicitly says it **does not set minimum acceptable standards**; users should refer to NICE programme manuals for decision rules.
- It situates RWE for **contextualisation, estimation, and complementing trials**, including use of real-world data as **external controls** for single-arm trials.

---

## 2) TTE relevance
NICE is unusually direct that comparative-effect RWE studies should be designed as **Target Trial Emulations (TTEs)**:

- **"Target trial approach / trial emulation" is the recommended design paradigm** for non-randomised comparative studies.
- It formalises a **7-dimension target trial specification**: (1) eligibility criteria, (2) treatment strategies, (3) assignment procedure, (4) follow-up period, (5) outcomes, (6) causal effect of interest, (7) analysis plan.
- **Comparator expectations:** It states it is "very difficult" to emulate **placebo-controlled** trials in observational data. **Active comparators** are preferred.
- **New-user design preference:** new/incident users are "generally preferred" to prevalent users due to lower selection bias.

---

## 3) Bias considerations

**A. Time-zero / selection bias at study entry (includes immortal time bias)**
- Appendix 2 explicitly lists common **time-related biases** at entry: **prevalent-user bias, lead time bias, immortal time bias, depletion of susceptibles**.
- It describes preventing misspecification of time zero using **cloning–censoring–weighting**.

**B. Confounding (baseline + time-varying)**
- Confounders should be identified via a **systematic, transparent process**, with explicit causal assumptions ideally via **DAGs**, and it warns against **overadjustment**, colliders, and instruments.
- For **time-varying confounding**, NICE says typical regression/propensity methods are generally inappropriate; it prefers **G-methods**, including **marginal structural models with weighting**.

**C. Informative censoring / selection bias at exit**
- Informative censoring is called out as a common exit mechanism; methods similar to time-varying confounding are recommended (MSMs/weighting).

**D. Information bias (missingness, misclassification, measurement error)**
- It emphasises data limitations as a root cause of information bias and requires explicit assessment of **completeness and accuracy** for key variables.

**E. External validity bias**
- It recommends explicitly defining the **target population** and assessing differences using **absolute standardised mean differences**.

---

## 4) Methodology

**Estimands / causal effects**
- It explicitly uses the **estimand framework** (ICH E9(R1)) and requires the analysis plan to specify how the causal effect is estimated given **intercurrent events**.
- It distinguishes (trial) **ITT vs per-protocol**, and for observational data recommends focusing on **as-started** and also reporting **on-treatment** when discontinuation/switching is substantial.

**Core adjustment methods**
- **Propensity score methods** (matching/stratification/weighting) and regression adjustment.
- **Balance metric:** absolute standardised differences; "<0.1" is described as generally indicating good balance.
- **Time-varying confounding / informative censoring:** **marginal structural models with weighting** (g-methods).
- **Instrumental variables / quasi-experimental designs** as an option when unobserved confounding is expected.

**Robustness / agreement-style checks**
- It strongly encourages **sensitivity analysis** and supports **quantitative bias analysis** (including the **E-value**).
- It promotes **triangulation** (replication across designs/analyses).
- It points to **RCT-DUPLICATE (Franklin et al. 2020)** as evidence that high-quality non-randomised studies can match RCT relative effects "in many, but not all, situations."

---

## 5) Design requirements

**A. Target-trial specification requirements**
- Must explicitly define the 7 target-trial dimensions.
- Eligibility criteria should reflect pragmatic care pathways and be based on variables recorded **before** treatment assignment.

**B. Data suitability requirements (DataSAT)**
- NICE provides a structured **Data Suitability Assessment Tool (DataSAT)** that explicitly requires data provenance details and variable-by-variable **data quality** reporting.

**C. Bias reporting checklist/template**
- Appendix 2 provides a **methods reporting template** to document how each bias class was addressed: selection bias at entry, selection bias at exit, confounding, detection bias, measurement error, missing data, reverse causation.

**D. Reporting / reproducibility requirements**
- "Clear operational definitions" for all study variables, time windows, grace periods, follow-up definitions including latency/exposure-effect windows.
- Emphasises protocol + analysis plan pre-specification and transparency.

---

## 6) Agent implications

**A. Enforce a structured Target Trial spec object**: Require the agent to output a machine-checkable spec with the 7 dimensions.

**B. Automatic "time-related bias" detectors**: Detect **prevalent-user inclusion**; if modeling dynamic strategies, consider **cloning–censoring–weighting** patterns.

**C. Confounding control selection logic**: Require systematic confounder identification + DAG artifact; default method ladder based on time-varying complexity.

**D. DataSAT-driven feasibility gate**: Build a DataSAT-like summary with go/no-go heuristics on key variable availability and data quality.

**E. Required robustness package**: Auto-generate sensitivity analyses (vary exposure definitions, alternative eligibility criteria, missing data methods, negative controls, E-values).

**F. Reporting automation**: Enforce publication-ready reporting fields; generate an Appendix-2-style **bias mitigation table**.

---

## Paper 7: EMA Reflection Paper on Use of Real-World Data in Non-Interventional Studies

**Citation**: CHMP/MWP (2025) - Reflection Paper on Use of Real-World Data in Non-Interventional Studies to Generate Real-World Evidence for Regulatory Purposes
**Journal**: European Medicines Agency
**DOI/URL**: [https://www.ema.europa.eu/en/reflection-paper-use-real-world-data-non-interventional-studies-generate-real-world-evidence-scientific-guideline](https://www.ema.europa.eu/en/reflection-paper-use-real-world-data-non-interventional-studies-generate-real-world-evidence-scientific-guideline)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
**Primary aim:** provide **methodological expectations** for designing, conducting, and analysing **non-interventional studies (NIS) using real-world data (RWD)** to generate **real-world evidence (RWE)** for **EU regulatory purposes**, while being explicit about **limitations** and how to **mitigate** them.

It positions NIS/RWD as typically **complementary** to RCTs (filling evidence gaps, reducing uncertainties).

---

## 2) TTE relevance
This paper explicitly endorses **Target Trial Emulation (TTE)** as a design strategy:
- It says the **TTE framework "should be considered"** to formalise design/analysis for causal NIS using RWD.
- It summarises the **two-step TTE logic**: (1) specify the hypothetical target trial; (2) design an NIS that emulates it.
- TTE's explicit alignment of **study entry** with **treatment start** can reduce **prevalent user bias** and **immortal time bias**.

**Requirements/standards that map to "valid TTE design":**
- Use the **ICH E9(R1) estimand framework** when designing the hypothetical target trial.
- Expect protocol completeness checks via **ENCePP standards**.

---

## 3) Bias considerations

### Selection bias
- Often **difficult/impossible to address at analysis**, so design choices matter.
- It explicitly calls out **prevalent user bias / depletion of susceptibles**: recommend considering **incident (new) user designs**.

### Information bias (misclassification, measurement error)
- It warns against the common "non-differential misclassification is conservative" argument at design stage.

### Time-related bias (explicit immortal time bias guidance)
- Recommendations include:
  - **Align** eligibility timepoint, treatment initiation, and follow-up start for all individuals.
  - Define exposure/outcome status changes and plan extraction of important dates.
  - Consider the TTE framework to prevent incorrect person-time assignment.

### Confounding
- Confounders should be addressed at **design stage**, including explicitly identifying **potentially important unmeasured confounders**.
- Prefer **active comparator + new-user** designs.
- Consider **negative/positive control exposures/outcomes** to detect residual confounding.

---

## 4) Methodology

### Estimands / intercurrent events
- Use **ICH E9(R1) estimand framework**.

### SAP timing / model assumptions / diagnostics
- Analyses should follow a **pre-defined SAP** developed **before** creating the analysis dataset.

### Sensitivity analyses
- Must be **pre-specified**; **primary + sensitivity analyses should address the same research question**.

---

## 5) Design requirements

### A. Up-front "feasibility assessment"
- RWD source characterisation with **reliability + relevance** assessment.
- Incidence of exposure and outcomes; available follow-up duration.

### B. Protocol completeness + transparency expectations
- Use ENCePP methodological standards; include graphical study design representation.
- Transparency actions: register studies, publish code.

### C. Core causal design choices
- Prefer **active comparator + new-user** where possible.
- Explicitly align time zero.
- Use TTE's explicit specification to reduce prevalent user/immortal time bias.

### D. Data quality requirements
- Document reliability and relevance; disclose unresolved uncertainties.
- If AI is used in RWD processing, document performance evaluation.

---

## 6) Agent implications

### Hard gating checks
1. **No credible comparator** available → do not proceed as causal TTE.
2. Cannot **align eligibility / treatment initiation / follow-up start** → high risk of time-related bias; block or force redesign.
3. Data cannot support valid classification → block or downgrade to descriptive objective only.

### Mandatory design-generation steps
1. **Feasibility assessment report** (pre-protocol).
2. **Graphical longitudinal design diagram**.
3. **Protocol + SAP** with pre-specification before dataset creation.

### Built-in bias-control heuristics
- Default to **active comparator + new-user** design.
- Enforce explicit **risk windows** and minimum follow-up checks.
- Offer **negative/positive control** analyses as residual confounding diagnostics.

---

## Paper 8: The implementation of target trial emulation for causal inference: a scoping review

**Citation**: Zuo H, Yu L, Campbell SM, Yamamoto SS, Yuan Y (2023) - The implementation of target trial emulation for causal inference: a scoping review
**Journal**: J Clin Epidemiol
**DOI/URL**: [10.1016/j.jclinepi.2023.08.003](https://doi.org/10.1016/j.jclinepi.2023.08.003)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- Investigate **how Target Trial Emulation (TTE) is being implemented in practice**—including **research topics**, **frequently used strategies**, and **issues/limitations indicating the need for improvement**.
- **Scoping review** using **JBI guidance** and **PRISMA-ScR**, with **96 papers included**.
- One core "meta" finding: there is **uneven adherence** to a structured TTE framework and a need for a **reporting standard**.

---

## 2) TTE relevance

### Three "critical components" (quality gate)
The paper explicitly elevates **three components** as *critical* for "guaranteeing the quality" of causal evidence from TTE:
1. **Time-zero**
2. **Random assignment emulation (simulation)**
3. **Comparison/contrast strategy**

…and notes that **not all papers specified all three**.

### Target trial protocol "must specify" key trial elements
- eligibility criteria, treatment strategies, assignment procedures, follow-up period, outcome, causal contrasts of interest, and an analysis plan.

---

## 3) Bias considerations

### Immortal time bias
- TTE requires a **proper definition of time-zero (baseline)**; *incorrect time-zero handling* leads to **immortal time bias**.
- Because eligibility can be met **once or multiple times**, investigators must choose time-zero to define a **fixed study population**.

### Selection bias
- **Postbaseline events should be independent of eligibility criteria to avoid selection bias**.

### Confounding / residual confounding
- **Unavailability of variables → residual confounding** is the **most frequently mentioned limitation** in the reviewed TTE papers.
- **Insufficient confounding adjustment** yields incorrect causal estimates.

### "Design failures" vs "analysis failures"
- **Flawed emulation of basic protocol components** may be *more likely* to cause incorrect inference than flaws in the statistical adjustment itself.

---

## 4) Methodology
- TTE estimates the **marginal treatment effect** using observational data.
- It lists **inverse probability weighting** and **propensity score (PS) matching** as methods to emulate random treatment assignment.

---

## 5) Design requirements

### Minimum protocol specification
- Eligibility criteria, treatment strategies, assignment procedures, follow-up period, outcomes, causal contrasts (estimands), analysis plan.

### Mandatory alignment checks (time-zero integrity)
- Ensure **time-zero** is clearly defined.
- Baseline eligibility should not be defined using postbaseline information.

### Mandatory "three critical components" presence
- **Time-zero + randomization emulation + comparison strategy** must be present.

---

## 6) Agent implications

### A. Enforce a "TTE spec completeness" schema (hard fail if missing)
Require:
1. **Time-zero definition**
2. **Random assignment emulation plan** (e.g., PS matching, IPW)
3. **Comparison/contrast strategy**
4. Full protocol fields

### B. Time-zero/immortal-time bias guardrails (hard fail on misalignment)
- Treatment assignment must not depend on information after time-zero.
- If eligibility can recur, require explicit policy.

### C. Selection bias guardrail: "no postbaseline conditioning"
- Detect when inclusion/exclusion criteria reference post-index events and block/flag.

### D. Residual confounding risk scoring
- Require a **confounder availability audit**.
- If critical confounders are unmeasured, auto-generate a **"TTE not reliable"** warning.

### E. Prioritize "design correctness" before "fancy estimation"
- Run "design linting" *before* estimation.

---

## Paper 9: Time-related biases in pharmacoepidemiology

**Citation**: Suissa S, Dell'Aniello S (2020) - Time-related biases in pharmacoepidemiology
**Journal**: Pharmacoepidemiol Drug Saf
**DOI/URL**: [10.1002/pds.5083](https://doi.org/10.1002/pds.5083)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- **Describe multiple "time-related biases"** that can occur in observational database studies—especially **drug repurposing**—and **illustrate how these biases can produce "remarkable" but spurious effectiveness findings**.
- Uses a **large COPD cohort** from Quebec healthcare databases to **demonstrate bias impact**.

---

## 2) TTE relevance
- **Valid causal emulation is inseparable from correct time alignment**.
- **Time zero must be correctly defined and consistently applied**.
- **Exposure classification must not "look into the future."**
- For outcomes with **biologic latency** (e.g., cancer), a TTE must encode an explicit **latency/induction period assumption**.

---

## 3) Bias considerations

### Protopathic bias (reverse causation around treatment initiation)
- **Lung cancer incidence 23.9/1000 in the first year vs ~12.0/1000 in subsequent years** — early follow-up can be dominated by **pre-existing but undiagnosed disease**.

### Immortal time bias
- When "immortal time" was misclassified, ICS appeared strongly protective for lung cancer (**HR 0.32**), but after correcting immortal time bias the HR moved to **0.50**.

### Latency time bias
- After *also* correcting for "latency time bias," the HR further moved to **0.96 (≈ null)**.
- **TTE takeaway:** for outcomes with latency, you must also encode a defensible latency/induction window.

### Other biases mentioned
- **Time-window bias, depletion of susceptibles, immeasurable time bias** also affected findings similarly.

---

## 4) Methodology
- Effect estimates are reported as **hazard ratios (HRs) with 95% CIs**.
- Uses **proportional hazards models**.

---

## 5) Design requirements
1. **Explicitly enumerate time-related bias risks**.
2. **Demonstrate sensitivity of estimates to correcting time-related misclassification**.
3. **Avoid "unrealistic effectiveness" signals without heavy scrutiny**.

---

## 6) Agent implications

### A. Time-zero & immortal-time guardrails
- Enforce `t0 = eligibility satisfied AND treatment strategy becomes possible`.
- Prohibit eligibility criteria like "received drug X at any time during follow-up" unless properly handled.

### B. Latency / induction period enforcement
- If outcome has plausible latency (e.g., cancer), require a pre-specified **induction/latency window** and report sensitivity across multiple values.

### C. Protopathic bias checks
- Automatically compute outcome incidence in early follow-up bins; if the earliest bin is a spike, require alternative definitions or lagged exposure.

### D. Time-window bias checks
- Enforce identical exposure lookback windows for cases and controls.

### E. Immeasurable time bias checks
- Identify periods where exposure is not observable (e.g., inpatient stays); implement censoring or bridging assumptions.

### F. Depletion of susceptibles
- Prefer incident-user design; if prevalent users are allowed, require explicit left truncation handling.

### G. "Too-good-to-be-true" effect-size heuristics
- If estimated HR is extremely protective (e.g., <0.5) for cancer incidence, trigger a "time-related bias audit."

---

## Paper 10: The well-built clinical question: a key to evidence-based decisions

**Citation**: Richardson WS, Wilson MC, Nishikawa J, Hayward RSA (1995) - The well-built clinical question: a key to evidence-based decisions
**Journal**: ACP J Club
**DOI/URL**: [10.7326/ACPJC-1995-123-3-A12](https://doi.org/10.7326/ACPJC-1995-123-3-A12)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- Improve the **first step of evidence-based medicine (EBM)** by teaching clinicians how to **turn clinical uncertainty into a focused, searchable, answerable question**.
- EBM use is "efficient and effective" only if clinicians start with "asking well-built clinical questions."
- A well-built question is (a) directly relevant, and (b) phrased to facilitate searching for a precise answer.

---

## 2) TTE relevance
This is **not** a trial design / causal inference methods paper. It provides a **question-specification standard** (PICO) that is highly aligned with *inputs your trialRunnerAgent must require*.

**PICO "anatomy" (directly useful as TTE inputs):**
- **P**atient/problem, **I**ntervention/exposure, **C**omparison (when relevant), **O**utcomes.

**Question-type labeling ("location")—important for deciding whether a TTE is appropriate:**
- The paper explicitly tags examples as **therapy**, **diagnosis**, and **prognosis** questions.

---

## 3) Bias considerations
The paper **does not discuss** immortal time bias, confounding, selection bias, or other observational pitfalls.

What it *does* do (indirectly bias-relevant):
- Pushes for **explicit articulation** of population, exposure, comparator, and outcomes, which reduces ambiguity that often leads to vague exposure definitions and poorly anchored cohorts.

---

## 4) Methodology
No statistical estimands or causal estimators are recommended.

The closest thing to "methodology constraints" is in the **diagnosis** example:
- The diagnosis question is framed **against a reference standard** and conditioned on **pretest probability**.
- This implies diagnostic questions should be treated as test-accuracy questions, typically **not** a TTE/causal effect problem.

---

## 5) Design requirements

### A. PICO completeness (minimum required specification)
- The question must be well articulated in terms of P/I/C/O.

### B. "Question location" / category (drives downstream design)
- Use the 6-aspect "map" (clinical evidence, diagnosis, prognosis, therapy, prevention, education) to classify the question.

### C. Prioritization when multiple questions exist
- "What is the most important issue for this patient now?"
- "Which question, when answered, will help me most?"

---

## 6) Agent implications

### A. Enforce **PICO as a hard gate** before any TTE planning
- **P**: computable cohort definition
- **I**: treatment strategy/exposure definition
- **C**: comparator strategy (even if user omitted it, propose plausible defaults)
- **O**: measurable endpoints

### B. Classify the question "location" to decide if a TTE is appropriate
- **Therapy / Prevention / Harm-like exposure questions** → eligible for TTE planning
- **Diagnosis (test accuracy)** → usually *not* a TTE; route to diagnostic-evaluation workflows
- **Prognosis** → may be a TTE *only if* reframed as effects of alternative management

### C. Add a "diagnosis-question detector"
- If the question resembles diagnosis framing, require explicit **index test**, **reference standard/outcome adjudication**, and target population risk strata.

### D. Prioritize and decompose multi-part user requests
- Implement the paper's prioritization prompts as an interactive step.

### E. "Question behind the question" normalization
- Automatically propose a rewritten canonical PICO question and ask the user to confirm before running any emulation.

---

## Paper 11: Per-protocol analyses of pragmatic trials

**Citation**: Hernán MA, Robins JM (2017) - Per-protocol analyses of pragmatic trials
**Journal**: N Engl J Med
**DOI/URL**: [10.1056/NEJMsm1605385](https://doi.org/10.1056/NEJMsm1605385)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- **Make pragmatic trial results more decision-relevant** by going beyond default ITT analyses when **nonadherence and loss to follow-up** are substantial, because these post-randomization events can drive **post-randomization confounding** and **selection bias**.
- Center the analysis around a **precisely defined causal estimand**, especially clarifying **intention-to-treat vs per-protocol effects**.

---

## 2) TTE relevance
Even though this is "about pragmatic RCTs," the per-protocol problem is structurally the same as in TTEs:
- **Trials compare *strategies*, not pills/procedures**; per-protocol effects are defined relative to *the strategy written in the protocol*.
- **Per-protocol estimation requires design-time commitments**: unambiguous strategy specification, collecting the right post-baseline variables, and using appropriate adjustment methods.
- Pragmatic trials are "especially vulnerable" to biases typically associated with observational studies.

---

## 3) Bias considerations

### A. Post-randomization confounding (adherence is not random)
- Valid per-protocol estimation "generally requires adjustment for prognostic factors that predict adherence," and when those factors are time-varying and affected by past adherence, you need **g-methods**.

### B. Selection bias from loss to follow-up
- Loss to follow-up can induce selection bias; eliminating it requires adjusting for predictors of dropout that are also prognostic.

### C. Immortal time bias
- If you define adherence using future information ("adhered for 90 days") and start follow-up after that window, you create an immortal period by construction.
- The correct pattern: **time zero at eligibility/assignment**, then treat **protocol deviations as censoring events** and correct via weighting/g-methods.

---

## 4) Methodology

### Estimands
- **ITT effect:** effect of assignment, regardless of later adherence.
- **Per-protocol effect:** effect of receiving the assigned strategy throughout follow-up as specified.

### Core estimation methods recommended (for per-protocol)
- **Inverse probability weighting (IPW)** and **parametric g-formula** to estimate **absolute risks** and **risk differences**.
- **G-estimation of structural nested models** is discussed as an option.
- G-methods are biased if important baseline/post-baseline confounders are unavailable.

### Instrumental variable angle
- When IV conditions + monotonicity hold, randomization can be used as an instrument to estimate an effect in "compliers."

---

## 5) Design requirements
Unbiased per-protocol estimation "generally requires 3 elements":
1) **Unambiguous specification of treatment strategies** (including what counts as deviation).
2) **Adequate data collection** to measure adherence and relevant post-randomization factors.
3) **Appropriate adjustment** for adherence-predicting prognostics; if treatment–confounder feedback exists, use **g-methods**.

Also:
- Prefer/enable estimation on an **absolute scale** (risks/risk differences).
- Plan for **adaptive features** in the SAP around weight modeling and sensitivity analyses.

---

## 6) Agent implications

### A. Target trial spec completeness checks (hard fail)
- Enforce a structured spec: `eligibility`, `time_zero`, `strategies`, `grace_periods`, `deviation_rules`, `outcomes`, `estimand (ITT vs PP)`, `follow_up`, `causal contrast scale`.

### B. Immortal-time / time-zero alignment checks (hard fail)
- Detect any exposure/adherence definition that uses future info while starting follow-up at baseline.
- Require adherence qualification windows be implemented via cloning/censoring/weighting or censor-on-deviation + g-methods.

### C. Confounding & selection bias readiness checks
- For per-protocol TTEs, require declared sets of baseline and time-varying predictors of adherence and outcome.
- If key adherence determinants are unmeasured, consider IV-style estimands or default to ITT-like estimand.

### D. Method selection rules
- If **time-varying confounders with feedback** are present: prefer **IPW MSM** or **parametric g-formula**.
- If goal requires **absolute risks/risk differences**: prioritize g-formula/IPW.

### E. Weighting diagnostics (must implement)
- Positivity checks, weight truncation policies, summaries of stabilized weight distribution, sensitivity analyses.

---

## Paper 12: When to start treatment? A systematic approach to the comparison of dynamic regimes using observational data

**Citation**: Cain LE, Robins JM, Lanoy E, Logan R, Costagliola D, Hernán MA (2010) - When to start treatment? A systematic approach to the comparison of dynamic regimes using observational data
**Journal**: Int J Biostat
**DOI/URL**: [10.2202/1557-4679.1212](https://doi.org/10.2202/1557-4679.1212)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- Give a **systematic method to use observational longitudinal data to emulate a (hypothetical) randomized trial comparing many dynamic treatment initiation regimes** of the form "initiate treatment within *m* months after a time-varying covariate first crosses threshold *x*."
- Concrete use case: identify the "optimal" CD4 threshold for starting ART in HIV by comparing **regime-specific AIDS-free survival**.

---

## 2) TTE relevance
This paper is essentially a **target trial emulation for dynamic regimes**:

**Trial emulation blueprint:**
1) Specify and apply **eligibility criteria** consistent with the hypothetical trial.
2) Define **time zero** as when eligibility is first met.
3) Define **treatment strategies (dynamic regimes)** precisely.
4) Define **end of follow-up / censoring rules**.
5) Define the **causal contrast** as regime-specific survival and select the regime that maximizes it.

**Identifiability "standards" required**: **exchangeability (no unmeasured confounding), positivity, and consistency**.

**Consistency requires well-defined interventions**: regimes like "initiate within m months" can be **vague / ill-defined** unless you specify the "version."

---

## 3) Bias considerations

### A. "Immortal time" / lead-time / guarantee-time issues
- The approach **eliminates "lead time bias" by design**.
- **Align time zero and eligibility identically across regimes**, and emulate assignment at baseline.

### B. Selection bias induced by artificial censoring
- When emulating dynamic regimes, you often **artificially censor** a person/regime-replicate at the time their observed behavior deviates from that regime.
- That artificial censoring is **informative**; correct it with **time-varying inverse probability weights**.

### C. Time-varying confounding
- Their weighting model conditions on baseline covariates and **time-varying CD4 and HIV-RNA**.
- **No unmeasured confounding given measured covariate history** is the untestable assumption.

### D. Positivity and weight pathologies
- They anticipate **near-positivity violations** and handle them via **weight truncation** (e.g., truncating at 10).

### E. "You need weights even if treatment is randomized over time"
- In dynamic-regime emulations, weighting is not "only for confounding"—it's also required to correct selection induced by regime-consistency censoring mechanics.

---

## 4) Methodology

### Core estimand(s)
- **Regime-specific survival curve** and in particular **5-year AIDS-free survival** under each regime.

### Estimation approach (the "clone–censor–weight" pattern)
- **Cloning/replication across regimes**: create **one replicate per individual per regime followed**, then censor each replicate upon deviation.
- **IP weighting** to correct selection bias from artificial censoring and adjust for time-varying confounding.
- **Outcome model for stability**: fit an **inverse-probability-weighted pooled logistic model** with a **smooth function of regime parameter** and **time interactions**.

### Stabilized weights (dynamic-specific warning)
- Common stabilization methods for **static** regimes are **not valid for dynamic regimes**; the numerator can depend on \(X, V\) but **cannot depend on \(\bar A_{t-1}\) or \(\bar L_t\)**.

### Grace period regimes and stochastic interventions
- For \(m>0\), "initiate within m months" may be vague unless you specify initiation probabilities within the window; they show how to define **stochastic regimes**.

---

## 5) Design requirements

### A. Regime definition must be operational and unique
- Define **threshold-crossing time** and how you handle measurement gaps and measurement timing.
- For grace periods, avoid vague regimes; define a **stochastic policy** if needed.

### B. Time zero and eligibility alignment
- Time zero must be the first time eligibility holds; follow-up and censoring rules must be specified at baseline.

### C. Multi-regime membership handling
- Must handle "multiple regimes per person" by random allocation or replicate/clone approach.

### D. Artificial censoring requires IP weighting
- After censoring deviators, apply **time-varying IP weights**.

### E. Positivity/instability controls
- Diagnostics + mitigation: stabilized weights, truncation, sensitivity to truncation thresholds.

---

## 6) Agent implications

### 1) Regime-specification validator
- **Reject or flag regimes that are not uniquely operationalized**.
- If user asks "start within 3 months after lab threshold," clarify: "start immediately when possible," "uniform random start within window," or "observed-start-time distribution"?

### 2) Default to clone–censor–weight for dynamic initiation policies
- Create replicates for each eligible regime per person.
- Artificial censor at deviation time.
- Apply IP weights.

### 3) Automated "immortal time / lead-time" safeguard
- Enforce: **single baseline time zero** for all regimes; no delayed cohort entry defined by future information.

### 4) Weight-model builder and diagnostics
- Fit treatment initiation model (pooled logistic).
- Compute stabilized weights using **dynamic-valid numerator restrictions**.
- Auto-check extreme weights / truncation impact / near-positivity violations.

### 5) Regime-comparison model: smooth borrowing across regimes
- Prefer a **dynamic marginal structural model** that borrows strength across regimes via smooth function of regime parameter(s).

### 6) Estimand selection logic (ITT-like vs per-protocol-like)
- For initiation strategies, consider a default **initiation-policy ITT-like estimand** and explicitly label it in the report.

---

## Paper 13: Observational data for comparative effectiveness research: an emulation of randomised trials of statins

**Citation**: Danaei G, Rodríguez LAG, Cantero OF, Logan R, Hernán MA (2013) - Observational data for comparative effectiveness research: an emulation of randomised trials of statins and primary prevention of coronary heart disease
**Journal**: Stat Methods Med Res
**DOI/URL**: [10.1177/0962280211403603](https://doi.org/10.1177/0962280211403603)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- Show how to use observational EHR data to **emulate a (hypothetical) randomized trial** by comparing **treatment initiators vs non-initiators**, and to estimate observational analogues of **ITT**, **per-protocol**, and **as-treated** effects.
- Provide implementable guidance/software ("flexible and annotated SAS program").
- They intentionally chose a "hard case" (statins where **confounding by indication is known to be large**) to test whether careful emulation can recover a protective effect consistent with RCT evidence.

---

## 2) TTE relevance

### Explicit "trial protocol first, then emulate" pattern
They first specify a **hypothetical RCT protocol** (eligibility, washout, assignment, follow-up) and then map it into observational EHR operations.

### Key design standards
- **New-user / initiator design + washout:** require no statin use in a defined prior period (≥2 years) before "baseline."
- **Clear time zero aligned to treatment decision:** each monthly "trial" has a one-month enrollment; treatment is defined as **initiating during that month vs not initiating**.
- **Sequential trial emulation ("many little trials"):** they emulated **83 monthly trials** and pooled them.
- **Outcome definition and validation matter for credibility:** CHD defined as MI diagnosis or CHD death; they validated cases.
- **EHR data hygiene rules:** impose plausible ranges; treat out-of-range as missing; carry forward measurements for bounded windows.
- **Design choice affects estimand meaning:** the estimated effect may include behavioral/monitoring changes; framed as akin to an **open-label pragmatic trial** effect.

---

## 3) Bias considerations

### Confounding by indication (central threat)
- Large baseline prognostic differences between initiators and non-initiators.
- Unadjusted ITT HR 1.37 → fully adjusted 0.89, implying confounding was huge.

### Selection bias from "survivor" subsets
- They strongly caution against "current vs never user" and "long-term current/persistent user vs never" contrasts because they can introduce selection bias by selecting people who **survived event-free** long enough.

### Selection bias induced by artificial censoring in per-protocol analyses
- In PP emulation, they **censor** people when they deviate; that censoring can be informative, so they adjust for **time-varying selection bias**.

### Time-varying confounding (as-treated analyses)
- Residual confounding may remain; **time-varying confounding adjustment may be required**, motivating IP weighting / MSMs.

### "Exclude early follow-up" is not a free fix
- Changes can arise from time-varying hazards and **selection bias** when early effects exist.

---

## 4) Methodology

### Estimands / causal contrasts
- **ITT analogue:** initiation vs no initiation at baseline.
- **Per-protocol (continuous treatment vs no treatment):** emulate by censoring at deviation, then adjust.
- **As-treated (dose-response):** model hazard as a function of treatment history.

### Core estimation techniques
- **Cox proportional hazards model** with **robust variance estimator** for repeated participation.
- **Propensity score methods:** logistic regression PS; stratification (20 quantiles).
- **IPW / MSMs:** stabilized weights, **weight truncation** (max 10).

---

## 5) Design requirements

1) **Write down the hypothetical trial** you want to emulate.
2) **Align time zero** to the treatment decision and use a **new-user/initiator** comparison.
3) **Use sequential trials** if needed and pool person-trials appropriately.
4) **Measure/define exposure and adherence** explicitly.
5) **Pre-specify confounders using subject-matter knowledge**.
6) **Handle time-varying confounding and informative censoring** with IPW/MSMs for PP/as-treated estimands.
7) **Assess positivity** (overlap of PS distributions).
8) **Avoid "current vs never" and "persistent user" designs** as default.
9) **Be cautious with "exclude early follow-up"** sensitivity analyses.

---

## 6) Agent implications

### A. Protocol construction + feasibility checks
- **Force an explicit "target trial protocol object"** before any code runs.
- **Default to an initiator (new-user) emulation** when evaluating drug effectiveness vs no drug.

### B. Anti-bias guardrails
- **Block or warn** if the user's requested design is "current vs never" or "persistent user vs never."
- **If per-protocol is requested**, require an explicit deviation rule and an informative-censoring adjustment plan.
- **If excluding early follow-up is proposed**, label it "ad hoc sensitivity" and explain the selection-bias risk.

### C. Required methods
- **ITT analogue:** Cox with baseline treatment + confounders; robust SE.
- **PP / as-treated:** IPW/MSM pipeline with stabilized and truncated weights.

### D. Data quality + measurement recency
- Implement "measurement plausibility + recency" utilities: plausible ranges, bounded LOCF windows.

### E. Positivity diagnostics and automatic fallback
- **Always compute PS overlap diagnostics**.
- If overlap is poor, **auto-suggest** trimming / restriction / matching.

### F. Reporting rules
- Report **person-trial construction** details.
- Report **estimand mapping** clearly.
- Include a "sanity check" section contrasting with a naive design.

---

## Paper 14: Negative controls: a tool for detecting confounding and bias in observational studies

**Citation**: Lipsitch M, Tchetgen Tchetgen E, Cohen T (2010) - Negative controls: a tool for detecting confounding and bias in observational studies
**Journal**: Epidemiology
**DOI/URL**: [10.1097/EDE.0b013e3181d61eeb](https://doi.org/10.1097/EDE.0b013e3181d61eeb)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- Observational studies routinely need an additional *diagnostic* for "spurious causal inference," analogous to how wet-lab experiments use *negative controls*.
- It proposes bringing this into epidemiology to help detect (a) **confounding**, and also (b) **mismeasurement/recall bias** and (c) **selection bias**, by deliberately testing relationships where the true causal effect should be null.

---

## 2) TTE relevance
This paper is not a TTE checklist; it's a **validity stress-test** concept for observational causal inference:
- Negative controls check whether your study design/analysis is still producing associations **even when the hypothesized causal mechanism is impossible**.
- It's complementary to standard design/analysis tools (restriction, matching, IPW, g-estimation).

**TTE translation:** even if your emulated trial has correct eligibility, time zero, treatment strategies, and estimand, you still need falsification/diagnostic endpoints/exposures to detect residual bias.

---

## 3) Bias considerations

### A. Taxonomy of non-causal associations
- **Mismeasurement**, **confounding**, and **biased selection into the analysis**.

### B. Confounding (including unmeasured confounding)
- Uses causal diagrams with measured confounders **L** and unmeasured confounders **U**.

### C. Recall / reverse-causation-type bias
- "Probe variables" (irrelevant exposures) added to questionnaires; if these show associations similar to the exposure of interest, that suggests recall bias.

### D. Immortal time bias (explicitly discussed)
- **Immortal time bias** is called out as "a form of selection bias" where exposed persons are credited with time during which the event cannot occur.
- Using a **negative control exposure** (a dose "far too low" to be biologically effective) can show that an apparently protective effect persists even when it should not.

### E. Important limitation
- Negative controls are rarely "perfect":
  - You can get **false alarms** (control shows association due to confounding that doesn't affect A–Y).
  - You can get **false reassurance** (control is null even though A–Y is biased).

---

## 4) Methodology
- Negative controls should be analyzed "**according to the same procedure/model**" as the primary A–Y analysis.
- It references common confounding-control methods: restriction, stratification, multivariate modeling, matching, **inverse-probability weighting**, **g-estimation**.

---

## 5) Design requirements

### Negative control outcome (N)
- **Key requirement:** N is *not caused by A*.
- **Comparability requirement:** N should share "as identical as possible" the *common causes* of A and Y (**U-comparability**).

### Negative control exposure (B)
- **Key requirement:** B does *not cause Y*.
- **Comparability requirement:** B should have incoming arrows as similar as possible to A.

### Interpretation protocol
- An observed association in the negative control suggests bias in the main analysis.
- A null negative control is evidence (not proof) that the main estimate is "not likely biased" via pathways captured by that control.
- Both signals and nulls must be treated as **diagnostic evidence with uncertainty**.

---

## 6) Agent implications

### A. Add a "negative control module" as a standard TTE diagnostic
- Attempt **≥1 negative control outcome N** and **≥1 negative control exposure B**.
- Analyze each control with the **identical design + estimator pipeline**.
- If no credible negative controls exist, mark: *"Negative controls not feasible; residual bias detectability reduced."*

### B. Implement "U-comparability" heuristics
- For candidate negative control **outcomes**, prefer those with similar dependence on key baseline risk predictors.
- For candidate negative control **exposures**, prefer exposures driven by similar treatment-selection forces.

### C. Encode "immortal time bias" detection via negative controls
- Construct a negative control exposure analogous to "biologically implausible dose" and rerun the analysis.

### D. Decisioning rules
- If a negative control shows a strong non-null association: **raise a high-severity bias alert**.
- If negative controls are null: treat as **supporting evidence** only.

### E. Reporting requirements
- Include the exact negative control definitions, the rationale, and side-by-side effect estimates.

---

## Paper 15: Target trial emulation to improve causal inference from observational data for nephrology research

**Citation**: Fu (2023) - Target trial emulation to improve causal inference from observational data for nephrology research
**Journal**: J Am Soc Nephrol
**DOI/URL**: [https://journals.lww.com/jasn/fulltext/2023/08000/target_trial_emulation_to_improve_causal_inference.5.aspx](https://journals.lww.com/jasn/fulltext/2023/08000/target_trial_emulation_to_improve_causal_inference.5.aspx)

### Notes (via GPT-5.2-Thinking with Web Search)

## 1) Goal
- Establish **target trial emulation (TTE)** as the *standard* way to design/analyze observational studies of interventions, because it **prevents "self-inflicted" design biases**.
- Provide a practical explanation of **what TTE is, why it's needed, and how to do it**, including a worked example protocol (RASi vs CCB in advanced CKD).

---

## 2) TTE relevance

### "Target trial protocol" is the organizing schema
A target trial should be specified in a **protocol** analogous to an RCT protocol:
- **Eligibility criteria**
- **Treatment strategies**
- **Treatment assignment**
- **Outcomes**
- **Start/end of follow-up**
- **Causal estimand/contrast**
- **Statistical analysis plan**

Table 1 shows these elements mapped to observational data, including an explicit "washout," definition of initiation via filled prescription, outcome ascertainment via linked registries, and per-protocol estimation with IPTW + Cox and Aalen–Johansen curves.

### "Validity" hinges on alignment at time zero
At time zero (baseline):
1) eligibility met
2) treatment strategy assigned
3) follow-up starts

---

## 3) Bias considerations

### Avoidable design biases from misalignment
- Observational designs that do **not** align treatment assignment and follow-up at time zero introduce **immortal time bias**, **lead time bias**, and **selection bias**.
- A cited review found **57%** with immortal time bias, **44%** with depletion of susceptibles / prevalent user selection.

### Dialysis timing example (bias magnitude can swamp everything)
- IDEAL RCT HR: **1.04 (0.83–1.30)**
- TTE analysis: **0.96 (0.94–0.99)**
- Common biased designs produce HRs like **1.58** or **1.46**.

### Selection bias via "postbaseline eligibility"
- **Never use follow-up information to define eligibility** (e.g., "include only people who adhered").

### Confounding is not "solved" by TTE
- TTE **does not remove confounding**; causal conclusions require measuring and adjusting for confounders.
- "Appropriate emulation of randomization requires sufficient adjustment for all baseline confounders…including factors…such as frailty."

### Measurement / surveillance bias
- Outcomes may be detected differentially if one arm is monitored more.

### "What to adjust for" requires causal thinking
- When comparing living vs deceased donor transplant, donor quality differences are **part of the treatment**, so adjust for **recipient** characteristics, not donor characteristics.

---

## 4) Methodology

### Estimands / contrasts
- Distinguishes intention-to-treat vs per-protocol.
- Because observational studies are not randomized, **only per-protocol effects can be estimated**.

### Design families to emulate different target trials
- **Active comparator new user design**: initiating A vs initiating B.
- **Sequential trial design**: when comparing "initiate" vs "do not initiate."
- **Clone–censor–weight design**: for **grace periods**, **treatment duration** strategies, or threshold-triggered rules.

### Adjustment / estimation methods
- **Propensity score methods**.
- **Inverse probability weighting of marginal structural models** for **time-varying confounding**.
- **Cox regression** for hazard ratios; **Aalen–Johansen estimator** for cumulative incidence with competing risks.

### "Agreement" / credibility strategies
- **Benchmarking**: replicate known RCTs first before extending.
- **Negative control outcomes**: outcomes not plausibly affected by treatment; an observed association suggests residual bias.

---

## 5) Design requirements

### Protocol / data feasibility
- Must explicitly specify the protocol elements (Table 1 schema).
- Must ensure the data can emulate eligibility/outcomes.

### Time-zero alignment
- Eligibility met + treatment assigned + follow-up starts at the same baseline time point.

### Treatment strategies must be unambiguous and "decision-relevant"
- Strategies should reflect real clinical decision strategies.
- BMI must be tied to specific interventions (diet, surgery, meds), otherwise causal interpretation is problematic.

### Confounding plan
- Confounders must be measured **before treatment assignment**.
- Don't adjust for variables that are part of the "treatment package."

### Outcome measurement quality checks
- Check for differential measurement intensity (surveillance bias).

---

## 6) Agent implications

### A. Require an explicit Target Trial Protocol object (hard validation)
- Populate and validate fields mirroring Table 1: eligibility, strategies, assignment rule, outcomes, follow-up start/end, estimand/contrast, analysis plan.

### B. Automatic "time-zero alignment" checks (hard fail if violated)
- Verify eligibility assessed + strategy assigned + follow-up begins at the same time zero.

### C. Postbaseline-variable misuse detector (selection bias guardrail)
- Flag or block eligibility criteria that reference events after time zero.

### D. Design selection logic (map question → emulation design)
- "initiate A vs initiate B" → active comparator new user design
- "initiate vs do not initiate" → sequential trials
- grace period / duration / threshold rule → clone–censor–weight

### E. Estimand enforcement: observational ≠ ITT
- Default to **per-protocol** estimation and require explicit justification if user requests "ITT."

### F. Confounder plan checks
- Ensure confounders are measured **pre-assignment**.
- Include a "treatment-package variable" check.

### G. Method defaults
- Offer Cox HR estimation + IPTW and Aalen–Johansen when competing risks are relevant.
- Suggest MSM + IPW when strategies imply time-varying confounding.

### H. Outcome measurement bias diagnostics
- Compare follow-up measurement intensity across arms; do **not** filter the cohort based on postbaseline counts.

### I. Credibility module: benchmarking + negative controls
- **Benchmarking mode**: replicate known RCT in a related subgroup before extending.
- **Negative control outcomes**: run at least one negative control when feasible.

