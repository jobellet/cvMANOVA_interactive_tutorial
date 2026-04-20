document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('heatmapContainer');
    const explanationArea = document.getElementById('explanationArea');
    const expectedToggle = document.getElementById('expectedToggle');

    const gridSize = 40; // 40x40 grid
    const margin = 0;
    let width, height, cellSize;

    // Data generation
    const data = [];
    const diagonal = []; // D1, D2
    const timePoints = Array.from({length: gridSize}, (_, i) => i * 50); // 0ms to 1950ms

    function generateData() {
        // 1. Generate diagonal values (signal peak around 500-1000ms)
        for (let i = 0; i < gridSize; i++) {
            const t = timePoints[i];
            // Signal strength: ramping up then sustaining
            let val = 0;
            if (t < 300) val = 0.1 * (t/300);
            else if (t < 800) val = 0.1 + 0.6 * (t-300)/500;
            else val = 0.7 - 0.2 * (t-800)/1150;
            
            // Add some noise
            diagonal[i] = val + (Math.random() - 0.5) * 0.05;
        }

        // 2. Generate matrix values
        for (let i = 0; i < gridSize; i++) {
            data[i] = [];
            for (let j = 0; j < gridSize; j++) {
                // Perfect stability base
                const e12 = Math.sqrt(Math.abs(diagonal[i] * diagonal[j])) * Math.sign(diagonal[i]) * Math.sign(diagonal[j]);
                
                // Real data: decay away from diagonal
                const delay = Math.abs(i - j);
                let decay = Math.exp(-delay / 15);
                
                // Add a "dynamic shift" area (e.g. between early 400ms and late 1200ms)
                let dynamicPenalty = 1.0;
                if ((i < 10 && j > 25) || (j < 10 && i > 25)) {
                    dynamicPenalty = 0.3; // Coding shift makes generalization fail
                }

                data[i][j] = e12 * decay * dynamicPenalty + (Math.random() - 0.5) * 0.02;
            }
        }
    }

    function resize() {
        const parentWidth = container.clientWidth - 40;
        const parentHeight = container.clientHeight - 40;
        const size = Math.min(parentWidth, parentHeight);
        
        canvas.width = size;
        canvas.height = size;
        width = size;
        height = size;
        cellSize = width / gridSize;
        draw();
    }

    function getColor(value, isExpected = false) {
        // value range approx 0 to 0.8
        const normalized = Math.max(0, Math.min(1, value / 0.8));
        
        if (isExpected) {
            // Greyscale or muted blue for expected?
            // Actually, let's use the same scale but maybe with a pattern or just toggle the whole view
            // The prompt says "overlay a theoretical null hypothesis"
        }

        // Interpolate between low (#0f172a), mid (#3b82f6), high (#f43f5e)
        let r, g, b;
        if (normalized < 0.5) {
            const t = normalized * 2;
            r = 15 + (59 - 15) * t;
            g = 23 + (130 - 23) * t;
            b = 42 + (246 - 42) * t;
        } else {
            const t = (normalized - 0.5) * 2;
            r = 59 + (244 - 59) * t;
            g = 130 + (63 - 130) * t;
            b = 246 + (94 - 246) * t;
        }
        return `rgb(${r}, ${g}, ${b})`;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const showExpected = expectedToggle.checked;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let val;
                if (showExpected) {
                    // Theoretical null: E12 = sqrt(D1*D2)
                    val = Math.sqrt(Math.abs(diagonal[i] * diagonal[j])) * Math.sign(diagonal[i]) * Math.sign(diagonal[j]);
                } else {
                    val = data[i][j];
                }

                ctx.fillStyle = getColor(val);
                // drawing with i as x (train) and j as y (test). 
                // In TimexTime matrices, usually (0,0) is bottom left or top left.
                // Let's go with top-left as (0,0), so Y axis is inverted for display (test time increases downwards)
                ctx.fillRect(i * cellSize, j * cellSize, cellSize + 0.5, cellSize + 0.5);
            }
        }

        // Draw diagonal highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height);
        ctx.stroke();
    }

    function handleHover(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 0 || x > width || y < 0 || y > height) return;

        const i = Math.floor(x / cellSize);
        const j = Math.floor(y / cellSize);

        if (i < 0 || i >= gridSize || j < 0 || j >= gridSize) return;

        const t1 = timePoints[i];
        const t2 = timePoints[j];
        const val = data[i][j];
        const d1 = diagonal[i];
        const d2 = diagonal[j];
        const e12 = Math.sqrt(Math.abs(d1 * d2)) * Math.sign(d1) * Math.sign(d2);

        updateTooltip(t1, t2, val, e12, i === j);
    }

    function updateTooltip(t1, t2, val, e12, isDiagonal) {
        let content = '';
        if (isDiagonal) {
            content = `
                <span class="hotspot-info">Main Diagonal: $t_1 = t_2 = ${t1}$ms</span>
                <p>This point represents <strong>stable maintenance</strong>. We are training and testing the model on the same time point.</p>
                <div class="stat-badge" style="margin-top: 10px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px;">
                    <span>Pattern Distinctness ($D$):</span>
                    <span style="font-weight: 800; color: var(--accent-primary);">${val.toFixed(3)}</span>
                </div>
            `;
        } else {
            const isStable = val > 0.7 * e12;
            content = `
                <span class="hotspot-info">Pattern Generalization: $t_1=${t1}$ms $\\to$ $t_2=${t2}$ms</span>
                <p>Training at $t_1$ and testing at $t_2$.</p>
                <div class="stat-badge" style="margin-top: 10px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px; display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Empirical Info:</span>
                        <span style="font-weight: 700;">${val.toFixed(3)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Expected ($E_{12}$):</span>
                        <span style="font-weight: 700; color: var(--text-secondary);">${e12.toFixed(3)}</span>
                    </div>
                </div>
                <p style="margin-top: 12px; font-size: 0.85rem;">
                    ${isStable 
                        ? '<span style="color: #4ade80;">✔ Representation is Stable.</span> Signal generalizes well, matching the expected stability.' 
                        : '<span class="pulse"></span><span style="color: #f43f5e; font-weight:700;">Code has Transformed.</span> The information is significantly lower than expected, indicating a dynamic change in the neural code.'}
                </p>
            `;
        }
        explanationArea.innerHTML = content;
        
        // Re-render math if any
        if (window.renderMathInElement) {
            window.renderMathInElement(explanationArea, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError : false
            });
        }
    }

    // Event Listeners
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleHover);
    expectedToggle.addEventListener('change', draw);

    // Initial load
    generateData();
    resize();
});
