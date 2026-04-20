/**
 * Tutorial 12: Standardization & Inference
 * Handles simulation of unbiased estimators and standardization effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let mode = 'cvmanova'; // 'raw' or 'cvmanova'
    let voxels = 27; // p
    let dataPoints = [];
    let chart = null;

    // Elements
    const rawBtn = document.getElementById('rawBtn');
    const cvmanovaBtn = document.getElementById('cvmanovaBtn');
    const voxelSlider = document.getElementById('voxelSlider');
    const voxelVal = document.getElementById('voxelVal');
    const equationDisplay = document.getElementById('equationDisplay');
    const voxelGrid = document.getElementById('voxelGrid');
    const simulateBtn = document.getElementById('simulateBtn');

    // Equations
    const equations = {
        raw: "\\[ \\hat{d}^2 = (b_1 - b_2)' \\Sigma^{-1} (b_1 - b_2) - \\text{bias} \\]",
        cvmanova: "\\[ \\hat{D}_s = \\frac{1}{\\sqrt{p}} \\hat{D} \\]"
    };

    const descriptions = {
        raw: "Cross-validated Mahalanobis distance is unbiased, but its null variance depends heavily on the number of voxels (p).",
        cvmanova: "cvMANOVA standardizes the estimate by \\(\\sqrt{p}\\), ensuring consistent null variance (Z-score like) regardless of searchlight size."
    };

    // Initialize KaTeX rendering
    const updateEquation = () => {
        equationDisplay.innerHTML = equations[mode];
        if (window.renderMathInElement) {
            renderMathInElement(equationDisplay);
        }
    };

    // Update Voxel Grid Preview
    const updateVoxelGrid = () => {
        voxelGrid.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const v = document.createElement('div');
            v.className = 'voxel' + (i < voxels ? ' active' : '');
            voxelGrid.appendChild(v);
        }
    };

    // Charting
    const initChart = () => {
        const ctx = document.getElementById('distributionChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 100}, (_, i) => (i - 50) / 10),
                datasets: [{
                    label: 'Null Distribution (True Effect = 0)',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Estimated Effect Size', color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' },
                        min: -5,
                        max: 5
                    },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'zeroLine',
                afterDraw: (chart) => {
                    const ctx = chart.ctx;
                    const xAxis = chart.scales.x;
                    const yAxis = chart.scales.y;
                    const x = xAxis.getPixelForValue(0);
                    
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.setLineDash([5, 5]);
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, yAxis.top);
                    ctx.lineTo(x, yAxis.bottom);
                    ctx.stroke();
                    
                    // Label
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.font = '12px Outfit';
                    ctx.textAlign = 'center';
                    ctx.fillText('Expected Value = 0', x, yAxis.top - 10);
                    ctx.restore();
                }
            }]
        });
    };

    const updateDistribution = () => {
        const labels = Array.from({length: 100}, (_, i) => (i - 50) / 10);
        // Variance depends on p if raw, but is stable if standardized
        // Standardized D_s has variance approx 2/p * correction? 
        // Actually, for simplicity in an educational widget:
        // Raw variance scales with sqrt(p) or p
        // Standardized variance is constant (approx 1.0)
        let sigma = mode === 'raw' ? Math.sqrt(voxels) / 5 : 1.0;
        
        const data = labels.map(x => {
            return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(x / sigma, 2));
        });

        chart.data.datasets[0].data = data;
        chart.update();
    };

    // Event Listeners
    rawBtn.addEventListener('click', () => {
        mode = 'raw';
        rawBtn.classList.add('active');
        cvmanovaBtn.classList.remove('active');
        updateEquation();
        updateDistribution();
    });

    cvmanovaBtn.addEventListener('click', () => {
        mode = 'cvmanova';
        cvmanovaBtn.classList.add('active');
        rawBtn.classList.remove('active');
        updateEquation();
        updateDistribution();
    });

    voxelSlider.addEventListener('input', (e) => {
        voxels = parseInt(e.target.value);
        voxelVal.textContent = voxels;
        updateVoxelGrid();
        updateDistribution();
    });

    // Initial Load
    initChart();
    updateVoxelGrid();
    updateEquation();
    updateDistribution();
});
