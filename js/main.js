// Main JavaScript File for VortexSpace Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingScreen();
    initThemeToggle();
    initNavigation();
    initScrollProgress();
    initTypingEffect();
    initCounters();
    initServiceCards();
    initContactForm();
    initBackToTop();
    initModal();
    initAnimations();
    initMobileMenu();
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading delay
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.classList.toggle('light-theme', savedTheme === 'light');
    
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('light-theme');
        
        // Save preference
        const currentTheme = html.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        
        // Trigger theme change event
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: currentTheme }
        }));
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Update active nav on scroll
    function updateActiveNav() {
        let scrollPosition = window.scrollY + 100;
        
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
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Start project button
    const startProjectBtn = document.getElementById('startProjectBtn');
    if (startProjectBtn) {
        startProjectBtn.addEventListener('click', () => {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle body scroll
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!scrollProgress) return;
    
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial update
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    
    if (!typingElement) return;
    
    const texts = [
        "цифровых решений",
        "искусственного интеллекта",
        "блокчейн технологий",
        "иммерсивного опыта"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
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
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target + (counter.getAttribute('data-count').includes('%') ? '%' : '+');
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + (counter.getAttribute('data-count').includes('%') ? '%' : '+');
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== SERVICE CARDS =====
function initServiceCards() {
    const serviceButtons = document.querySelectorAll('.btn-service-more');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            showServiceModal(service);
        });
    });
    
    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.service) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        // In a real application, you would send data to a server here
        setTimeout(() => {
            alert(`Спасибо, ${data.name}! Мы получили вашу заявку на услугу "${data.service}". Мы свяжемся с вами по email ${data.email} в течение 24 часов.`);
            
            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Заявка успешно отправлена!', 'success');
        }, 1500);
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
    
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Initial check
}

// ===== MODAL =====
function initModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    
    if (!modal || !modalClose) return;
    
    // Close modal
    modalClose.addEventListener('click', () => {
        closeModal();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function showServiceModal(service) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const serviceData = {
        ai: {
            title: 'AI & Машинное обучение',
            description: 'Разработка систем искусственного интеллекта для автоматизации бизнес-процессов, анализа данных и принятия решений.',
            features: [
                'Predictive Analytics - прогнозная аналитика для бизнеса',
                'NLP Обработка - анализ текста и голосовых команд',
                'Computer Vision - распознавание изображений и видео',
                'Рекомендательные системы',
                'Автоматизация процессов'
            ],
            duration: 'от 3 месяцев',
            price: 'от 500 000 ₽'
        },
        web3: {
            title: 'Web3 & Блокчейн',
            description: 'Создание децентрализованных приложений, смарт-контрактов и NFT решений.',
            features: [
                'dApps Разработка - децентрализованные приложения',
                'DeFi Платформы - финансовая экосистема',
                'NFT Маркетплейсы - создание и торговля NFT',
                'Смарт-контракты',
                'Блокчейн интеграция'
            ],
            duration: 'от 4 месяцев',
            price: 'от 750 000 ₽'
        },
        vr: {
            title: 'VR/AR Разработка',
            description: 'Создание иммерсивных решений в виртуальной и дополненной реальности.',
            features: [
                'Виртуальные туры и симуляции',
                'AR Приложения для бизнеса',
                'Метавселенные - виртуальные пространства',
                'Образовательные VR платформы',
                'Игровые VR проекты'
            ],
            duration: 'от 2 месяцев',
            price: 'от 300 000 ₽'
        },
        cyber: {
            title: 'Кибербезопасность',
            description: 'Полный цикл защиты данных и инфраструктуры от современных киберугроз.',
            features: [
                'Аудит безопасности системы',
                'Защита от DDoS атак',
                'Шифрование данных и коммуникаций',
                'Мониторинг безопасности 24/7',
                'Обучение сотрудников'
            ],
            duration: 'от 1 месяца',
            price: 'от 200 000 ₽'
        }
    };
    
    const data = serviceData[service];
    
    if (!data) return;
    
    modalBody.innerHTML = `
        <h3>${data.title}</h3>
        <p class="modal-description">${data.description}</p>
        
        <div class="modal-features">
            <h4>Что входит в услугу:</h4>
            <ul>
                ${data.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-details">
            <div class="detail">
                <span class="detail-label">Сроки:</span>
                <span class="detail-value">${data.duration}</span>
            </div>
            <div class="detail">
                <span class="detail-label">Стоимость:</span>
                <span class="detail-value">${data.price}</span>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn btn-primary" onclick="document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }); closeModal();">
                <i class="fas fa-paper-plane"></i> Оставить заявку
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Initialize Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .project-card, .tech-category, .stat'
    );
    
    animateElements.forEach(el => observer.observe(el));
    
    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== UTILITY FUNCTIONS =====
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

// Export functions for global access
window.showServiceModal = showServiceModal;
window.closeModal = closeModal;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--dark-light);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius);
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        max-width: 400px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 9999;
        box-shadow: var(--shadow-lg);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-success {
        border-left: 4px solid var(--success);
    }
    
    .notification-info {
        border-left: 4px solid var(--primary);
    }
    
    .notification-warning {
        border-left: 4px solid var(--warning);
    }
    
    .notification-error {
        border-left: 4px solid var(--danger);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-success .notification-content i {
        color: var(--success);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--light);
    }
`;

document.head.appendChild(notificationStyles);
