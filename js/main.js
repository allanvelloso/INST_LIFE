/**
 * MAIN.JS - Arquivo JavaScript principal
 * Coordena todas as funcionalidades do site e inicializa os módulos
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Instituto Life - Site carregado com sucesso!');
    
    // Inicializar todos os módulos
    initializeModules();
    
    // Configurar scroll suave
    setupSmoothScroll();
    
    // Configurar animações on scroll
    setupScrollAnimations();
    
    // Configurar contador de números com delay
    setTimeout(() => {
        setupCounterAnimation();
    }, 1000);
    
    // Configurar lazy loading de imagens
    setupLazyLoading();
    
    console.log('✅ Todas as funcionalidades inicializadas');
});

/**
 * Inicializa todos os módulos do site
 */
function initializeModules() {
    // Verificar se os módulos existem antes de inicializar
    if (typeof initializeHeader === 'function') {
        initializeHeader();
    }
    
    if (typeof initializeHome === 'function') {
        initializeHome();
    }
    
    if (typeof initializeContact === 'function') {
        initializeContact();
    }
}

/**
 * Configura scroll suave para links internos
 */
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const nav = document.querySelector('.nav');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Configura animações que aparecem durante o scroll
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Para elementos com delay, adicionar classe especial
                const children = entry.target.querySelectorAll('[data-delay]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, parseInt(child.dataset.delay) || index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem ser animados
    const animatedElements = document.querySelectorAll(`
        .about-content,
        .value-item,
        .project-card,
        .stat-item,
        .testimonial,
        .help-card,
        .help-info,
        .contact-info,
        .contact-form-container,
        .whatsapp-contact,
        .footer-section,
        .footer-bottom
    `);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Configura animação de contador para números de impacto
 */
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    console.log('🔢 Contadores encontrados:', counters.length);
    
    if (counters.length === 0) {
        console.warn('⚠️ Nenhum contador encontrado!');
        return;
    }
    
    // Verificar se os contadores têm os atributos necessários
    counters.forEach(counter => {
        console.log('📊 Contador:', {
            element: counter,
            target: counter.dataset.target,
            suffix: counter.dataset.suffix,
            textContent: counter.textContent,
            visible: counter.offsetParent !== null,
            computedStyle: window.getComputedStyle(counter).display
        });
    });
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                
                console.log('🎯 Animando contador:', target, suffix);
                animateCounter(counter, target, suffix);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    
    counters.forEach(counter => {
        console.log('👁️ Observando contador:', counter.dataset.target, counter.dataset.suffix);
        counterObserver.observe(counter);
    });
}

/**
 * Anima um contador de número
 */
function animateCounter(element, target, suffix) {
    console.log('🎬 Iniciando animação:', target, suffix);
    
    // Animação simples e direta
    let current = 0;
    const step = target / 30;
    
    const timer = setInterval(() => {
        current += step;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
            console.log('✅ Animação concluída:', target + suffix);
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, 100);
}

/**
 * Configura lazy loading para imagens
 */
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Utilitários gerais
 */
const Utils = {
    // Debounce function para otimizar eventos
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function para otimizar eventos
    throttle: function(func, limit) {
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
    },
    
    // Verificar se elemento está visível
    isElementVisible: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Scroll suave para elemento
    scrollToElement: function(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// Tornar utilitários disponíveis globalmente
window.Utils = Utils;

/**
 * Configurações de performance
 */
// Otimizar scroll events
let ticking = false;

function updateScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Atualizar header baseado no scroll
    const header = document.querySelector('.header');
    if (header) {
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
    }
});

/**
 * Tratamento de erros globais
 */
window.addEventListener('error', function(e) {
    console.error('Erro no site:', e.error);
    // Aqui você pode implementar um sistema de logging
});

/**
 * Configurações de acessibilidade
 */
// Detectar se o usuário prefere movimento reduzido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

/**
 * Service Worker para cache (opcional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Implementar service worker se necessário
        console.log('Service Worker disponível');
    });
}

console.log('✅ Main.js carregado com sucesso!');

