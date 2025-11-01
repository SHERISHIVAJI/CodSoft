document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('main-nav');

    const updateNavbarOnScroll = () => {
        if(window.scrollY > 100) {
            navbar.style.backgroundColor = 'var(--secondary-color)';
            navbar.classList.add('shadow');
        } else {
            navbar.style.backgroundColor = 'rgba(26, 26, 46, 0.98)';
            navbar.classList.remove('shadow');
        }
    };
    window.addEventListener('scroll', updateNavbarOnScroll);
    updateNavbarOnScroll();
})