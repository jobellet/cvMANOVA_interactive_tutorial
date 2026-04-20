/**
 * Tutorial 10: Factorial Designs & Pattern Consistency
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        weights: [1, 1, -1, -1], // Default: Main A
        groundTruth: {
            interaction: 0.3,
            main: 1.0,
            noise: 0.1
        },
        patterns: {}
    };

    let patternChart = null;

    init();

    function init() {
        generatePatterns();
        setupEventListeners();
        updateViz();
    }

    function generatePatterns() {
        const { interaction, main } = state.groundTruth;
        
        // Base pattern for Factor A
        const baseA = [1.0, 0.5, -0.2, 0.4, -0.1];
        // Base pattern for Factor B
        const baseB = [0.2, -0.3, 0.8, -0.1, 0.5];
        // Interaction pattern (non-linear part)
        const intP = [0.1, 0.8, 0.4, -0.5, 0.2];

        state.patterns = {
            a1b1: baseA.map((v, i) => (v * main) + (baseB[i] * 0.5) + (intP[i] * interaction)),
            a1b2: baseA.map((v, i) => (v * main) - (baseB[i] * 0.5) - (intP[i] * interaction)),
            a2b1: baseA.map((v, i) => (-v * main) + (baseB[i] * 0.5) - (intP[i] * interaction)),
            a2b2: baseA.map((v, i) => (-v * main) - (baseB[i] * 0.5) + (intP[i] * interaction))
        };
    }

    function setupEventListeners() {
        // Weights
        ['w1', 'w2', 'w3', 'w4'].forEach((id, i) => {
            document.getElementById(id).addEventListener('input', (e) => {
                state.weights[i] = parseFloat(e.target.value) || 0;
                updateViz();
            });
        });

        // Sliders
        const intSlider = document.getElementById('interactionSlider');
        const mainSlider = document.getElementById('mainStrengthSlider');

        intSlider.addEventListener('input', (e) => {
            state.groundTruth.interaction = parseFloat(e.target.value);
            document.getElementById('intVal').textContent = state.groundTruth.interaction.toFixed(1);
            generatePatterns();
            updateViz();
        });

        mainSlider.addEventListener('input', (e) => {
            state.groundTruth.main = parseFloat(e.target.value);
            document.getElementById('mainStrengthVal').textContent = state.groundTruth.main.toFixed(1);
            generatePatterns();
            updateViz();
        });
    }

    window.setPreset = function(type) {
        let w = [0,0,0,0];
        if (type === 'mainA') w = [1, 1, -1, -1];
        if (type === 'mainB') w = [1, -1, 1, -1];
        if (type === 'interaction') w = [1, -1, -1, 1];
        
        state.weights = w;
        w.forEach((val, i) => document.getElementById(`w${i+1}`).value = val);
        updateViz();
    };

    function updateViz() {
        const contrastResult = computeContrast(state.weights, state.patterns);
        const metrics = computeFactorialMetrics(state.patterns);
        
        updatePatternChart(contrastResult);
        updateStability(metrics);
    }

    function computeContrast(weights, patterns) {
        const result = new Array(5).fill(0);
        const keys = ['a1b1', 'a1b2', 'a2b1', 'a2b2'];
        keys.forEach((key, i) => {
            patterns[key].forEach((v, j) => result[j] += weights[i] * v);
        });
        return result;
    }

    function computeFactorialMetrics(patterns) {
        const distSq = (p1, p2) => p1.reduce((acc, v, i) => acc + Math.pow(v - p2[i], 2), 0);
        
        const mA1 = patterns.a1b1.map((v, i) => (v + patterns.a1b2[i]) / 2);
        const mA2 = patterns.a2b1.map((v, i) => (v + patterns.a2b2[i]) / 2);
        const dMain = distSq(mA1, mA2);

        const diffB1 = patterns.a1b1.map((v, i) => v - patterns.a2b1[i]);
        const diffB2 = patterns.a1b2.map((v, i) => v - patterns.a2b2[i]);
        const dInt = distSq(diffB1, diffB2) / 4;

        return { dMain, dInt, stability: Math.max(0, dMain - dInt) };
    }

    function updatePatternChart(data) {
        const ctx = document.getElementById('patternChart').getContext('2d');
        if (patternChart) {
            patternChart.data.datasets[0].data = data;
            patternChart.update();
            return;
        }
        patternChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['V1', 'V2', 'V3', 'V4', 'V5'],
                datasets: [{
                    data: data,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    function updateStability(metrics) {
        document.getElementById('stabilityValue').textContent = metrics.stability.toFixed(2);
    }
});
