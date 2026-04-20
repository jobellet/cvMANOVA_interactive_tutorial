document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const voxelsSlider = document.getElementById('voxelsSlider');
    const trialsSlider = document.getElementById('trialsSlider');
    const effectSlider = document.getElementById('effectSlider');
    
    const voxelsVal = document.getElementById('voxelsVal');
    const trialsVal = document.getElementById('trialsVal');
    const effectVal = document.getElementById('effectVal');
    
    const powerVal = document.getElementById('powerVal');
    const seVal = document.getElementById('seVal');
    const rankWarning = document.getElementById('rankWarning');
    
    // Chart Initialization
    const ctx = document.getElementById('distChart').getContext('2d');
    
    const chartData = {
        labels: [],
        datasets: [
            {
                label: 'Null Distribution (H0)',
                data: [],
                borderColor: 'rgba(148, 163, 184, 0.5)',
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'True Effect (H1)',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }
        ]
    };

    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#94a3b8', font: { family: 'Outfit' } }
                },
                tooltip: { enabled: false }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Estimated Pattern Distinctness (D̂)', color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b' }
                },
                y: {
                    display: false,
                    grid: { display: false }
                }
            },
            animation: { duration: 400 }
        }
    };

    const distChart = new Chart(ctx, config);

    // Distribution Logic
    function normalPDF(x, mean, std) {
        return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
    }

    // Standard normal CDF approximation
    function normalCDF(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        if (x > 0) p = 1 - p;
        return p;
    }

    function calculatePower(criticalValue, meanH1, std) {
        // Z-score for criticalValue under H1 distribution
        const z = (criticalValue - meanH1) / std;
        // Area to the right of z
        return 1 - normalCDF(z);
    }

    function updateSimulation() {
        const p = parseInt(voxelsSlider.value);
        const n = parseInt(trialsSlider.value);
        const dTrue = parseFloat(effectSlider.value);
        
        voxelsVal.textContent = p;
        trialsVal.textContent = n;
        effectVal.textContent = dTrue.toFixed(1);

        // Simulation parameters
        // Rule: Variance scales with p, decreases with n
        // Simplified: var = p / (n * 50) - adding a scaling factor to make it visual
        const std = Math.sqrt(p / (n * 10));
        const se = std;
        seVal.textContent = se.toFixed(2);

        // Rank-deficiency check
        const dfError = n - 1;
        const limit = dfError * 0.9;
        if (p > limit) {
            rankWarning.style.display = 'flex';
        } else {
            rankWarning.style.display = 'none';
        }

        // Generate Chart Data
        const step = 0.1;
        const xMin = -3;
        const xMax = Math.max(dTrue + 3 * std, 5);
        const xValues = [];
        const yH0 = [];
        const yH1 = [];

        for (let x = xMin; x <= xMax; x += step) {
            xValues.push(x.toFixed(1));
            yH0.push(normalPDF(x, 0, std));
            yH1.push(normalPDF(x, dTrue, std));
        }

        // Calculate Critical Value (95th percentile of H0)
        // Z-score for 95% is ~1.645
        const criticalValue = 1.645 * std;
        const power = calculatePower(criticalValue, dTrue, std);
        powerVal.textContent = (power * 100).toFixed(0) + '%';
        
        // Color based on power
        if (power < 0.5) powerVal.style.color = '#ef4444';
        else if (power < 0.8) powerVal.style.color = '#f59e0b';
        else powerVal.style.color = '#10b981';

        distChart.data.labels = xValues;
        distChart.data.datasets[0].data = yH0;
        distChart.data.datasets[1].data = yH1;
        distChart.update();
    }

    // Event Listeners
    [voxelsSlider, trialsSlider, effectSlider].forEach(slider => {
        slider.addEventListener('input', updateSimulation);
    });

    // Initial Run
    updateSimulation();
});
