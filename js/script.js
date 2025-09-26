// ===== CONFIGURACIÓN INICIAL =====
// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada correctamente - Cárdenas & Cárdenas');
    
    // Inicializamos todas las funcionalidades
    initNavigation();
    initContactForm();
    initScrollEffects();
    initAnimations();
});

// ===== NAVEGACIÓN MÓVIL =====
function initNavigation() {
    // Obtenemos los elementos del menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Función para alternar el menú móvil
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animación de las barras del hamburguesa
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    }
    
    // Event listener para el botón hamburguesa
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Restaurar animación de barras
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });
}

// ===== FORMULARIO DE CONTACTO CON FORMSPREE =====
function initContactForm() {
    // Obtenemos el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Event listener para el envío del formulario
        contactForm.addEventListener('submit', function(e) {
            // Prevenimos el envío por defecto para validar primero
            e.preventDefault();
            
            // Limpiamos errores anteriores
            clearAllErrors();
            
            // Obtenemos los elementos del formulario
            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const mensaje = document.getElementById('mensaje');
            const submitBtn = document.getElementById('submit-btn');
            
            // Variables para controlar si el formulario es válido
            let isValid = true;
            
            // Validación del campo nombre
            if (!nombre.value.trim()) {
                showFieldError('nombre', 'El nombre es requerido');
                isValid = false;
            } else if (nombre.value.trim().length < 2) {
                showFieldError('nombre', 'El nombre debe tener al menos 2 caracteres');
                isValid = false;
            }
            
            // Validación del campo email
            if (!email.value.trim()) {
                showFieldError('email', 'El correo electrónico es requerido');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showFieldError('email', 'Por favor, ingresa un correo electrónico válido');
                isValid = false;
            }
            
            // Validación del campo mensaje
            if (!mensaje.value.trim()) {
                showFieldError('mensaje', 'El mensaje es requerido');
                isValid = false;
            } else if (mensaje.value.trim().length < 10) {
                showFieldError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
                isValid = false;
            }
            
            // Si el formulario es válido, procedemos con el envío
            if (isValid) {
                submitFormToFormspree(contactForm, submitBtn);
            }
        });
        
        // Validación en tiempo real para mejorar la experiencia del usuario
        setupRealTimeValidation();
    }
}

// Función para limpiar todos los errores
function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');
    
    errorMessages.forEach(msg => {
        msg.classList.remove('show');
        msg.textContent = '';
    });
    
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Función para mostrar error en un campo específico
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Función para validación en tiempo real
function setupRealTimeValidation() {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    
    // Validación en tiempo real para nombre
    if (nombre) {
        nombre.addEventListener('blur', function() {
            if (this.value.trim() && this.value.trim().length < 2) {
                showFieldError('nombre', 'El nombre debe tener al menos 2 caracteres');
            } else {
                clearFieldError('nombre');
            }
        });
    }
    
    // Validación en tiempo real para email
    if (email) {
        email.addEventListener('blur', function() {
            if (this.value.trim() && !isValidEmail(this.value)) {
                showFieldError('email', 'Por favor, ingresa un correo electrónico válido');
            } else {
                clearFieldError('email');
            }
        });
    }
    
    // Validación en tiempo real para mensaje
    if (mensaje) {
        mensaje.addEventListener('blur', function() {
            if (this.value.trim() && this.value.trim().length < 10) {
                showFieldError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
            } else {
                clearFieldError('mensaje');
            }
        });
    }
}

// Función para limpiar error de un campo específico
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field && errorElement) {
        field.classList.remove('error');
        errorElement.classList.remove('show');
    }
}

// Función para enviar el formulario a Formspree
async function submitFormToFormspree(form, submitBtn) {
    // Mostrar estado de carga en el botón
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        // Crear FormData para enviar a Formspree
        const formData = new FormData(form);
        
        // Enviar datos a Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // Verificar si la respuesta es exitosa
        if (response.ok) {
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Limpiar el formulario
            form.reset();
            
            // Log en consola para desarrollo
            console.log('Formulario enviado correctamente a Formspree');
            console.log('Datos enviados:', {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                mensaje: formData.get('mensaje'),
                timestamp: new Date().toISOString()
            });
            
        } else {
            // Manejar error de Formspree
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al enviar el formulario');
        }
        
    } catch (error) {
        // Mostrar error al usuario
        console.error('Error al enviar formulario:', error);
        showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar el botón
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
    }
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'block';
        
        // Scroll suave hacia el mensaje
        successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar notificaciones
function showNotification(message, type) {
    // Removemos notificaciones anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Creamos la notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Agregamos al DOM
    document.body.appendChild(notification);
    
    // Event listener para cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover después de 5 segundos (excepto para loading)
    if (type !== 'loading') {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Efecto de navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 102, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #0066ff 0%, #0044cc 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Scroll suave para enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Ajuste para navbar fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMACIONES Y EFECTOS VISUALES =====
function initAnimations() {
    // Animación de aparición de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observamos las tarjetas de servicios
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observamos el formulario de contacto
    const contactForm = document.querySelector('.contact-form-container');
    if (contactForm) {
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateX(-30px)';
        contactForm.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(contactForm);
    }
    
    // Observamos la información de contacto
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.style.opacity = '0';
        contactInfo.style.transform = 'translateX(30px)';
        contactInfo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(contactInfo);
    }
}

// ===== FUNCIÓN PARA MOSTRAR MÁS SERVICIOS =====
function showMoreServices() {
    // Mensaje en consola
    console.log('Mostrando más servicios...');
    
    // Crear modal con servicios adicionales
    const modal = document.createElement('div');
    modal.className = 'services-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Servicios Adicionales</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="additional-services">
                        <div class="additional-service">
                            <h4><i class="fas fa-handshake"></i> Mediación y Conciliación</h4>
                            <p>Resolución alternativa de conflictos para evitar procesos judiciales largos y costosos.</p>
                        </div>
                        <div class="additional-service">
                            <h4><i class="fas fa-chart-line"></i> Asesoría Empresarial</h4>
                            <p>Consultoría legal para empresas en temas de contratación, cumplimiento normativo y estructuración.</p>
                        </div>
                        <div class="additional-service">
                            <h4><i class="fas fa-shield-alt"></i> Derecho de Seguros</h4>
                            <p>Asesoría en pólizas de seguro, reclamaciones y litigios relacionados con compañías aseguradoras.</p>
                        </div>
                        <div class="additional-service">
                            <h4><i class="fas fa-users"></i> Derecho Laboral</h4>
                            <p>Asesoría en contratos laborales, despidos, prestaciones sociales y relaciones de trabajo.</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="closeModal()">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    // Estilos para el modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Agregar estilos CSS para el modal
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
            color: #0066ff;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: #999;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #ff6600;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .additional-services {
            display: grid;
            gap: 1.5rem;
        }
        
        .additional-service {
            padding: 1.5rem;
            background: #f9f9f9;
            border-radius: 15px;
            border-left: 4px solid #0066ff;
        }
        
        .additional-service h4 {
            color: #0066ff;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .additional-service p {
            color: #666;
            line-height: 1.6;
        }
        
        .modal-footer {
            padding: 1rem 2rem 2rem;
            text-align: center;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Event listeners para cerrar modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal();
        }
    });
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.querySelector('.services-modal');
    if (modal) {
        modal.remove();
    }
}

// ===== FUNCIONES UTILITARIAS =====
// Función para formatear números de teléfono
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Función para validar formularios
function validateForm(formData) {
    const errors = [];
    
    Object.keys(formData).forEach(key => {
        if (!formData[key] || formData[key].trim() === '') {
            errors.push(`El campo ${key} es requerido`);
        }
    });
    
    return errors;
}

// Función para hacer peticiones HTTP (para futuras integraciones)
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// ===== NAVEGACIÓN A SERVICIOS =====
function navigateToService(serviceId) {
    // Obtenemos el elemento del servicio
    const serviceElement = document.getElementById(serviceId);
    
    if (serviceElement) {
        // Calculamos la posición del elemento
        const offsetTop = serviceElement.offsetTop - 70; // Ajuste para navbar fijo
        
        // Scroll suave hacia el servicio
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Efecto visual de resaltado
        serviceElement.style.transform = 'scale(1.05)';
        serviceElement.style.boxShadow = '0 20px 40px rgba(0, 102, 255, 0.3)';
        
        // Restaurar el estilo después de 2 segundos
        setTimeout(() => {
            serviceElement.style.transform = 'scale(1)';
            serviceElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }, 2000);
        
        // Mensaje en consola
        console.log(`Navegando a: ${serviceId}`);
    }
}

// ===== INICIALIZACIÓN DE FUNCIONES GLOBALES =====
// Hacemos las funciones disponibles globalmente
window.showMoreServices = showMoreServices;
window.closeModal = closeModal;
window.navigateToService = navigateToService;

// Mensaje de bienvenida en consola
console.log('%c¡Bienvenido a Cárdenas & Cárdenas!', 'color: #0066ff; font-size: 16px; font-weight: bold;');
console.log('%cSitio web desarrollado con HTML, CSS y JavaScript puro', 'color: #ff6600; font-size: 12px;');

