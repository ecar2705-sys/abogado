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

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    // Obtenemos el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Event listener para el envío del formulario
        contactForm.addEventListener('submit', function(e) {
            // Prevenimos el envío por defecto
            e.preventDefault();
            
            // Obtenemos los datos del formulario
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre');
            const email = formData.get('email');
            const mensaje = formData.get('mensaje');
            
            // Validamos que todos los campos estén llenos
            if (!nombre || !email || !mensaje) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Validamos el formato del email
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Simulamos el envío del formulario
            simulateFormSubmission(nombre, email, mensaje);
        });
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para simular el envío del formulario
function simulateFormSubmission(nombre, email, mensaje) {
    // Mostramos un mensaje de carga
    showNotification('Enviando mensaje...', 'loading');
    
    // Simulamos un delay de envío
    setTimeout(() => {
        // Mensaje de éxito en consola (como se solicitó)
        console.log('Formulario enviado correctamente');
        console.log('Datos del formulario:', {
            nombre: nombre,
            email: email,
            mensaje: mensaje,
            timestamp: new Date().toISOString()
        });
        
        // Mostramos mensaje de éxito al usuario
        showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
        
        // Limpiamos el formulario
        document.getElementById('contactForm').reset();
        
    }, 2000);
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

