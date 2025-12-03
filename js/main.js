// Main JavaScript for AdVortex - Optimized for all devices

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initLoadingScreen();
    initMobileMenu();
    initNavigation();
    initCounters();
    initScrollAnimations();
    initBackToTop();
    initContactButtons();
    
    // Add loaded class to body for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.style.display = 'none';
                }
            }, 500);
        }, 500);
    });
    
    // Fallback in case load event doesn't fire
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2000);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuBtn || !navMenu) return;
    
    // Toggle menu
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Close on window resize (if resized to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (menuBtn) menuBtn.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Scroll to section
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Update active nav on scroll
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttle scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                updateActiveNav();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // Initial update
    updateActiveNav();
}

// ===== COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 1500;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.service-card, .tech-item, .contact-card, .stat-card'
    );
    
    if (!animateElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Throttle scroll event
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                toggleBackToTop();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // Initial check
    toggleBackToTop();
}

// ===== CONTACT BUTTONS =====
function initContactButtons() {
    // Add click tracking for contact buttons
    const contactButtons = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"], a[href*="t.me"]');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contactType = this.href.includes('tel:') ? 'phone' :
                              this.href.includes('mailto:') ? 'email' :
                              this.href.includes('t.me') ? 'telegram' : 'other';
            
            // You can add analytics here
            console.log(`Contact button clicked: ${contactType}`);
        });
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for resize events
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== SERVICE CARDS HOVER EFFECT =====
function initServiceCardsHover() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Only on desktop
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Initialize service cards hover on desktop
if (window.innerWidth > 768) {
    initServiceCardsHover();
}

// Re-initialize on resize
window.addEventListener('resize', debounce(function() {
    if (window.innerWidth > 768) {
        initServiceCardsHover();
    }
}, 250));

// ===== ADDITIONAL MOBILE OPTIMIZATIONS =====
// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add touch feedback for buttons
document.addEventListener('touchstart', function() {}, {passive: true});

// ===== ERROR HANDLING =====
// Global error handler
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
});

// ===== POLYFILLS FOR OLDER BROWSERS =====
// Intersection Observer polyfill if needed
if (!('IntersectionObserver' in window)) {
    // Load polyfill or fallback
    console.warn('IntersectionObserver not supported, using fallback');
    
    // Fallback for counters
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        counter.textContent = target;
    });
}

// ===== INITIALIZE ON LOAD =====
// Call initialization functions
window.addEventListener('load', function() {
    // Add loaded class for CSS transitions
    document.body.classList.add('page-loaded');
    
    // Initialize any remaining features
    initServiceCardsHover();
});
// Обновите функцию initLoadingScreen в существующем main.js:

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen when everything is loaded
    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.style.display = 'none';
            }
            
            // Start entrance animations
            startEntranceAnimations();
        }, 500);
    }
    
    // Start entrance animations for elements
    function startEntranceAnimations() {
        // Add animated class to body
        document.body.classList.add('page-loaded');
        
        // Initialize scroll animations
        initScrollAnimations();
        
        // Start counter animations
        initCounters();
    }
    
    // Wait for page to load
    if (document.readyState === 'complete') {
        setTimeout(hideLoadingScreen, 800);
    } else {
        window.addEventListener('load', () => {
            setTimeout(hideLoadingScreen, 800);
        });
    }
    
    // Fallback timeout
    setTimeout(hideLoadingScreen, 2000);
}

// ===== SCROLL ANIMATIONS (обновленная) =====
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
    );
    
    if (!animateElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add delay based on element type
                const delay = element.classList.contains('service-card') ? 
                    Array.from(element.parentNode.children).indexOf(element) * 0.1 : 0;
                
                setTimeout(() => {
                    element.classList.add('animated');
                }, delay * 1000);
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS FOR ANIMATIONS =====
function initAnimationPerformance() {
    // Detect device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPower = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Reduce animation intensity on mobile/low-power devices
    if (isMobile || isLowPower) {
        const animatedElements = document.querySelectorAll(
            '.gradient-circle, .gradient-circle-2, .pulse-dots .dot'
        );
        
        animatedElements.forEach(el => {
            el.style.animationDuration = '40s';
            el.style.opacity = '0.6';
        });
        
        // Disable floating cards on touch devices
        document.querySelectorAll('.floating-card').forEach(card => {
            card.style.animation = 'none';
        });
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        disableAnimations();
    }
    
    // Listen for changes in preference
    prefersReducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            disableAnimations();
        }
    });
}

function disableAnimations() {
    // Disable all CSS animations and transitions
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
        }
        
        .gradient-circle,
        .gradient-circle-2,
        .pulse-dots {
            display: none !important;
        }
        
        .service-card,
        .contact-card,
        .tech-item {
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== THROTTLE SCROLL EVENT FOR PERFORMANCE =====
function initScrollThrottle() {
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveNav();
                toggleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ===== PAUSE ANIMATIONS WHEN TAB IS INACTIVE =====
function initVisibilityHandler() {
    let isHidden = false;
    
    function handleVisibilityChange() {
        if (document.hidden) {
            // Tab is inactive - pause animations
            document.body.classList.add('paused-animations');
            isHidden = true;
        } else if (isHidden) {
            // Tab is active again - resume animations
            document.body.classList.remove('paused-animations');
            isHidden = false;
        }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add CSS for paused animations
    const style = document.createElement('style');
    style.textContent = `
        .paused-animations .gradient-circle,
        .paused-animations .gradient-circle-2,
        .paused-animations .pulse-dots .dot,
        .paused-animations .logo-icon,
        .paused-animations .floating-card {
            animation-play-state: paused !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== ANIMATION FRAME OPTIMIZATION =====
function initAnimationFrameOptimization() {
    // Use requestAnimationFrame for smooth animations
    let lastTime = 0;
    
    function animate(time) {
        const delta = time - lastTime;
        
        if (delta > 16) { // ~60fps
            // Update animations here if needed
            lastTime = time;
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation loop only on desktop
    if (window.innerWidth > 768) {
        requestAnimationFrame(animate);
    }
}

// ===== UPDATE INIT FUNCTION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initLoadingScreen();
    initMobileMenu();
    initNavigation();
    initScrollThrottle();
    initAnimationPerformance();
    initVisibilityHandler();
    initAnimationFrameOptimization();
    initContactButtons();
    
    // Add loaded class to body for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== TOUCH DEVICE OPTIMIZATIONS =====
function initTouchOptimizations() {
    // Prevent context menu on long press for buttons
    const buttons = document.querySelectorAll('.btn, .nav-link');
    buttons.forEach(btn => {
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    });
    
    // Add active states for touch feedback
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Improve touch scrolling performance
    document.documentElement.style.touchAction = 'manipulation';
}

// Add to initialization
document.addEventListener('DOMContentLoaded', initTouchOptimizations);
