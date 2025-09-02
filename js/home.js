/**
 * HOME.JS - Efeitos e funcionalidades da seção home/banner
 * Gerencia animações, parallax e interações da página inicial
 */

/**
 * Inicializa todas as funcionalidades da seção home
 */
function initializeHome() {
    setupParallaxEffect();
    setupTypingAnimation();
    setupScrollIndicator();
    setupBannerAnimations();
    
    console.log('✅ Home inicializado');
}

/**
 * Configura efeito parallax no banner
 */
function setupParallaxEffect() {
    const homeSection = document.querySelector('.home');
    
    if (!homeSection) {
        console.warn('Seção home não encontrada');
        return;
    }
    
    // Verificar se o usuário não prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        return; // Não aplicar parallax se movimento reduzido for preferido
    }
    
    const handleParallax = Utils.throttle(function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Aplicar transformação apenas se a seção estiver visível
        const rect = homeSection.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            homeSection.style.transform = `translateY(${rate}px)`;
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleParallax);
}

/**
 * Configura animação de digitação no título
 */
function setupTypingAnimation() {
    const titleElement = document.querySelector('.home-title');
    
    if (!titleElement) {
        console.warn('Título do home não encontrado');
        return;
    }
    
    const originalText = titleElement.textContent;
    const words = originalText.split(' ');
    
    // Limpar o texto inicial
    titleElement.textContent = '';
    titleElement.style.opacity = '1';
    
    // Animar palavra por palavra
    let wordIndex = 0;
    let currentText = '';
    
    const typeWord = () => {
        if (wordIndex < words.length) {
            currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
            titleElement.textContent = currentText;
            wordIndex++;
            
            // Tempo variável baseado no tamanho da palavra
            const delay = words[wordIndex - 1].length * 50 + 200;
            setTimeout(typeWord, delay);
        } else {
            // Adicionar cursor piscante temporariamente
            titleElement.classList.add('typing-complete');
            setTimeout(() => {
                titleElement.classList.remove('typing-complete');
            }, 2000);
        }
    };
    
    // Iniciar animação após um pequeno delay
    setTimeout(typeWord, 500);
}

/**
 * Configura o indicador de scroll
 */
function setupScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
    
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.appendChild(scrollIndicator);
        
        // Adicionar funcionalidade de clique
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                HeaderUtils.scrollToSection('#about');
            }
        });
        
        // Ocultar indicador quando rolar
        const handleScroll = Utils.throttle(function() {
            const scrolled = window.pageYOffset;
            const opacity = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = opacity;
        }, 16);
        
        window.addEventListener('scroll', handleScroll);
    }
}

/**
 * Configura animações dos elementos do banner
 */
function setupBannerAnimations() {
    const homeText = document.querySelector('.home-text');
    const homeButtons = document.querySelector('.home-buttons');
    
    if (!homeText) return;
    
    // Animação de entrada dos elementos
    const animateElements = () => {
        // Animar texto principal
        homeText.style.opacity = '0';
        homeText.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            homeText.style.transition = 'all 1s ease-out';
            homeText.style.opacity = '1';
            homeText.style.transform = 'translateY(0)';
        }, 300);
        
        // Animar botões
        if (homeButtons) {
            homeButtons.style.opacity = '0';
            homeButtons.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                homeButtons.style.transition = 'all 0.8s ease-out';
                homeButtons.style.opacity = '1';
                homeButtons.style.transform = 'translateY(0)';
            }, 800);
        }
    };
    
    // Iniciar animações
    setTimeout(animateElements, 100);
}

/**
 * Configura efeitos nos botões do banner
 */
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.home-buttons .btn');
    
    buttons.forEach(button => {
        // Efeito de ondulação ao clicar
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Efeito de hover com partículas (opcional)
        button.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.classList.add('hover-effect');
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
}

/**
 * Configura slider de imagens de fundo (se houver múltiplas)
 */
function setupBackgroundSlider() {
    const backgrounds = [
        'images/banner_principal.jpeg',
        // Adicionar mais imagens se necessário
    ];
    
    if (backgrounds.length <= 1) return;
    
    const homeSection = document.querySelector('.home');
    let currentBg = 0;
    
    const changeBackground = () => {
        currentBg = (currentBg + 1) % backgrounds.length;
        const newBg = backgrounds[currentBg];
        
        // Criar nova camada de fundo
        const newLayer = document.createElement('div');
        newLayer.style.position = 'absolute';
        newLayer.style.top = '0';
        newLayer.style.left = '0';
        newLayer.style.width = '100%';
        newLayer.style.height = '100%';
        newLayer.style.backgroundImage = `url('${newBg}')`;
        newLayer.style.backgroundSize = 'cover';
        newLayer.style.backgroundPosition = 'center';
        newLayer.style.opacity = '0';
        newLayer.style.transition = 'opacity 2s ease-in-out';
        newLayer.style.zIndex = '0';
        
        homeSection.appendChild(newLayer);
        
        // Fade in da nova imagem
        setTimeout(() => {
            newLayer.style.opacity = '1';
        }, 50);
        
        // Remover camada anterior
        setTimeout(() => {
            const oldLayers = homeSection.querySelectorAll('div[style*="background-image"]');
            if (oldLayers.length > 1) {
                oldLayers[0].remove();
            }
        }, 2000);
    };
    
    // Trocar fundo a cada 8 segundos
    setInterval(changeBackground, 8000);
}

/**
 * Utilitários específicos da seção home
 */
const HomeUtils = {
    // Reiniciar animação de digitação
    restartTypingAnimation: function() {
        setupTypingAnimation();
    },
    
    // Pausar/retomar parallax
    toggleParallax: function(enable = true) {
        const homeSection = document.querySelector('.home');
        if (homeSection) {
            if (enable) {
                setupParallaxEffect();
            } else {
                homeSection.style.transform = 'none';
            }
        }
    },
    
    // Scroll suave para próxima seção
    scrollToNext: function() {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            HeaderUtils.scrollToSection('#about');
        }
    }
};

// Tornar utilitários disponíveis globalmente
window.HomeUtils = HomeUtils;

/**
 * Configurações responsivas
 */
function setupResponsiveFeatures() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleResponsiveChange = (e) => {
        if (e.matches) {
            // Mobile: desabilitar alguns efeitos pesados
            const homeSection = document.querySelector('.home');
            if (homeSection) {
                homeSection.style.backgroundAttachment = 'scroll';
            }
        } else {
            // Desktop: habilitar todos os efeitos
            const homeSection = document.querySelector('.home');
            if (homeSection) {
                homeSection.style.backgroundAttachment = 'fixed';
            }
        }
    };
    
    mediaQuery.addListener(handleResponsiveChange);
    handleResponsiveChange(mediaQuery);
}

// Inicializar recursos responsivos
document.addEventListener('DOMContentLoaded', function() {
    setupResponsiveFeatures();
    setupButtonEffects();
});

// CSS para efeitos adicionais
const additionalStyles = `
    .typing-complete::after {
        content: '|';
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
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
    
    .hover-effect {
        position: relative;
        overflow: hidden;
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('✅ Home.js carregado com sucesso!');

