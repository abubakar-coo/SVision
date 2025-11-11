// Scroll to Top Button
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollToTop = document.createElement('button');
    scrollToTop.id = 'scrollToTop';
    scrollToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollToTop.setAttribute('aria-label', 'Scroll to top');
    
    // Append to body
    document.body.appendChild(scrollToTop);
    
    // Show/Hide button based on scroll position
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        // Calculate how much of the page has been scrolled (percentage)
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        // Show button only when user has scrolled to bottom 30% of the page
        if (scrollPercent > 70) {
            scrollToTop.classList.add('show');
        } else {
            scrollToTop.classList.remove('show');
        }
    });
    
    // Scroll to top with smooth animation
    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

