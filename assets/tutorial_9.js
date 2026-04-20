document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const distanceSlider = document.getElementById('distanceSlider');
    const noiseSlider = document.getElementById('noiseSlider');
    const trialsSlider = document.getElementById('trialsSlider');
    
    const distanceVal = document.getElementById('distanceVal');
    const noiseVal = document.getElementById('noiseVal');
    const trialsVal = document.getElementById('trialsVal');
    
    const svmAccLabel = document.getElementById('svmAccLabel');
    const dMetricLabel = document.getElementById('dMetricLabel');
    
    // Chart Objects
    let scatterChart;
    let metricsChart;
    
    // Simulation Parameters
    const params = {
        distance: 1.5,
        noise: 1.0,
        trials: 20
    };

    // Helper: Box-Muller transform for normal distribution
    function randn_bm() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    // Normal CDF function (approximation)
    function normalCDF(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x >= 0 ? 1 - p : p;
    }

    function initCharts() {
        // Scatter Plot Template
        const scatterCtx = document.getElementById('scatterChart').getContext('2d');
        scatterChart = new Chart(scatterCtx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Class A',
                        data: [],
                        backgroundColor: 'rgba(248, 113, 113, 0.6)',
                        pointRadius: 4
                    },
                    {
                        label: 'Class B',
                        data: [],
                        backgroundColor: 'rgba(96, 165, 250, 0.6)',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 400 },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false }, min: -5, max: 5 },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false }, min: -5, max: 5 }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Metrics Plot Template
        const metricsCtx = document.getElementById('metricsChart').getContext('2d');
        metricsChart = new Chart(metricsCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 40}, (_, i) => (i + 1) * 5),
                datasets: [
                    {
                        label: 'SVM Accuracy (%)',
                        data: [],
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        yAxisID: 'yAccuracy',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 0
                    },
                    {
                        label: 'cvMANOVA D',
                        data: [],
                        borderColor: '#60a5fa',
                        backgroundColor: 'transparent',
                        yAxisID: 'yD',
                        tension: 0.1,
                        borderWidth: 3,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { 
                        title: { display: true, text: 'No. of Trials', color: '#94a3b8' },
                        grid: { display: false },
                    },
                    yAccuracy: {
                        position: 'left',
                        min: 40,
                        max: 105,
                        title: { display: true, text: 'Accuracy %', color: '#f87171' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    yD: {
                        position: 'right',
                        min: 0,
                        suggestedMax: 10,
                        title: { display: true, text: 'Pattern Distinctness (D)', color: '#60a5fa' },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function updateSimulation() {
        const { distance, noise, trials } = params;
        const sigma = Math.sqrt(noise);
        
        // Update Scatter Data
        // We show up to 100 points max to keep performance high
        const displayTrials = Math.min(trials, 50);
        const dataA = [];
        const dataB = [];
        
        for(let i=0; i<displayTrials; i++) {
            dataA.push({
                x: -distance/2 + randn_bm() * sigma,
                y: randn_bm() * sigma
            });
            dataB.push({
                x: distance/2 + randn_bm() * sigma,
                y: randn_bm() * sigma
            });
        }
        
        scatterChart.data.datasets[0].data = dataA;
        scatterChart.data.datasets[1].data = dataB;
        scatterChart.update('none');

        // Calculate current metrics for the labels
        // SVM theoretical Accuracy with finite samples:
        // SNR = distance / sigma
        // For SVM, as N increases, accuracy reaches the Bayes limit
        // Bayes limit = normalCDF(distance / (2 * sigma))
        // Finite trial effect adds an "uncertainty" term proportional to 1/sqrt(N)
        const snr = distance / sigma;
        const bayesAcc = normalCDF(snr / 2);
        
        // Heuristic for SVM accuracy scaling with N
        // Accuracy saturates much faster when distance is high
        const speed = 15 + (1 / (snr + 0.1)) * 50;
        const accHeuristic = 0.5 + (bayesAcc - 0.5) * (1 - Math.exp(-trials / speed));
        const currentAccDisplay = (accHeuristic * 100).toFixed(1);
        
        // cvMANOVA D is the true squared distance (unbiased)
        const currentD = (snr * snr).toFixed(2);
        
        svmAccLabel.innerText = `${currentAccDisplay}%`;
        // Glow effect if near 100%
        if (parseFloat(currentAccDisplay) >= 99.5) {
            svmAccLabel.style.textShadow = '0 0 20px rgba(248, 113, 113, 0.8)';
            svmAccLabel.innerText = "100%";
        } else {
            svmAccLabel.style.textShadow = 'none';
        }
        
        dMetricLabel.innerText = currentD;

        // Update Metrics Chart curves
        const trialSequence = Array.from({length: 40}, (_, i) => (i + 1) * 5);
        const accData = trialSequence.map(N => {
            const acc = 0.5 + (bayesAcc - 0.5) * (1 - Math.exp(-N / speed));
            return Math.min(100, acc * 100);
        });
        const dData = trialSequence.map(N => {
            return snr * snr;
        });

        metricsChart.data.datasets[0].data = accData;
        metricsChart.data.datasets[1].data = dData;
        
        // Dynamically adjust yD scale suggest max
        metricsChart.options.scales.yD.max = Math.max(10, Math.ceil(snr * snr * 1.5));
        
        metricsChart.update('none');
    }

    // Slider Event Listeners
    distanceSlider.addEventListener('input', (e) => {
        params.distance = parseFloat(e.target.value);
        distanceVal.innerText = params.distance.toFixed(1);
        updateSimulation();
    });

    noiseSlider.addEventListener('input', (e) => {
        params.noise = parseFloat(e.target.value);
        noiseVal.innerText = params.noise.toFixed(1);
        updateSimulation();
    });

    trialsSlider.addEventListener('input', (e) => {
        params.trials = parseInt(e.target.value);
        trialsVal.innerText = params.trials;
        updateSimulation();
    });

    // Initialize
    initCharts();
    updateSimulation();
});
