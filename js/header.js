/**
 * HEADER.JS - Funcionalidades do cabeçalho e menu responsivo
 * Gerencia o menu mobile, navegação ativa e comportamento do header
 */

/**
 * Inicializa todas as funcionalidades do header
 */
function initializeHeader() {
    setupMobileMenu();
    setupActiveNavigation();
    setupHeaderScroll();
    
    console.log('✅ Header inicializado');
}

/**
 * Configura o menu mobile (hambúrguer)
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuBtn || !nav) {
        console.warn('Elementos do menu mobile não encontrados');
        return;
    }
    
    // Toggle do menu mobile
    mobileMenuBtn.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
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
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
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
        console.warn('Nenhuma seção com ID encontrada para navegação ativa');
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
        console.warn('Header não encontrado');
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
        
        // Detectar direção do scroll
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

/**
 * Utilitários específicos do header
 */
const HeaderUtils = {
    // Destacar link ativo manualmente
    setActiveLink: function(linkSelector) {
        const navLinks = document.querySelectorAll('.nav-link');
        const targetLink = document.querySelector(linkSelector);
        
        navLinks.forEach(link => link.classList.remove('active'));
        
        if (targetLink) {
            targetLink.classList.add('active');
        }
    },
    
    // Verificar se menu mobile está aberto
    isMobileMenuOpen: function() {
        const nav = document.querySelector('.nav');
        return nav ? nav.classList.contains('active') : false;
    },
    
    // Scroll para seção específica
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

// Tornar utilitários disponíveis globalmente
window.HeaderUtils = HeaderUtils;

/**
 * Configurações de acessibilidade para o header
 */
function setupHeaderAccessibility() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        // Configurar atributos ARIA
        mobileMenuBtn.setAttribute('aria-label', 'Menu de navegação');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', 'nav');
        
        nav.setAttribute('id', 'nav');
        nav.setAttribute('aria-hidden', 'true');
        
        // Gerenciar foco no menu mobile
        const navLinks = nav.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    // Se for o último link e Tab for pressionado, fechar menu
                    if (index === navLinks.length - 1 && !e.shiftKey) {
                        setTimeout(() => closeMobileMenu(), 0);
                    }
                    // Se for o primeiro link e Shift+Tab for pressionado, focar no botão
                    if (index === 0 && e.shiftKey) {
                        e.preventDefault();
                        mobileMenuBtn.focus();
                    }
                }
            });
        });
    }
}

// Inicializar acessibilidade quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setupHeaderAccessibility();
});

console.log('✅ Header.js carregado com sucesso!');

