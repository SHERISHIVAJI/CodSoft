//Animate Skill Bars on Scroll
const bars = document.querySelectorAll('.bar');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.computedStyleMap.width = width;
        }
    });
}, {threshold: 0.5});

bars.forEach(bar => observer.observe(bar));