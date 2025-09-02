/**
 * INSTITUTO LIFE - JAVASCRIPT UNIFICADO E OTIMIZADO
 * Todas as funcionalidades do site em um único arquivo otimizado
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Instituto Life - Site carregado com sucesso!');
    
    // Inicializar todos os módulos
    initializeAll();
    
    console.log('✅ Todas as funcionalidades inicializadas');
});

/**
 * Inicializa todas as funcionalidades do site
 */
function initializeAll() {
    // Configurações básicas
    setupSmoothScroll();
    setupScrollAnimations();
    setupCounterAnimation();
    
    // Módulos específicos
    initializeHeader();
    initializeContact();
    initializeDonationModal();
    
    // Configurações de performance
    setupPerformanceOptimizations();
}

/* ===== UTILITÁRIOS ===== */
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

/* ===== SCROLL SUAVE ===== */
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
                closeMobileMenu();
            }
        });
    });
}

/* ===== ANIMAÇÕES DE SCROLL ===== */
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

/* ===== ANIMAÇÃO DE CONTADOR ===== */
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) {
        return;
    }
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                
                animateCounter(counter, target, suffix);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Anima um contador de número
 */
function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 50);
}

/* ===== FUNCIONALIDADES DO HEADER ===== */
function initializeHeader() {
    setupMobileMenu();
    setupActiveNavigation();
    setupHeaderScroll();
}

/**
 * Configura o menu mobile
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuBtn || !nav) {
        return;
    }
    
    // Toggle do menu mobile
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Fechar menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Gerenciar redimensionamento da janela
    window.addEventListener('resize', Utils.debounce(function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));
}

/**
 * Abre/fecha o menu mobile
 */
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const isActive = nav.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Abre o menu mobile
 */
function openMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    nav.classList.add('active');
    mobileMenuBtn.classList.add('active');
    
    // Prevenir scroll do body quando menu está aberto
    document.body.style.overflow = 'hidden';
    
    // Focar no primeiro link para acessibilidade
    const firstLink = nav.querySelector('.nav-link');
    if (firstLink) {
        setTimeout(() => firstLink.focus(), 300);
    }
    
    // Adicionar atributos de acessibilidade
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
}

/**
 * Fecha o menu mobile
 */
function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (!nav || !mobileMenuBtn) return;
    
    nav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    
    // Restaurar scroll do body
    document.body.style.overflow = '';
    
    // Atualizar atributos de acessibilidade
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
}

/**
 * Configura a navegação ativa baseada na seção visível
 */
function setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) {
        return;
    }
    
    // Configurar Intersection Observer para detectar seção ativa
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (entry.isIntersecting) {
                // Remover classe active de todos os links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Adicionar classe active ao link correspondente
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    // Observar todas as seções
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Definir link ativo inicial
    setInitialActiveLink();
}

/**
 * Define o link ativo inicial baseado na URL
 */
function setInitialActiveLink() {
    const hash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remover classe active de todos os links
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (hash) {
        const activeLink = document.querySelector(`.nav-link[href="${hash}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    } else {
        // Se não há hash, ativar o primeiro link (Home)
        const firstLink = document.querySelector('.nav-link[href="#home"]');
        if (firstLink) {
            firstLink.classList.add('active');
        }
    }
}

/**
 * Configura comportamento do header durante o scroll
 */
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) {
        return;
    }
    
    let lastScrollTop = 0;
    let isScrollingDown = false;
    
    const handleScroll = Utils.throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adicionar classe 'scrolled' quando rolar para baixo
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Detectar direção do scroll para esconder/mostrar header
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Rolando para baixo
            if (!isScrollingDown) {
                isScrollingDown = true;
                header.style.transform = 'translateY(-100%)';
            }
        } else {
            // Rolando para cima
            if (isScrollingDown) {
                isScrollingDown = false;
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
}

/* ===== FUNCIONALIDADES DE CONTATO ===== */
function initializeContact() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        return;
    }
    
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Validação em tempo real
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

/**
 * Manipula o envio do formulário de contato
 */
function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const isValid = validateForm(form);
    
    if (!isValid) {
        return;
    }
    
    // Simular envio do formulário
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // Simular delay de envio
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Mostrar mensagem de sucesso
        showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Limpar formulário
        form.reset();
        clearAllFieldErrors(form);
    }, 2000);
}

/**
 * Valida um campo específico
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Validações específicas por campo
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Nome é obrigatório';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'E-mail é obrigatório';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'E-mail inválido';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\d\s\-\(\)]+$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Telefone inválido';
            }
            break;
            
        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Assunto é obrigatório';
            }
            break;
            
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Mensagem é obrigatória';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            }
            break;
    }
    
    // Mostrar/esconder erro
    if (isValid) {
        showFieldSuccess(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

/**
 * Valida todo o formulário
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    fields.forEach(field => {
        const isFieldValid = validateField({ target: field });
        if (!isFieldValid) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

/**
 * Mostra erro em um campo
 */
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
}

/**
 * Mostra sucesso em um campo
 */
function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
}

/**
 * Limpa erro de um campo
 */
function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    
    if (field.value.trim()) {
        formGroup.classList.remove('error');
    }
}

/**
 * Limpa todos os erros do formulário
 */
function clearAllFieldErrors(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
    });
}

/**
 * Mostra mensagem de sucesso
 */
function showSuccessMessage(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

/* ===== MODAL DE DOAÇÃO ===== */
function initializeDonationModal() {
    // Criar modal de doação
    createDonationModal();
    
    // Configurar botões de doação
    const donateButtons = document.querySelectorAll('.btn-donate');
    donateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openDonationModal();
        });
    });
}

/**
 * Cria o modal de doação
 */
function createDonationModal() {
    const modal = document.createElement('div');
    modal.className = 'donation-modal';
    modal.innerHTML = `
        <div class="donation-modal-content">
            <div class="donation-modal-header">
                <h3>💝 Faça sua Doação</h3>
                <button class="close-modal" aria-label="Fechar modal">&times;</button>
            </div>
            
            <div class="donation-info">
                <p>Sua doação faz a diferença na vida de mais de 100 crianças do Clube dos Engenheiros em Araruama. Cada contribuição nos ajuda a manter nossos projetos de futebol, judô e dança funcionando.</p>
            </div>
            
            <div class="bank-details">
                <div class="bank-detail-item">
                    <span class="bank-detail-label">Banco:</span>
                    <span class="bank-detail-value">Banco do Brasil</span>
                    <button class="copy-btn" data-copy="Banco do Brasil">Copiar</button>
                </div>
                
                <div class="bank-detail-item">
                    <span class="bank-detail-label">Agência:</span>
                    <span class="bank-detail-value">1234-5</span>
                    <button class="copy-btn" data-copy="1234-5">Copiar</button>
                </div>
                
                <div class="bank-detail-item">
                    <span class="bank-detail-label">Conta:</span>
                    <span class="bank-detail-value">12345-6</span>
                    <button class="copy-btn" data-copy="12345-6">Copiar</button>
                </div>
                
                <div class="bank-detail-item">
                    <span class="bank-detail-label">CNPJ:</span>
                    <span class="bank-detail-value">12.345.678/0001-90</span>
                    <button class="copy-btn" data-copy="12.345.678/0001-90">Copiar</button>
                </div>
                
                <div class="bank-detail-item">
                    <span class="bank-detail-label">Favorecido:</span>
                    <span class="bank-detail-value">Instituto Life</span>
                    <button class="copy-btn" data-copy="Instituto Life">Copiar</button>
                </div>
                
                <button class="copy-all-btn">📋 Copiar Todos os Dados</button>
            </div>
            
            <div class="donation-footer">
                <p>💚 Obrigado por fazer parte desta transformação!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar eventos do modal
    setupDonationModalEvents(modal);
}

/**
 * Configura eventos do modal de doação
 */
function setupDonationModalEvents(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    const copyButtons = modal.querySelectorAll('.copy-btn');
    const copyAllBtn = modal.querySelector('.copy-all-btn');
    
    // Fechar modal
    closeBtn.addEventListener('click', closeDonationModal);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeDonationModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeDonationModal();
        }
    });
    
    // Botões de copiar individual
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.dataset.copy;
            copyToClipboard(textToCopy);
            showCopyFeedback(this);
        });
    });
    
    // Botão de copiar todos os dados
    copyAllBtn.addEventListener('click', function() {
        const allData = `
Dados Bancários - Instituto Life

Banco: Banco do Brasil
Agência: 1234-5
Conta: 12345-6
CNPJ: 12.345.678/0001-90
Favorecido: Instituto Life

Obrigado por sua doação! 💚
        `.trim();
        
        copyToClipboard(allData);
        showCopyFeedback(this, 'Todos os dados copiados!');
    });
}

/**
 * Abre o modal de doação
 */
function openDonationModal() {
    const modal = document.querySelector('.donation-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focar no botão de fechar para acessibilidade
    const closeBtn = modal.querySelector('.close-modal');
    setTimeout(() => closeBtn.focus(), 300);
}

/**
 * Fecha o modal de doação
 */
function closeDonationModal() {
    const modal = document.querySelector('.donation-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Copia texto para a área de transferência
 */
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Método moderno
        navigator.clipboard.writeText(text);
    } else {
        // Método fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }
}

/**
 * Mostra feedback visual ao copiar
 */
function showCopyFeedback(button, customMessage = 'Copiado!') {
    const originalText = button.textContent;
    button.textContent = customMessage;
    button.style.background = 'var(--success-color)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

/* ===== OTIMIZAÇÕES DE PERFORMANCE ===== */
function setupPerformanceOptimizations() {
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
    
    // Configurações de acessibilidade
    setupAccessibility();
}

/**
 * Configurações de acessibilidade
 */
function setupAccessibility() {
    // Detectar se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }
    
    // Configurar atributos ARIA para o menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.setAttribute('aria-label', 'Menu de navegação');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', 'nav');
        
        nav.setAttribute('id', 'nav');
        nav.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Tratamento de erros globais
 */
window.addEventListener('error', function(e) {
    console.error('Erro no site:', e.error);
    // Aqui você pode implementar um sistema de logging
});

/**
 * Utilitários específicos do header (compatibilidade)
 */
const HeaderUtils = {
    setActiveLink: function(linkSelector) {
        const navLinks = document.querySelectorAll('.nav-link');
        const targetLink = document.querySelector(linkSelector);
        
        navLinks.forEach(link => link.classList.remove('active'));
        
        if (targetLink) {
            targetLink.classList.add('active');
        }
    },
    
    isMobileMenuOpen: function() {
        const nav = document.querySelector('.nav');
        return nav ? nav.classList.contains('active') : false;
    },
    
    scrollToSection: function(sectionId) {
        const section = document.querySelector(sectionId);
        const header = document.querySelector('.header');
        
        if (section && header) {
            const headerHeight = header.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }
};

// Tornar utilitários disponíveis globalmente para compatibilidade
window.Utils = Utils;
window.HeaderUtils = HeaderUtils;

console.log('✅ Script.js carregado com sucesso!');

