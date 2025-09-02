/**
 * CONTACT.JS - Validação e funcionalidades do formulário de contato
 * Gerencia validação, envio e feedback do formulário
 */

/**
 * Inicializa todas as funcionalidades de contato
 */
function initializeContact() {
    setupFormValidation();
    setupFormSubmission();
    setupFieldInteractions();
    setupWhatsAppIntegration();
    
    console.log('✅ Contact inicializado');
}

/**
 * Configura validação do formulário
 */
function setupFormValidation() {
    const form = document.querySelector('#contact-form');
    
    if (!form) {
        console.warn('Formulário de contato não encontrado');
        return;
    }
    
    const fields = {
        name: form.querySelector('#name'),
        email: form.querySelector('#email'),
        phone: form.querySelector('#phone'),
        subject: form.querySelector('#subject'),
        message: form.querySelector('#message')
    };
    
    // Validação em tempo real
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(field, fieldName));
            field.addEventListener('input', () => clearFieldError(field));
        }
    });
    
    // Validação no envio
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(fields)) {
            submitForm(form, fields);
        }
    });
}

/**
 * Valida um campo específico
 */
function validateField(field, fieldName) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    // Remover mensagens de erro anteriores
    clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Nome é obrigatório';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Nome deve conter apenas letras';
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'E-mail é obrigatório';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'E-mail inválido';
            }
            break;
            
        case 'phone':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = 'Telefone inválido';
            }
            break;
            
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Mensagem é obrigatória';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            } else if (value.length > 1000) {
                isValid = false;
                errorMessage = 'Mensagem deve ter no máximo 1000 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
    } else {
        formGroup.classList.add('success');
        formGroup.classList.remove('error');
    }
    
    return isValid;
}

/**
 * Valida todo o formulário
 */
function validateForm(fields) {
    let isFormValid = true;
    
    // Validar campos obrigatórios
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = fields[fieldName];
        if (field && !validateField(field, fieldName)) {
            isFormValid = false;
        }
    });
    
    // Validar campos opcionais se preenchidos
    if (fields.phone && fields.phone.value.trim()) {
        if (!validateField(fields.phone, 'phone')) {
            isFormValid = false;
        }
    }
    
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
}

/**
 * Remove erro de um campo
 */
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    formGroup.classList.remove('error');
}

/**
 * Configura envio do formulário
 */
function setupFormSubmission() {
    // Esta função seria conectada a um backend real
    // Por enquanto, simula o envio
}

/**
 * Simula envio do formulário
 */
function submitForm(form, fields) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Mostrar loading
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    submitButton.classList.add('loading');
    
    // Simular envio (substituir por integração real)
    setTimeout(() => {
        // Sucesso simulado
        showFormSuccess();
        resetForm(form);
        
        // Restaurar botão
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.classList.remove('loading');
        
    }, 2000);
}

/**
 * Mostra mensagem de sucesso
 */
function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Mensagem enviada com sucesso!</h3>
            <p>Entraremos em contato em breve.</p>
        </div>
    `;
    
    const form = document.querySelector('#contact-form');
    form.parentNode.insertBefore(successMessage, form);
    
    // Remover mensagem após 5 segundos
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // Scroll para a mensagem
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Reseta o formulário
 */
function resetForm(form) {
    form.reset();
    
    // Remover classes de validação
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
    });
    
    // Remover mensagens de erro
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}

/**
 * Configura interações dos campos
 */
function setupFieldInteractions() {
    const form = document.querySelector('#contact-form');
    if (!form) return;
    
    // Contador de caracteres para textarea
    const messageField = form.querySelector('#message');
    if (messageField) {
        setupCharacterCounter(messageField);
    }
    
    // Formatação automática do telefone
    const phoneField = form.querySelector('#phone');
    if (phoneField) {
        setupPhoneFormatting(phoneField);
    }
    
    // Auto-resize da textarea
    if (messageField) {
        setupAutoResize(messageField);
    }
}

/**
 * Configura contador de caracteres
 */
function setupCharacterCounter(textarea) {
    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0/${maxLength}`;
    
    textarea.parentNode.appendChild(counter);
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        counter.textContent = `${length}/${maxLength}`;
        
        if (length > maxLength * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    });
}

/**
 * Configura formatação automática do telefone
 */
function setupPhoneFormatting(phoneField) {
    phoneField.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{0,2})/, '($1');
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        this.value = value;
    });
}

/**
 * Configura auto-resize da textarea
 */
function setupAutoResize(textarea) {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

/**
 * Configura integração com WhatsApp
 */
function setupWhatsAppIntegration() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const phoneNumber = '5522999999999'; // Número do WhatsApp (Araruama - RJ)
            const message = encodeURIComponent(
                'Olá! Gostaria de saber mais sobre os projetos do Instituto Life.'
            );
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

/**
 * Utilitários de validação
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
}

/**
 * Utilitários específicos do contato
 */
const ContactUtils = {
    // Validar formulário manualmente
    validateForm: function() {
        const form = document.querySelector('#contact-form');
        if (form) {
            const fields = {
                name: form.querySelector('#name'),
                email: form.querySelector('#email'),
                phone: form.querySelector('#phone'),
                subject: form.querySelector('#subject'),
                message: form.querySelector('#message')
            };
            return validateForm(fields);
        }
        return false;
    },
    
    // Preencher formulário programaticamente
    fillForm: function(data) {
        const form = document.querySelector('#contact-form');
        if (form) {
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`#${key}`);
                if (field) {
                    field.value = data[key];
                }
            });
        }
    },
    
    // Abrir WhatsApp com mensagem personalizada
    openWhatsApp: function(customMessage) {
        const phoneNumber = '5522999999999'; // Número do WhatsApp (Araruama - RJ)
        const message = encodeURIComponent(customMessage || 'Olá! Gostaria de mais informações sobre o Instituto Life.');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
};

// Tornar utilitários disponíveis globalmente
window.ContactUtils = ContactUtils;

// CSS adicional para componentes do formulário
const contactStyles = `
    .character-counter {
        font-size: 0.8rem;
        color: #666;
        text-align: right;
        margin-top: 4px;
    }
    
    .character-counter.warning {
        color: #f44336;
    }
    
    .form-success-message {
        background: #4CAF50;
        color: white;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        text-align: center;
        animation: slideInDown 0.5s ease-out;
    }
    
    .success-content i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        display: block;
    }
    
    .success-content h3 {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
    }
    
    .success-content p {
        margin: 0;
        opacity: 0.9;
    }
    
    @keyframes slideInDown {
        from {
            transform: translateY(-30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

// Adicionar estilos ao documento
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactStyles;
document.head.appendChild(contactStyleSheet);

console.log('✅ Contact.js carregado com sucesso!');

