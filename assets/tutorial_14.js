document.addEventListener('DOMContentLoaded', () => {
    const voxelGrid = document.getElementById('voxelGrid');
    const univariateBtn = document.getElementById('univariateBtn');
    const multivariateBtn = document.getElementById('multivariateBtn');
    const timelineSlider = document.getElementById('timelineSlider');
    const vizArea = document.getElementById('vizArea');
    const hotspot1 = document.getElementById('hotspot1');
    const bubble1 = document.getElementById('bubble1');
    const decodingBar = document.getElementById('decodingBar');
    const taskTooltip = document.getElementById('taskTooltip');
    const univariateOverlay = document.getElementById('univariateOverlay');

    let currentMode = 'univariate'; // or 'multivariate'
    let currentStep = 0; // 0: Rest, 1: Stim, 2: Maint, 3: Resp

    // Generate 36 voxels (6x6)
    const voxels = [];
    for (let i = 0; i < 36; i++) {
        const voxel = document.createElement('div');
        voxel.className = 'voxel';
        voxelGrid.appendChild(voxel);
        voxels.push(voxel);
    }

    // Pattern definitions (random but fixed for this session)
    const spatialPattern = voxels.map(() => Math.random() * 2 - 1);
    const pitchPattern = voxels.map(() => Math.random() * 2 - 1);

    function updateViz() {
        const step = parseInt(timelineSlider.value);
        currentStep = step;

        // Update timeline labels
        document.querySelectorAll('.timeline-step').forEach((s, idx) => {
            s.classList.toggle('active', idx === step);
        });

        // Hide/Show elements based on mode
        if (currentMode === 'univariate') {
            vizArea.classList.add('active-univariate');
            vizArea.classList.remove('active-multivariate');
            hotspot1.style.display = 'none';
            bubble1.style.display = 'none';
            taskTooltip.style.display = step === 2 ? 'block' : 'none';
            decodingBar.style.width = '5%';
        } else {
            vizArea.classList.remove('active-univariate');
            vizArea.classList.add('active-multivariate');
            hotspot1.style.display = step === 2 ? 'flex' : 'none';
            taskTooltip.style.display = 'none';
            decodingBar.style.width = step === 2 ? '95%' : '20%';
        }

        voxels.forEach((voxel, i) => {
            let opacity = 0.05;
            let color = 'rgba(255,255,255,0.05)';
            let scale = 1;

            if (step === 1) { // Stimulus - Auditory Cortex active in both
                opacity = 0.6;
                color = 'rgba(255, 255, 255, 0.4)';
                scale = 1.1;
            } else if (step === 2) { // Maintenance
                if (currentMode === 'univariate') {
                    // Univariate view: average signal difference
                    // Simulate a very faint uniform glow that cancels out
                    opacity = 0.15;
                    color = 'rgba(255, 255, 255, 0.15)';
                } else {
                    // Multivariate view: show pattern differences
                    // Let's assume we are showing the difference pattern
                    const diff = spatialPattern[i] - pitchPattern[i];
                    opacity = 0.3 + Math.abs(diff) * 0.5;
                    color = diff > 0 ? `rgba(59, 130, 246, ${opacity})` : `rgba(244, 63, 94, ${opacity})`;
                    scale = 0.8 + Math.abs(diff) * 0.4;
                }
            } else if (step === 3) { // Response
                opacity = 0.3;
                color = 'rgba(255, 255, 255, 0.2)';
            }

            voxel.style.background = color;
            voxel.style.transform = `scale(${scale})`;
            voxel.style.borderColor = step > 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)';
        });
    }

    // Event Listeners
    univariateBtn.addEventListener('click', () => {
        currentMode = 'univariate';
        univariateBtn.classList.add('active');
        multivariateBtn.classList.remove('active');
        updateViz();
    });

    multivariateBtn.addEventListener('click', () => {
        currentMode = 'multivariate';
        multivariateBtn.classList.add('active');
        univariateBtn.classList.remove('active');
        updateViz();
    });

    timelineSlider.addEventListener('input', updateViz);

    hotspot1.addEventListener('click', () => {
        const isVisible = bubble1.style.display === 'block';
        bubble1.style.display = isVisible ? 'none' : 'block';
    });

    // Initial run
    updateViz();
});
