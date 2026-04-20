document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const btnVisual = document.getElementById('btnVisual');
    const btnAuditory = document.getElementById('btnAuditory');
    const btnCompare = document.getElementById('btnCompare');
    const btnCalculateBF = document.getElementById('btnCalculateBF');
    
    const fefRegion = document.getElementById('fefRegion');
    const splRegion = document.getElementById('splRegion');
    
    const valD = document.getElementById('valD');
    const valP = document.getElementById('valP');
    
    const problemPopup = document.getElementById('problemPopup');
    const bfResults = document.getElementById('bfResults');
    const bfIndicator = document.getElementById('bfIndicator');
    
    // State
    let activeMode = null;

    // Actions
    btnVisual.addEventListener('click', () => {
        setMode('visual');
    });

    btnAuditory.addEventListener('click', () => {
        setMode('auditory');
    });

    btnCompare.addEventListener('click', () => {
        setMode('compare');
    });

    btnCalculateBF.addEventListener('click', () => {
        showBayesianResults();
    });

    function setMode(mode) {
        // Reset
        btnVisual.classList.remove('active-v');
        btnAuditory.classList.remove('active-a');
        btnCompare.classList.remove('active-v', 'active-a');
        fefRegion.classList.remove('active-visual', 'active-auditory');
        splRegion.classList.remove('active-visual', 'active-auditory');
        
        problemPopup.classList.add('hidden');
        btnCalculateBF.classList.add('hidden');
        bfResults.classList.add('hidden');
        
        activeMode = mode;

        if (mode === 'visual') {
            btnVisual.classList.add('active-v');
            fefRegion.classList.add('active-visual');
            splRegion.classList.add('active-visual');
            updateStats(1.52, '< 0.001');
        } 
        else if (mode === 'auditory') {
            btnAuditory.classList.add('active-a');
            fefRegion.classList.add('active-auditory');
            splRegion.classList.add('active-auditory');
            updateStats(1.18, '< 0.001');
        } 
        else if (mode === 'compare') {
            btnCompare.classList.add('active-v', 'active-a');
            fefRegion.classList.add('active-visual'); // Both colors combined or mixed? 
            // Let's just flicker or use a neutral color for "overlap"
            fefRegion.classList.add('active-auditory');
            splRegion.classList.add('active-visual');
            splRegion.classList.add('active-auditory');
            
            updateStats(0.042, '0.584');
            
            // Trigger Problem Popup
            setTimeout(() => {
                problemPopup.classList.remove('hidden');
                btnCalculateBF.classList.remove('hidden');
            }, 800);
        }
    }

    function updateStats(d, p) {
        valD.innerText = d.toFixed(3);
        valP.innerText = p;
        
        // Add pulse effect
        valD.parentElement.classList.add('pulse');
        setTimeout(() => valD.parentElement.classList.remove('pulse'), 500);
    }

    function showBayesianResults() {
        bfResults.classList.remove('hidden');
        btnCalculateBF.classList.add('hidden');
        
        // Animate scale indicator
        // BF10 = 0.392 (Right FEF, strongest evidence for null)
        // Scale mapping: 0% is strong null, 50% is 1.0, 100% is strong alt
        // For BF10 < 1, let's say 50% * BF10
        const targetPos = 50 * 0.392; 
        bfIndicator.style.left = `${targetPos}%`;
        
        // Scroll to results
        bfResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// Add some CSS for the pulse effect dynamically if not in style.css
const style = document.createElement('style');
style.textContent = `
    .pulse {
        animation: pulseEffect 0.5s ease-out;
    }
    @keyframes pulseEffect {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); border-color: var(--accent-primary); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
