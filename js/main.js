/**
 * FinanceWise - Main JavaScript File
 * Handles interactive elements and functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            this.classList.toggle('active');
        });
    }
    
    // Sticky header functionality
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;
        
        if (currentScrollPosition > headerHeight) {
            if (currentScrollPosition > lastScrollPosition) {
                // Scrolling down
                header.style.transform = `translateY(-${headerHeight}px)`;
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollPosition = currentScrollPosition;
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            
            if (email) {
                // In a real implementation, you'd send this to your server
                console.log('Newsletter signup:', email);
                
                // Show success message
                const formNote = this.nextElementSibling;
                if (formNote && formNote.classList.contains('form-note')) {
                    formNote.textContent = 'Thank you for subscribing!';
                    formNote.style.color = '#4CAF50';
                }
                
                // Reset form
                this.reset();
                
                // Reset message after 3 seconds
                setTimeout(() => {
                    if (formNote) {
                        formNote.textContent = 'We respect your privacy. Unsubscribe at any time.';
                        formNote.style.color = '';
                    }
                }, 3000);
            }
        });
    }