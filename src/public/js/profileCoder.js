document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const profileForm = document.getElementById('profileForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatar = document.getElementById('profileAvatar');
    const resumeInput = document.getElementById('resume');
    const resumeStatus = document.getElementById('resumeStatus');
    
    // Cargar datos del perfil si existen
    loadProfileData();
    
    // Evento para cambiar avatar
    changeAvatarBtn.addEventListener('click', function() {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profileAvatar.src = e.target.result;
                // Guardar en localStorage (en una app real se enviaría al servidor)
                localStorage.setItem('profileAvatar', e.target.result);
            }
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Evento para subir currículum
    resumeInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                resumeStatus.innerHTML = `<span>Archivo seleccionado: ${file.name}</span>`;
                // Guardar en localStorage (en una app real se enviaría al servidor)
                localStorage.setItem('resumeFile', file.name);
            } else {
                alert('Por favor, sube un archivo PDF');
                resumeInput.value = '';
            }
        }
    });
    
    // Evento para enviar el formulario
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (validateForm()) {
            // Obtener datos del formulario
            const formData = getFormData();
            
            // Guardar datos (en una app real se enviarían al servidor)
            saveProfileData(formData);
            
            // Mostrar mensaje de éxito
            alert('Perfil actualizado correctamente');
        }
    });
    
    // Evento para cancelar
    cancelBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.')) {
            // Volver a la página anterior
            window.history.back();
        }
    });
    
    // Función para validar el formulario
    function validateForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!firstName) {
            alert('Por favor, ingresa tu nombre');
            return false;
        }
        
        if (!lastName) {
            alert('Por favor, ingresa tu apellido');
            return false;
        }
        
        if (!email) {
            alert('Por favor, ingresa tu correo electrónico');
            return false;
        }
        
        if (!isValidEmail(email)) {
            alert('Por favor, ingresa un correo electrónico válido');
            return false;
        }
        
        return true;
    }
    
    // Función para validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Función para obtener datos del formulario
    function getFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            profession: document.getElementById('profession').value.trim(),
            experience: document.getElementById('experience').value,
            education: document.getElementById('education').value,
            skills: document.getElementById('skills').value.trim()
        };
    }
    
    // Función para guardar datos del perfil
    function saveProfileData(data) {
        // Guardar en localStorage (en una app real se enviarían al servidor)
        localStorage.setItem('profileData', JSON.stringify(data));
    }
    
    // Función para cargar datos del perfil
    function loadProfileData() {
        const savedData = localStorage.getItem('profileData');
        const savedAvatar = localStorage.getItem('profileAvatar');
        const savedResume = localStorage.getItem('resumeFile');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Llenar formulario con datos guardados
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('address').value = data.address || '';
            document.getElementById('profession').value = data.profession || '';
            document.getElementById('experience').value = data.experience || '';
            document.getElementById('education').value = data.education || '';
            document.getElementById('skills').value = data.skills || '';
        }
        
        if (savedAvatar) {
            profileAvatar.src = savedAvatar;
        }
        
        if (savedResume) {
            resumeStatus.innerHTML = `<span>Archivo subido: ${savedResume}</span>`;
        }
    }
});