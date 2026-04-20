document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('regressionChart').getContext('2d');
    const ageSlider = document.getElementById('ageSlider');
    const ageLabel = document.getElementById('ageLabel');
    const rValDisplay = document.getElementById('rVal');
    const pValDisplay = document.getElementById('pVal');
    const groupBtns = document.querySelectorAll('.toggle-btn');
    
    let currentGroup = 'controls';
    let currentAgeFocus = 60;
    let chart;

    // Data generation parameters
    const N = 24; // Sample size
    const xMax = 120;
    const yMax = 0.5;

    // Stats from paper
    const stats = {
        controls: { r: 0.354, p: '0.058', color: '#3b82f6' },
        hsam: { r: 0.652, p: '0.040', color: '#8b5cf6' }
    };

    function generateData(r, group) {
        const data = [];
        // simple LCG for reproducibility
        let seed = group === 'controls' ? 42 : 123;
        const random = () => {
            seed = (seed * 1664525 + 1013904223) % 4294967296;
            return seed / 4294967296;
        };

        const targetR = r;
        const n = N;
        
        // Generate correlated variables using Cholesky-like approach
        // X is uniform across the range + jitter
        // Z is independent noise
        // Y = targetR * X_std + sqrt(1 - targetR^2) * Z
        
        for (let i = 0; i < n; i++) {
            const xRaw = (i / (n - 1)) * xMax;
            const xJitter = (random() - 0.5) * 10;
            const x = Math.max(1, Math.min(xMax, xRaw + xJitter));
            
            // Standardize X for the math
            const xStd = (x - xMax / 2) / (xMax / 4);
            const z = (random() - 0.5) * 2.5; // noise
            
            let yStd = targetR * xStd + Math.sqrt(1 - targetR * targetR) * z;
            
            // Map to D scale
            let y = (yStd * 0.08) + 0.12;
            
            // Adjust for HSAM to show higher D overall as they are "superior"
            if (group === 'hsam') {
                y += 0.05;
            }

            data.push({ x: x, y: Math.max(-0.05, y) });
        }
        return data;
    }


    function getRegressionLine(data) {
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        data.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumXX += p.x * p.x;
        });
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return [
            { x: 0, y: intercept },
            { x: xMax, y: slope * xMax + intercept }
        ];
    }

    function initChart() {
        const groupStats = stats[currentGroup];
        const dataPoints = generateData(groupStats.r, currentGroup);
        const regLine = getRegressionLine(dataPoints);

        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Individual Participants',
                        data: dataPoints,
                        backgroundColor: groupStats.color + 'cc',
                        borderColor: groupStats.color,
                        borderWidth: 1,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        zIndex: 2
                    },
                    {
                        label: 'Linear Trend',
                        data: regLine,
                        type: 'line',
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        zIndex: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Temporal Distance between Older and Newer Memories (Months)',
                            color: '#94a3b8',
                            font: { size: 12, weight: '600' }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' },
                        min: 0,
                        max: 130
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Pattern Distinctness (D) in the left vmPFC',
                            color: '#94a3b8',
                            font: { size: 12, weight: '600' }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' },
                        min: -0.1,
                        max: 0.5
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: (context) => `D = ${context.parsed.y.toFixed(3)} at ${context.parsed.x.toFixed(1)} months`
                        }
                    }
                }
            }
        });
    }

    function updateVisualization() {
        const groupStats = stats[currentGroup];
        const dataPoints = generateData(groupStats.r, currentGroup);
        const regLine = getRegressionLine(dataPoints);

        rValDisplay.textContent = groupStats.r.toFixed(3);
        pValDisplay.textContent = groupStats.p;

        chart.data.datasets[0].backgroundColor = groupStats.color + 'cc';
        chart.data.datasets[0].borderColor = groupStats.color;
        chart.data.datasets[0].data = dataPoints;
        chart.data.datasets[1].data = regLine;
        
        chart.update();
    }

    // Event Listeners
    groupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            groupBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGroup = btn.dataset.group;
            updateVisualization();
        });
    });

    ageSlider.addEventListener('input', (e) => {
        currentAgeFocus = e.target.value;
        ageLabel.textContent = `${currentAgeFocus} Months`;
        
        // Visual cue: emphasize points near currentAgeFocus
        const highlightColor = stats[currentGroup].color;
        chart.data.datasets[0].pointRadius = chart.data.datasets[0].data.map(p => {
            const dist = Math.abs(p.x - currentAgeFocus);
            return dist < 15 ? 10 : 6;
        });
        chart.data.datasets[0].pointBackgroundColor = chart.data.datasets[0].data.map(p => {
            const dist = Math.abs(p.x - currentAgeFocus);
            return dist < 15 ? '#fff' : highlightColor + 'cc';
        });
        chart.update('none'); // silent update
    });

    initChart();
});
