document.addEventListener('DOMContentLoaded', () => {

    // 1. Search functionality
    const searchInput = document.getElementById('searchInput');
    const tiles = document.querySelectorAll('.tile:not(.coming-soon)');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        tiles.forEach(tile => {
            const heading = tile.querySelector('h2').textContent.toLowerCase();
            const text = tile.querySelector('p').textContent.toLowerCase();
            const keywords = tile.getAttribute('data-keywords') || '';

            if (heading.includes(query) || text.includes(query) || keywords.includes(query)) {
                tile.classList.remove('hidden');
            } else {
                tile.classList.add('hidden');
            }
        });
    });

    // 2. Mouse tracking for the premium tile hover glow effect
    document.getElementById('tutorialGrid').onmousemove = e => {
        for(const tile of document.getElementsByClassName('tile')) {
            const rect = tile.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

            tile.style.setProperty('--mouse-x', `${x}px`);
            tile.style.setProperty('--mouse-y', `${y}px`);
        }
    };
});
