// Función para manejar el login de aplicantes
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('coderLoginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validación básica
            if (!email || !password) {
                alert('Por favor, completa todos los campos');
                return;
            }
            
            // Validación de formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un email válido');
                return;
            }
            
            // Simulación de inicio de sesión
            loginUser(email, password);
        });
    }
    
    // Función para simular el proceso de login
    function loginUser(email, password) {
        // Mostrar estado de carga
        const loginButton = document.querySelector('.btn-login');
        const originalText = loginButton.textContent;
        loginButton.textContent = 'Iniciando sesión...';
        loginButton.disabled = true;
        
        // Simular petición al servidor
        setTimeout(() => {
            // Aquí normalmente se haría una petición a tu backend
            console.log('Intentando login con:', { email, password });
            
            // Redirigir al dashboard (simulado)
            alert('¡Inicio de sesión exitoso! Redirigiendo...');
            window.location.href = 'dashboardCoder.html';
            
            // Restaurar botón (en caso de error)
            loginButton.textContent = originalText;
            loginButton.disabled = false;
        }, 1500);
    }
    
    // Mejora de accesibilidad: permitir enviar formulario con Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
            const loginForm = document.getElementById('coderLoginForm');
            if (loginForm && loginForm.contains(document.activeElement)) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});