function runMatlab() {
    const output = document.getElementById('matlab-output');
    output.innerHTML = '';
    
    const lines = [
        "Initializing cvMANOVA Searchlight...",
        "Radius: 3 voxels (approx. 123 per sphere)",
        "Estimating noise covariance from GLM residuals...",
        "Iteration 1500/45000 voxels...",
        "Iteration 12400/45000 voxels...",
        "Iteration 45000/45000 voxels...",
        "Standardizing D values (D / sqrt(p))...",
        "Saving results: ./results_cvmanova/cms_Ds_c1p1.nii",
        "Done. Peak D_s = 4.21 found in Left Auditory Cortex."
    ];

    let i = 0;
    const interval = setInterval(() => {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.textContent = `> ${lines[i]}`;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
        i++;
        if (i === lines.length) clearInterval(interval);
    }, 400);
}

function runPython() {
    const output = document.getElementById('python-output');
    output.innerHTML = '';
    
    const lines = [
        "SPMLoader: Found 240 beta images.",
        "Contrast: [1, -1, 0, 0]",
        "Fitting Searchlight (parallel='auto')...",
        "[....................] 100% | Completed in 12.4s",
        "Peak Extraction: get_peaks() -> 3 clusters found.",
        "Saving: searchlight_D.nii",
        "Rendering Glass Brain plot...",
        "Plot saved to searchlight_glass_brain.png"
    ];

    let i = 0;
    const interval = setInterval(() => {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.style.color = '#3b82f6';
        div.textContent = `>>> ${lines[i]}`;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
        i++;
        if (i === lines.length) clearInterval(interval);
    }, 300);
}
