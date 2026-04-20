const canvas = document.getElementById('scatterPlot');
const ctx = canvas.getContext('2d');
const noiseCorrInput = document.getElementById('noise-corr');
const v2VarInput = document.getElementById('v2-var');
const corrValDisp = document.getElementById('corr-val');
const varValDisp = document.getElementById('var-val');
const distEuclideanDisp = document.getElementById('dist-euclidean');
const distMahalDisp = document.getElementById('dist-mahal');
const interpretationText = document.getElementById('interpretation-text');

// State
let width, height;
let pointsA = [];
let pointsB = [];
const numPoints = 100;
const signalDifference = 1.0; 

function init() {
    resize();
    window.addEventListener('resize', resize);
    
    noiseCorrInput.addEventListener('input', update);
    v2VarInput.addEventListener('input', update);
    
    generateBasePoints();
    update();
}

function resize() {
    const parent = canvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    update(); // Redraw on resize
}

function generateBasePoints() {
    pointsA = [];
    pointsB = [];
    for (let i = 0; i < numPoints; i++) {
        pointsA.push({ x: randn(), y: randn() });
        pointsB.push({ x: randn(), y: randn() });
    }
}

function randn() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function update() {
    const rho = parseFloat(noiseCorrInput.value);
    const sigma2_sq = parseFloat(v2VarInput.value);
    const sigma2 = Math.sqrt(sigma2_sq);
    const sigma1 = 1.0; 

    corrValDisp.textContent = rho.toFixed(2);
    varValDisp.textContent = sigma2_sq.toFixed(1);

    const cov = [
        [sigma1 * sigma1, rho * sigma1 * sigma2],
        [rho * sigma1 * sigma2, sigma2 * sigma2]
    ];

    // L from Cholesky
    const L = [
        [sigma1, 0],
        [rho * sigma2, sigma2 * Math.sqrt(Math.max(0, 1 - rho * rho))]
    ];

    draw(L, cov, rho, sigma2_sq);
    calculateDistances(cov, rho);
}

function calculateDistances(cov, rho) {
    const muA = [-signalDifference / 2, 0];
    const muB = [signalDifference / 2, 0];
    const diff = [muB[0] - muA[0], muB[1] - muA[1]];

    // Euclidean
    const distE = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);
    distEuclideanDisp.textContent = distE.toFixed(2);

    // Mahalanobis
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
    const invCov = [
        [cov[1][1] / det, -cov[0][1] / det],
        [-cov[1][0] / det, cov[0][0] / det]
    ];

    const m0 = diff[0] * invCov[0][0] + diff[1] * invCov[1][0];
    const m1 = diff[0] * invCov[0][1] + diff[1] * invCov[1][1];
    const distM = Math.sqrt(diff[0] * m0 + diff[1] * m1);
    
    distMahalDisp.textContent = distM.toFixed(2);

    // Update interpretation
    if (rho > 0.8) {
        interpretationText.innerHTML = `<strong>High Correlation:</strong> Notice how the two clusters significantly overlap along the main axis of noise. Euclidean distance (1.00) is 'blinded' by this shared variance. Mahalanobis geometry performs <strong>spatial prewhitening</strong>, rotating and stretching the space to reveal the true signal.`;
    } else if (rho < 0.2) {
        interpretationText.innerHTML = `<strong>Low Correlation:</strong> When noise is independent, Euclidean and Mahalanobis distances are similar. In this state, voxels contribute equally to the distance calculation.`;
    } else {
        interpretationText.innerHTML = `The purple ellipse shows the noise covariance (\(\Sigma\)). cvMANOVA uses the inverted residuals (\(\Sigma^{-1}\)) to down-weight noisy directions, effectively "prewhitening" the data before distance calculation.`;
    }
}

function draw(L, cov, rho, sigma2_sq) {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / 8;

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for(let i = -10; i <= 10; i++) {
        ctx.beginPath(); ctx.moveTo(centerX + i*scale, 0); ctx.lineTo(centerX + i*scale, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, centerY + i*scale); ctx.lineTo(width, centerY + i*scale); ctx.stroke();
    }

    const muA = [-signalDifference / 2, 0];
    const muB = [signalDifference / 2, 0];

    const transform = (p, mu) => ({
        x: centerX + (L[0][0] * p.x + L[0][1] * p.y + mu[0]) * scale,
        y: centerY - (L[1][0] * p.x + L[1][1] * p.y + mu[1]) * scale
    });

    // Draw Points A
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#22d3ee';
    pointsA.forEach(p => {
        const pt = transform(p, muA);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI*2); ctx.fill();
    });

    // Draw Points B
    ctx.fillStyle = '#fb7185';
    pointsB.forEach(p => {
        const pt = transform(p, muB);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Draw Ellipse (centered at muB for visualization)
    drawEllipse(centerX + muB[0]*scale, centerY - muB[1]*scale, cov, scale);

    // Draw Vector
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX + muA[0]*scale, centerY - muA[1]*scale);
    ctx.lineTo(centerX + muB[0]*scale, centerY - muB[1]*scale);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawEllipse(cx, cy, cov, scale) {
    const trace = cov[0][0] + cov[1][1];
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
    const gap = Math.sqrt(Math.max(0, trace * trace / 4 - det));
    
    const l1 = trace / 2 + gap;
    const l2 = trace / 2 - gap;

    let vx = cov[0][1];
    let vy = l1 - cov[0][0];
    if (Math.abs(cov[0][1]) < 1e-10) { vx = 1; vy = 0; }
    
    const angle = Math.atan2(vy, vx);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-angle);
    
    ctx.strokeStyle = '#a5b4fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.sqrt(l1)*2*scale, Math.sqrt(l2)*2*scale, 0, 0, Math.PI*2);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(165, 180, 252, 0.1)';
    ctx.fill();
    ctx.restore();
}

init();
