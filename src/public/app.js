// Función para seleccionar el rol y redirigir a la página correspondiente
function selectRole(role) {
    if (role === 'applicant') {
        window.location.href = './views/loginCoder.html';
    } else if (role === 'company') {
        window.location.href = './views/loginCompany.html';
    }
    }

    // Efectos adicionales al pasar el cursor por las tarjetas
    document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.option-card');
    
    cards.forEach(card => {
        // Añadir efecto de elevación al pasar el cursor
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        // Restablecer al quitar el cursor
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        // Permitir hacer clic en toda la tarjeta, no solo en el botón
        card.addEventListener('click', function(e) {
            // Evitar que se dispare dos veces si se hace clic en el botón
            if (e.target.tagName !== 'BUTTON') {
                const button = this.querySelector('button');
                if (button) {
                    const role = button.getAttribute('onclick').includes('applicant') ? 'applicant' : 'company';
                    selectRole(role);
                }
            }
        });
    });
    
    // Añadir teclado accesible
    document.addEventListener('keydown', function(e) {
        if (e.key === '1' || e.key === 'a') {
            selectRole('applicant');
        } else if (e.key === '2' || e.key === 'e') {
            selectRole('company');
        }
    });
});