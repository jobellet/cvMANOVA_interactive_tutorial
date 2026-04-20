document.addEventListener('DOMContentLoaded', () => {
    const runMatlab = document.getElementById('runMatlab');
    const runPython = document.getElementById('runPython');
    const matlabLog = document.getElementById('matlabLog');
    const pythonLog = document.getElementById('pythonLog');
    const resultContainer = document.getElementById('resultContainer');

    const addLog = (el, text, type = '') => {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerText = `> ${text}`;
        el.appendChild(line);
        el.scrollTop = el.scrollHeight;
    };

    const simulateRun = async (btn, logEl, steps) => {
        if (btn.disabled) return;
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spin">⟳</span> Running...';
        
        logEl.innerHTML = '<span class="terminal-title">Output</span>';
        
        for (const step of steps) {
            await new Promise(r => setTimeout(r, step.delay));
            addLog(logEl, step.text, step.type);
        }

        btn.disabled = false;
        btn.innerHTML = originalText;
        resultContainer.style.display = 'block';
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const matlabSteps = [
        { text: "Initializing SPM Toolbox...", delay: 500 },
        { text: "Loading SPM.mat (AR1 Serial Correlations detected)", type: 'success', delay: 800 },
        { text: "Running Searchlight (Radius: 3)...", delay: 1200 },
        { text: "Computing D-statistic for Contrast [1 -1]", delay: 1000 },
        { text: "Saving cms_Ds_c1p1.nii...", type: 'success', delay: 700 },
        { text: "Analysis complete.", type: 'success', delay: 400 }
    ];

    const pythonSteps = [
        { text: "Importing cvmanova_python...", delay: 400 },
        { text: "Loading SPMLoader: ./stats_dir", delay: 600 },
        { text: "X shape: (240, 42102), Y shape: (240,)", type: 'success', delay: 500 },
        { text: "Searchlight Search: Progress [██████████] 100%", delay: 1500 },
        { text: "results.get_peaks(): 1 cluster found.", type: 'success', delay: 800 },
        { text: "results.to_nifti(): Saved ./manova_map.nii", type: 'success', delay: 600 },
        { text: "nilearn.plot_glass_brain() invoked.", delay: 500 }
    ];

    runMatlab.addEventListener('click', () => simulateRun(runMatlab, matlabLog, matlabSteps));
    runPython.addEventListener('click', () => simulateRun(runPython, pythonLog, pythonSteps));
});

// Spin style
const style = document.createElement('style');
style.innerHTML = `
    .spin { display: inline-block; animation: rotate 1s linear infinite; }
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
