# Swarm Agent Prompts for cvMANOVA Tutorials

This document contains a list of prompts designed to be copy-pasted directly to independent coding agents. Each prompt tasks an agent with building out the specific HTML/JS interactive simulation for one of the cvMANOVA tutorials.

---

## 1. The Evolution of Neuroimaging: From ANOVA to MANOVA to cvMANOVA
**Prompt:**
> "You are building an interactive web widget for a cardiovascular/neuroscience tutorial website using Vanilla HTML, JS, and CSS. The goal is to explain the evolution from univariate ANOVA to MANOVA, to cvMANOVA. 
> Create a visualization where the user can toggle between '1 Voxel (ANOVA)', 'Multi-voxel (MANOVA)', and 'Cross-validated (cvMANOVA)'. Shows simulated 2D data points (representing voxels). When toggled to MANOVA, show how it fits a centroid but overfits noise. When toggled to cvMANOVA, demonstrate a leave-one-run-out split that removes the bias. Ensure it looks modern and matches a dark-mode, glassmorphism aesthetic. Output only the HTML/JS/CSS needed to embed inside an existing `<div class="simulation-placeholder">`."

*Resource Note:* Provide the agent with the equations or a brief conceptual summary of how degrees of freedom limit traditional MANOVA in imaging, so the agent can add accurate tooltip text.

---

## 2. cvMANOVA vs. Machine Learning Classification (SVM)
*(Combines user idea #2 with original idea #1)*
**Prompt:**
> "Create an interactive comparison between cvMANOVA and a Support Vector Machine (SVM) decoder. Build a 2D scatter plot visualization using JavaScript (e.g., D3 or Chart.js) or HTML5 Canvas. Give the user sliders for 'Noise Variance' and 'Number of Training Trials'.
> As the user increases training trials, show SVM accuracy saturating at 100%, while cvMANOVA's pattern distinctness (D) continues to scale linearly, providing a continuous measure of effect size. Include UI elements explaining non-linearity vs continuous effect sizes."

---

## 3. Unpacking the Math: The MGLM, Mahalanobis Distance, and Negative Values
*(Combines user idea #3 with original ideas #2 & #5)*
**Prompt:**
> "Create an interactive JS widget explaining the mathematics of the Multivariate General Linear Model (MGLM) and pattern distinctness (D). 
> The interactive component must explicitly show why $D$ can be negative. Simulate a scenario where 'True Signal = 0'. Let the user hit a 'Simulate Noise' button. Generate a distribution curve showing that because $D$ is an unbiased estimator, random noise causes the estimate to fall below zero roughly 50% of the time, centered exactly at 0. Add tooltips explaining how $D$ generalizes Mahalanobis distance."

*Resource Note:* Provide the agent with the actual formula for the cross-validated distance $D$ (e.g., $D = \frac{1}{N} \text{trace}(...)$) so it can display the math dynamically on the page.

---

## 4. Analyzing Factorial Designs and Pattern Consistency
**Prompt:**
> "Build an interactive tutorial widget that explains how cvMANOVA handles complex factorial designs (e.g., a 2x2 design matrix). 
> Build a UI showing a 2x2 grid representing experimental conditions. Let the user define contrast values (1, -1, 0) to test for main effects and interactions. Dynamically update a 'Pattern Consistency' visualization based on their contrast weights, demonstrating how to test for cross-decoding using F-like complex contrast matrices."

---

## 5. Designing a cvMANOVA Study: GLMs, Autocorrelation, and Searchlights
*(Combines user idea #5 with original idea #4)*
**Prompt:**
> "Build an interactive guide for designing a cvMANOVA study. Create a simulation of a 3D brain slice (a 2D grid of clickable pixels). 
> Give the user three controls: 'Searchlight Radius', 'Nuisance Regressors', and 'Temporal Autocorrelation (AR1/FAST)'. Show how setting the radius too high (> 3.0) causes rank-deficiency flags. Show how ignoring AR(1) autocorrelation artificially produces negative D values. Visually update a 'quality score' based on the user's parameter choices."

---

## 6. Code Tutorial: Implementing cvMANOVA in MATLAB and Python
**Prompt:**
> "Build a split-pane interactive code viewer widget. On the left, display the MATLAB implementation (SPM integrated), and on the right, display the Python implementation (nilearn integrated). 
> Provide interactive 'Run' buttons that simulate the output of extracting peak voxels, saving NIfTI files, and rendering a static 'glass brain' plot. Use a syntax highlighter library (like PrismJS) and ensure it matches a premium dark mode aesthetic."

*Resource Note:* Feed the agent snippets from the actual `cvmanova_python` repository and MATLAB toolbox documentation so the code displayed is 100% accurate.

---

## 7. The Importance of Noise Covariance
*(Original idea #3)*
**Prompt:**
> "Create a 2D interactive scatter plot demonstrating the importance of noise covariance. 
> Add an interactive slider that controls the 'Spatial Correlation of Noise' between two voxels. Show two distance metric outputs: Euclidean Distance and Mahalanobis (cvMANOVA) Distance. Demonstrate that as noise correlation increases, Euclidean metric produces false positives or fails, whereas Mahalanobis geometry correctly disentangles the signal."

---

## 8. Cross-Validated Mahalanobis (cvMANOVA) vs. Linear Discriminant Contrast (LDC)
*(Original idea #7)*
**Prompt:**
> "Build a widget comparing Linear Discriminant Contrast (LDC) to cvMANOVA. 
> Create a visualization where the user can toggle between LDC equations and cvMANOVA equations. Let the user adjust 'Standardization'. Visually output how both are unbiased, but cvMANOVA provides a built-in inferential framework (standardized effect size) while LDC provides a raw distance."

---

## 9. Power Analysis & Sample Size Selection
*(Original idea #8)*
**Prompt:**
> "Create an interactive Power Analysis calculator for fMRI studies using cvMANOVA. 
> Provide sliders for: 'Number of Voxels', 'Number of Trials', and 'True Effect Size'. Dynamically render a chart (using Chart.js or similar) that simulates statistical power and standard error. Show users how tweaking these parameters influences the p-value and required sample size for threshold detection."

---

## 10. Decoding the "Invisible": Spatial vs. Non-Spatial Auditory Working Memory (Erhart et al., 2021)
**Prompt:**
> "Build an interactive case study widget for the paper *Erhart et al., 2021*. 
> The goal is to show the high multivariate sensitivity of cvMANOVA. Create an interactive timeline of the trial. Show a 'Univariate GLM' view where signal difference is 0 (due to identical metabolic demand), and a 'Multivariate cvMANOVA' view where distinct patterns successfully decode spatial (location) vs. non-spatial (pitch) maintenance. Add clickable hotspots that reveal excerpts from the paper explaining the discrepancy."

*Resource Note:* Provide the agent with the abstract and key figures/methods from Erhart et al. (2021) so the tooltips reflect accurate, published statistics.

---

## 11. Disentangling Correlated Variables in Time: Abstract Choice Representations (Quinn et al., 2024)
**Prompt:**
> "Build an interactive MEG time-series visualization for the paper *Quinn et al., 2024*. 
> Use a line chart UI. Allow the user to toggle MGLM regressors ON and OFF to isolate 'Perceptual Abstract Choice' independently from 'Motor Response'. Show how cvMANOVA allows the temporal dynamics of these two highly correlated factors to separate across the trial time limits. Add an explanation of how MGLM handles the shared variance over time."

*Resource Note:* Provide the agent with the time-series plots or time limits from Quinn et al. (2024) to accurately reproduce the temporal decoding shape.

---

## 12. Quantifying Memory Remoteness using Pattern Distinctness (Santangelo et al., 2020)
**Prompt:**
> "Create a regression-style interactive visualization based on *Santangelo et al., 2020*. 
> Build a scatterplot plotting 'Pattern Distinctness (D) in the vmPFC' against 'Memory Temporal Distance (Remoteness)'. Let the user drag a slider corresponding to the age of the memory, and dynamically update the D value to prove that pattern distinctness is a continuous metric correlating with time, instead of a binary threshold."

---

## 13. Investigating Supramodal Codes and Interpreting Null Results (Rizza et al., 2024)
**Prompt:**
> "Build an interactive widget explaining Bayesian statistics applied to cvMANOVA, modeled on *Rizza et al., 2024*. 
> The focus is on interpreting 'null' results. Provide UI buttons for 'Visual Context' and 'Auditory Context' mappings. Show how the neural patterns overlap. Then, ask the user to hit 'Calculate Bayes Factor'. Provide an interactive visual that weighs 'Lack of Power' vs 'True Supramodal Overlap', demonstrating how Bayes Factors paired with cvMANOVA confirm that representations are genuinely indistinguishable."

*Resource Note:* Provide the exact Bayes Factor metrics and thresholds used in the paper so the agent simulates a realistic threshold line (e.g., $BF_{01} > 3$).

---

## 14. Testing the Generalization of Neural Representations Across Time (Voigtlaender et al., 2023 / Sandhaeger & Siegel, 2023)
**Prompt:**
> "Build an interactive Cross-Temporal Decoding Matrix (Time x Time heatmap) using Canvas or JS based on *Voigtlaender et al.* & *Sandhaeger & Siegel*. 
> Allow the user to hover over the matrix. When hovering over the diagonal, explain 'stable maintenance'. When hovering off-diagonal, explain 'generalization'. Include a toggle for 'Calculate Expected Cross-time Information' that overlays a theoretical null hypothesis over the heatmap to rigorously test against perfect stability."

*Resource Note:* The agent will need to know the specific equation for the null hypothesis of perfect stability (i.e., how the off-diagonal is bounded by the main diagonal geometry) to implement the 'Expected Cross-time Information' logic.

---

## 15. Case Study Recap: Allefeld & Haynes (2014) Searchlight
*(Original idea #6)*
**Prompt:**
> "Build an interactive walkthrough of the foundational *Allefeld & Haynes (2014)* searchlight methodology. 
> Create a step-by-step scrollytelling or carousel widget. Step 1: Why standard MANOVA fails on high-dimensional data. Step 2: The introduction of cross-validation. Step 3: The Searchlight implementation mapping D-values. Ensure the user must click 'Next' and actively build the final searchlight map by understanding each foundational logic." 

*Resource Note:* Feed the agent the main methodology equations from Allefeld & Haynes (2014) to annotate the progression steps.
