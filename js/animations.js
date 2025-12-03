// Additional animations and effects

// Tilt effect for 3D cards
class TiltEffect {
    constructor(element) {
        this.element = element;
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.reverse = this.element.getAttribute('data-tilt-reverse') === 'true';
        
        this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
    
    handleMouseMove(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        
        const rotateY = ((x / this.width) - 0.5) * 20 * (this.reverse ? -1 : 1);
        const rotateX = ((y / this.height) - 0.5) * -20;
        
        this.element.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(10px)
        `;
        this.element.style.transition = 'transform 0.1s';
    }
    
    handleMouseLeave() {
        this.element.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateZ(0)
        `;
        this.element.style.transition = 'transform 0.5s ease';
    }
}

// Initialize tilt effect
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => new TiltEffect(el));
});

// Floating animation for elements
function initFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.float');
    
    floatingElements.forEach((el, index) => {
        const amplitude = parseFloat(el.getAttribute('data-float-amplitude')) || 20;
        const duration = parseFloat(el.getAttribute('data-float-duration')) || 3;
        const delay = index * 0.2;
        
        el.style.animation = `
            float ${duration}s ease-in-out ${delay}s infinite alternate
        `;
        
        // Add keyframes if not already present
        if (!document.querySelector('#float-keyframes')) {
            const style = document.createElement('style');
            style.id = 'float-keyframes';
            style.textContent = `
                @keyframes float {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-${amplitude}px); }
                }
            `;
            document.head.appendChild(style);
        }
    });
}

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.threshold = 0.1;
        
        this.init();
    }
    
    init() {
        if (!this.elements.length) return;
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                threshold: this.threshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-animate');
                const delay = element.getAttribute('data-animate-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add(`animate-${animation}`);
                    element.classList.add('animated');
                }, delay);
                
                this.observer.unobserve(element);
            }
        });
    }
}

// Gradient text animation
function initGradientText() {
    const gradientTexts = document.querySelectorAll('.text-gradient-animate');
    
    gradientTexts.forEach(text => {
        // Create gradient animation
        const colors = [
            '#6c63ff', '#00d4ff', '#ff6b9d', '#00d98b', '#6c63ff'
        ];
        
        let currentIndex = 0;
        
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % (colors.length - 1);
            text.style.background = `linear-gradient(90deg, 
                ${colors[currentIndex]}, 
                ${colors[nextIndex]}
            )`;
            text.style.webkitBackgroundClip = 'text';
            text.style.backgroundClip = 'text';
            currentIndex = nextIndex;
        }, 2000);
    });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFloatingAnimation();
    new ScrollAnimations();
    initGradientText();
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple styles
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyles);
});

// Page transition effect
function pageTransition(direction = 'fade') {
    const overlay = document.createElement('div');
    overlay.className = `page-transition page-transition-${direction}`;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    return new Promise(resolve => {
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                resolve();
            }, 500);
        }, 300);
    });
}

// Add page transition styles
const transitionStyles = document.createElement('style');
transitionStyles.textContent = `
    .page-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .page-transition.active {
        opacity: 1;
    }
    
    .page-transition-fade {
        background: var(--darker);
    }
    
    .page-transition-slide {
        background: var(--gradient-primary);
        transform: translateX(-100%);
        transition: transform 0.5s ease;
    }
    
    .page-transition-slide.active {
        transform: translateX(0);
    }
`;
document.head.appendChild(transitionStyles);

// Export functions for global access
window.pageTransition = pageTransition;
