# Swarm Agent Prompts for cvMANOVA Tutorials

This document contains a list of prompts designed to be copy-pasted directly to independent coding agents. Each prompt tasks an agent with building out the specific HTML/JS interactive simulation for one of the cvMANOVA tutorials.
Here are the extended prompts for your swarm agents, enriched with the necessary neuroscientific context, methodological best practices, and theoretical explanations directly from the sources:

Here are the extended prompts for your swarm agents, incorporating the necessary neuroscientific context, mathematical formulas, and theoretical explanations directly from the sources:

### 1. The Evolution of Neuroimaging: From ANOVA to MANOVA to cvMANOVA
**Extended Prompt:**
```markdown
You are building an interactive web widget for a neuroscience tutorial website using Vanilla HTML, JS, and CSS. The goal is to explain the evolution from univariate ANOVA to MANOVA, to cvMANOVA. 

Create a visualization where the user can toggle between '1 Voxel (ANOVA)', 'Multi-voxel (MANOVA)', and 'Cross-validated (cvMANOVA)'. Show simulated 2D data points (representing voxels). 
*   **When toggled to MANOVA:** Show how it fits a centroid and models the covariance between variables. Include a tooltip explaining that traditional MANOVA suffers from overfitting and bias; because noise introduces differences between group means, the estimated effect size is always greater than zero even if the null hypothesis is true. Furthermore, explain the "degrees of freedom" problem: in high-dimensional fMRI data, if the number of voxels ($p$) is large relative to the error degrees of freedom ($df_{error}$), the covariance matrix becomes rank-deficient and impossible to invert without introducing biased regularization. 
*   **When toggled to cvMANOVA:** Demonstrate a leave-one-run-out split that removes the bias. Show how training on one set of data and testing on another centers the null distribution at zero.

Ensure it looks modern and matches a dark-mode, glassmorphism aesthetic. Output only the HTML/JS/CSS needed to embed inside an existing `<div class="simulation-placeholder">`.
```

---

### 2. cvMANOVA vs. Machine Learning Classification (SVM)
**Extended Prompt:**
```markdown
Create an interactive comparison between cvMANOVA and a Support Vector Machine (SVM) decoder. Build a 2D scatter plot visualization using JavaScript (e.g., D3 or Chart.js) or HTML5 Canvas. Give the user sliders for 'Noise Variance' and 'Number of Training Trials'.

As the user increases training trials, dynamically update the visualization to illustrate the fundamental differences between these methods:
*   **SVM (Classification Accuracy):** Show SVM accuracy acting non-linearly and eventually saturating at a 100% ceiling. Include UI text explaining that classification accuracy is flawed for inference because it is dependent on the amount of training data, and once it hits 100%, it cannot tell you if one brain region has a 'stronger' representation than another.
*   **cvMANOVA (Pattern Distinctness, $D$):** Show cvMANOVA's pattern distinctness ($D$) scaling linearly with the true effect size without saturating. Add UI text explaining that $\hat{D}$ provides an unbiased, continuous, variance-based measure of the population value, making it invariant to the amount of data.

Include UI elements clearly contrasting the limitations of non-linear classification accuracy versus the interpretability of continuous effect sizes.
```

---

### 3. Unpacking the Math: The MGLM, Mahalanobis Distance, and Negative Values
**Extended Prompt:**
```markdown
Create an interactive JS widget explaining the mathematics of the Multivariate General Linear Model (MGLM) and pattern distinctness ($D$). 

**Mathematical Context to Display:**
Explain that the data $Y$ is modeled as $Y = XB + E$, where $X$ is the design matrix, $B$ represents the patterns of activity, and $E$ is the error matrix. Show that pattern distinctness ($D$) generalizes the Mahalanobis distance to arbitrary experimental designs. Display the core population formula: 
$D = \text{trace}(\frac{1}{n} B_\Delta' X' X B_\Delta \Sigma^{-1})$.
Explain that $\Sigma^{-1}$ performs spatial prewhitening to down-weight noisy or highly correlated voxels.

**Interactive Component (The Negative Value Paradox):**
The interactive component must explicitly show why the cross-validated estimate $\hat{D}$ can be negative. Simulate a scenario where 'True Signal = 0'. Let the user hit a 'Simulate Noise' button. Generate a distribution curve showing that because $\hat{D}$ is a strictly unbiased estimator, its expected average must be zero under the null hypothesis. Therefore, random noise will cause the estimate to fall below zero approximately 50% of the time, centered exactly at 0. Add tooltips explaining that a strongly negative value in real data often indicates unmodeled temporal autocorrelation or design problems.

Ensure the math is rendered beautifully (e.g., using MathJax or KaTeX) and integrated into the widget's layout.
```

### 4. Analyzing Factorial Designs and Pattern Consistency
**Extended Prompt:**
```markdown
Build an interactive tutorial widget that explains how cvMANOVA handles complex factorial designs (e.g., a 2x2 design matrix). 

Build a UI showing a 2x2 grid representing experimental conditions. Let the user define contrast values (1, -1, 0) to test for main effects and interactions. Dynamically update a 'Pattern Consistency' visualization based on their contrast weights.

**Context to Display:**
*   **The Problem with Classifiers:** Explain that standard classifiers are built for binary discrimination, making it difficult to test for interactions in factorial designs. Because cvMANOVA is built on the multivariate General Linear Model (MGLM), testing for main effects and interactions is as simple as defining the appropriate contrast matrix.
*   **Interaction Effects:** Explain that an interaction tests whether the pattern difference between levels of one factor changes depending on another factor. A strong non-linear interaction indicates the integration of the two factors in the brain, while an absence of interaction suggests the patterns linearly superimpose and are encoded in separate neural populations.
*   **Pattern Consistency (Cross-Decoding):** Explain that pattern consistency is the equivalent of 'cross-decoding' (e.g., training on 'seeing' an action and testing on 'doing' an action). Show the user the formula for computing pattern stability: the hypothesis matrix for pattern consistency is calculated by subtracting the interaction effect from the main effect ($\hat{D}_{stability} = \hat{D}_{main} - \hat{D}_{interaction}$). Visually demonstrate that this metric quantifies the degree of stability of a pattern across different contexts.
```

---

### 5. Designing a cvMANOVA Study: GLMs, Autocorrelation, and Searchlights
**Extended Prompt:**
```markdown
Build an interactive guide for designing a cvMANOVA study. Create a simulation of a 3D brain slice (a 2D grid of clickable pixels). 

Give the user three controls: 'Searchlight Radius', 'Nuisance Regressors', and 'Temporal Autocorrelation (AR1/FAST)'. Visually update a 'quality score' based on the user's parameter choices. 

**Context and Interactive Logic to Implement:**
*   **First-Level GLM & Nuisance Regressors:** Explain that the accuracy of cvMANOVA depends entirely on a properly specified first-level GLM. Because cvMANOVA derives its 'noise' estimate from the GLM residuals, any unmodeled signal (like head motion or physiological fluctuations) will leak into the error covariance matrix, which masks true effects and creates false negatives. Show the quality score dropping if these are omitted.
*   **Temporal Autocorrelation:** Explain that fMRI data is temporally autocorrelated, and failing to model this properly (e.g., using AR(1) or FAST models) will violate the assumptions of cross-validation. Visually demonstrate that ignoring this step artificially produces strongly negative $D$ values.
*   **Searchlight Radius and Rank-Deficiency:** Show that a searchlight radius of 3.0 (approx. 123 voxels) is the recommended 'sweet spot' because it provides enough multivariate information to stabilize the covariance estimate while remaining spatially specific. Demonstrate that if the user sets the radius too high relative to the error degrees of freedom ($df_{error}$), the covariance matrix becomes rank-deficient and impossible to invert. If the user toggles a 'Regularization/Shrinkage' switch to fix this, display a warning explaining that while shrinkage improves numerical stability, it systematically biases the results, meaning $D$ is no longer an unbiased estimator.
```

**6. Code Tutorial: Implementing cvMANOVA in MATLAB and Python**
**Extended Prompt:**
```markdown
Build a split-pane interactive code viewer widget. On the left, display the MATLAB implementation (SPM integrated), and on the right, display the Python implementation (nilearn integrated). 

**Code Context to Include:**
*   **MATLAB:** Show the use of the `cvManovaSearchlight(dirName, slRadius, Cs, permute)` and `cvManovaRegion()` functions from the original toolbox. Emphasize in the code comments that the SPM model must explicitly model temporal autocorrelations (e.g., keeping 'serial correlations' at **AR(1)** or **FAST**) to correctly estimate pattern distinctness. Show the output files being generated, specifically `cms_Ds_c*p*.nii`, representing the standardized pattern distinctness.
*   **Python:** Show the `cvmanova_python` API using scikit-learn style estimators like `SearchlightCvManova` and `RegionCvManova`. Include data loading via `SPMLoader` or `NilearnMaskerLoader`. Show the use of the `ContrastSpec` class to automatically generate complex factorial design contrasts.

Provide interactive 'Run' buttons that simulate the output of extracting peak voxels using `get_peaks()`, saving NIfTI files (`to_nifti()`), and rendering a static 'glass brain' plot using `plot_glass_brain()` from the Python implementation. Use a syntax highlighter library (like PrismJS) and ensure it matches a premium dark mode aesthetic.
```

---

**7. The Importance of Noise Covariance**
**Extended Prompt:**
```markdown
Create a 2D interactive scatter plot demonstrating the importance of noise covariance. 

**Scientific Context to Display:**
Add UI text explaining that **noise in fMRI data has spatial structure**—neighboring voxels share noise processes, and some voxels are inherently noisier due to vascular supply or tissue type. Explain that Euclidean distance is suboptimal because it weighs all voxels equally, regardless of variance. 

Add an interactive slider that controls the 'Spatial Correlation of Noise' between two voxels. Show two distance metric outputs: Euclidean Distance and Mahalanobis (cvMANOVA) Distance. 
*   **When noise correlation increases:** Demonstrate that the Euclidean metric produces false positives or fails to separate the classes. 
*   **The cvMANOVA solution:** Show how Mahalanobis geometry correctly disentangles the signal by utilizing the inverted noise covariance matrix ($\Sigma^{-1}$) estimated from the first-level GLM residuals. Visually simulate **spatial prewhitening**, showing how $\Sigma^{-1}$ down-weights noisy or highly correlated voxels to reveal the true signal differences.
```

---

**8. Cross-Validated Mahalanobis (cvMANOVA) vs. Linear Discriminant Contrast (LDC)**
**Extended Prompt:**
```markdown
Build a widget comparing raw cross-validated distances to cvMANOVA's standardized inferential framework. 

**Theoretical Context to Display:**
Explain that cvMANOVA's pattern distinctness ($D$) is actually a direct generalization of the cross-validated Mahalanobis distance to arbitrary experimental designs, allowing simultaneous estimation of multiple variables and complex factorial interactions. 

Create a visualization where the user can toggle between raw distance equations and cvMANOVA equations. Let the user adjust 'Standardization'. 
*   Visually output how both are strictly unbiased estimators (their expected value centers exactly at zero when there is no true difference). 
*   **The Role of Standardization:** Explain that in searchlight analyses, spheres near the boundaries of the brain mask contain fewer voxels ($p$), causing an inhomogeneous null variance. Show how cvMANOVA provides a built-in inferential framework by calculating the **standardized pattern distinctness** ($\hat{D}_s = \frac{1}{\sqrt{p}} \hat{D}$), which divides the estimate by the square root of the number of voxels to produce a Z-score-like map suitable for robust group-level inference.
```

---

**9. Power Analysis & Sample Size Selection**
**Extended Prompt:**
```markdown
Create an interactive Power Analysis calculator for fMRI studies using cvMANOVA. 

**Statistical Context for the Simulation:**
Provide sliders for: 'Number of Voxels ($p$)', 'Number of Trials/Runs', and 'True Effect Size'. Dynamically render a chart (using Chart.js or similar) that simulates statistical power and standard error based on the following mathematical rules derived from the MGLM:
1.  **Variance scales with voxels:** Demonstrate that the sampling variance of $\hat{D}$ under the null hypothesis is **approximately proportional to the number of voxels ($p$)**. 
2.  **More data reduces variance:** Show that increasing the number of independent runs or trials decreases the variance of the unbiased estimate, tightening the distribution curve.
3.  **The Rank-Deficiency Warning:** Add a critical visual warning if the user sets the 'Number of Voxels' too high relative to the trials (specifically, if $p$ exceeds 90% of the available error degrees of freedom, $df_{error}$). Explain that while increasing the searchlight radius includes more information, exceeding this limit makes the covariance matrix impossible to invert without **regularization (shrinkage)**. Warn the user that introducing regularization fundamentally breaks the unbiased nature of cvMANOVA, making $\hat{D}$ a biased estimator. Suggest an optimal default searchlight radius of 3.0 (approx. 123 voxels).
```


Here are the extended prompts for the paper walkthrough case studies, enriched with the necessary experimental details, actual statistics, and neuroscientific context extracted directly from the sources:

### 10. Decoding the "Invisible": Spatial vs. Non-Spatial Auditory Working Memory (Erhart et al., 2021)
**Extended Prompt:**
```markdown
Build an interactive case study widget for the paper *Erhart et al., 2021*. The goal is to show the high multivariate sensitivity of cvMANOVA using a searchlight approach (radius = 3 voxels).

Create an interactive timeline of the trial where participants listen to abstract sounds and maintain either spatial (location via interaural time delay) or non-spatial (pitch) information.
*   **'Univariate GLM' View:** Show the signal difference hovering around 0 in the auditory cortex. Add a tooltip explaining that overall metabolic demand is identical because the physical sounds presented in both tasks are exactly the same; maintenance-related activations are distributed across the sensory cortex, preventing univariate methods from detecting contiguous activation blobs. 
*   **'Multivariate cvMANOVA' View:** Reveal a distributed, fine-grained voxel pattern that successfully decodes spatial vs. non-spatial maintenance across 18 cortical regions (including the bilateral auditory cortex and frontoparietal networks). 

Add clickable hotspots that explicitly state: 'Because MVPA evaluates the covariance structure across multiple measurements, it extracts information encoded in the pattern geometry—revealing hidden representations that univariate magnitude averaging destroys.'
```

---

### 11. Disentangling Correlated Variables in Time: Abstract Choice Representations (Quinn et al., 2024)
**Extended Prompt:**
```markdown
Build an interactive MEG time-series visualization for the paper *Quinn et al., 2024*. Use a line chart UI spanning from Stimulus Onset (0s) to the Go-Cue (2.0s) and into the response period.

Allow the user to toggle MGLM regressors ON and OFF to isolate 'Perceptual Abstract Choice' independently from 'Motor Response'. 
*   **Temporal Dynamics to Simulate:** When 'Motor Response' is toggled, show the signal rising late in the stimulus period and peaking sharply right after the 2.0s Go-Cue. When 'Abstract Choice' is toggled, show the signal ramping up early during the 0–2s stimulus presentation (matching sensory evidence integration) and peaking after the response is made. 
*   **Context Explanation:** Add an interactive breakdown of the Multivariate General Linear Model (MGLM). Explain that cvMANOVA handles shared variance by estimating the baseline noise covariance matrix ($\Sigma^{-1}$) across all trials and unique combinations. Because choice, motor response, and stimulus coherence are all included as separate factors in the MGLM, cvMANOVA explicitly removes the variability explained by the motor response to yield an unbiased, independent measure of the abstract choice.
```

---

### 12. Quantifying Memory Remoteness using Pattern Distinctness (Santangelo et al., 2020)
**Extended Prompt:**
```markdown
Create a regression-style interactive visualization based on *Santangelo et al., 2020*. 

Build a scatterplot plotting 'Pattern Distinctness ($D$) in the left vmPFC' (Y-axis) against 'Temporal Distance between Older and Newer Memories in Months' (X-axis). 
*   **Interactive Slider:** Let the user drag a slider corresponding to the 'Memory Age Gap'. 
*   **Group Comparison Logic:** Provide a toggle between 'Healthy Controls' and 'Highly Superior Autobiographical Memory (HSAM)'. For controls, dynamically update the plot to show a flat, non-significant scatter cloud (simulate Pearson $r = 0.354, p = 0.058$). For HSAM individuals, show the $D$ value increasing linearly as the temporal distance increases (simulate Pearson $r = 0.652, p = 0.040$). 
*   **Context:** Add UI text explaining that cvMANOVA's $D$ metric is not a binary 'detectable/not detectable' classification threshold. Instead, it is a continuous measure of effect size that allows researchers to prove that the vmPFC's neural specialization scales continuously with the remoteness of the memory.
```

---

### 13. Investigating Supramodal Codes and Interpreting Null Results (Rizza et al., 2024)
**Extended Prompt:**
```markdown
Build an interactive widget explaining Bayesian statistics applied to cvMANOVA, modeled on *Rizza et al., 2024*. The focus is on rigorously interpreting 'null' results. 

Provide UI buttons for 'Visual Context (Color shades)' and 'Auditory Context (Sound pitches)'. Show how both contexts activate the same dorsal frontoparietal regions (Frontal Eye Fields and Superior Parietal Lobule) when working memory load is high.
*   **The Problem:** Show that cvMANOVA pattern distinctness ($D$) between the visual and auditory maps hovers at 0 ($p > 0.05$). Include a pop-up asking: 'Is this a true supramodal (shared) representation, or did the study just lack statistical power?'
*   **Bayes Factor Calculation:** Ask the user to hit 'Calculate Bayes Factor'. Generate a visual scale showing the resulting $BF_{10}$ values falling below 1 (e.g., $BF_{10} = 0.668$ in the Left FEF, $BF_{10} = 0.392$ in the Right FEF). 
*   **Explanation:** Demonstrate how a Bayes Factor ($BF_{10} < 1$, or $BF_{01} > 1$) mathematically weighs the evidence in favor of the null hypothesis. Explain that pairing Bayes Factors with cvMANOVA confirms that the frontoparietal neural patterns for visual and auditory spatial maps are genuinely indistinguishable, proving a shared, supramodal code.
```

Here are the extended prompts for your swarm agents, enriched with the necessary equations, neuroscientific context, and step-by-step logic derived from the source materials to ensure accurate interactive simulations:

### 14. Testing the Generalization of Neural Representations Across Time
**Extended Prompt:**
```markdown
Build an interactive Cross-Temporal Decoding Matrix (Time x Time heatmap) using Canvas or JS based on the methodological frameworks of *Voigtlaender et al. (2023)* and *Sandhaeger & Siegel (2023)*. 

**Interactive Heatmap Logic:**
Allow the user to hover over the matrix. 
*   **Main Diagonal Hover:** Explain that the main diagonal represents 'stable maintenance' (training and testing the multivariate model at the exact same time point, $t_1 = t_2$).
*   **Off-Diagonal Hover:** Explain that off-diagonal points represent 'pattern generalization' (training the model at $t_1$ and testing it at $t_2$). High values here mean the neural code used to represent the information remained stable across that time delay.

**The 'Calculate Expected Cross-time Information' Feature:**
Include a toggle button. When clicked, overlay a theoretical "null hypothesis of perfect stability" over the heatmap to rigorously test against. 
*   **Context for the Agent:** Raw cross-decoding magnitudes are difficult to interpret because they depend on the signal-to-noise ratio at both time points. To prove a representation is *dynamic* (transforming over time), you must show that the cross-time information is significantly *smaller* than what you would expect if the patterns were perfectly stable.
*   **The Math to Implement:** Calculate the Expected Cross-time Information ($E_{12}$) for any point $(t_1, t_2)$ using the formula: 
    $E_{12} = \sqrt{|D_1 D_2|} \cdot \text{sign}(D_1) \cdot \text{sign}(D_2)$
    where $D_1$ and $D_2$ are the pattern distinctness values on the main diagonal at $t_1$ and $t_2$.
*   **Visual Output:** Show that if the empirical cross-decoding value is significantly smaller than $E_{12}$, the representation has transformed. If it approaches $E_{12}$, the representation is stable.
```

---

### 15. Case Study Recap: Allefeld & Haynes (2014) Searchlight
**Extended Prompt:**
```markdown
Build an interactive walkthrough of the foundational *Allefeld & Haynes (2014)* searchlight methodology. Create a step-by-step scrollytelling or carousel widget. The user must click 'Next' and actively build the final searchlight map by understanding each foundational logic.

**Step 1: Why standard MANOVA fails on high-dimensional data.**
*   **Concept:** Explain that classical MANOVA statistics (like the Bartlett-Lawley-Hotelling trace, $T_{BLH}$) are biased estimators. 
*   **Visual:** Show a simulation curve where the true effect is 0. Demonstrate that traditional MANOVA still outputs a strongly positive value, and this false positive bias worsens as the number of voxels ($p$) increases.

**Step 2: The introduction of cross-validation.**
*   **Concept:** Explain that cvMANOVA solves this bias by using a leave-one-run-out cross-validation framework on the Multivariate GLM.
*   **The Math:** Show the core logic where the model is trained on one set of runs and tested on the left-out run. Provide the simplified conceptual equation: $\hat{D} \approx \text{trace}(\hat{B}_{train}' \dots \hat{B}_{test} \dots \Sigma^{-1})$. 
*   **Visual:** Show the sampling distribution curve shifting to center exactly at 0 when the true effect is null, proving it is now an unbiased estimator of pattern distinctness ($D$). 

**Step 3: The Searchlight implementation mapping D-values.**
*   **Concept:** Explain the "Searchlight" technique: moving a spherical mask (e.g., radius of 3 voxels, approx. 123 voxels) iteratively throughout the entire brain to map local multivariate effects. 
*   **The Math (Standardization):** It is critical that the agent implements the standardization equation: $\hat{D}_s = \frac{\hat{D}}{\sqrt{p}}$. 
*   **Visual/Interactive:** Show a 3D brain boundary. Let the user drag a searchlight sphere to the edge of the brain mask. Explain that at the borders of the brain, the sphere contains fewer valid voxels ($p$). Because the sampling variance of $\hat{D}$ scales with $p$, dividing by $\sqrt{p}$ standardizes the map so that $D$-values can be safely compared and thresholded across the entire brain for group-level inference. Ensure the visual map dynamically updates its color scaling when the standardization formula is applied.
```
