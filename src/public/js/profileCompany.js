document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const companyForm = document.getElementById('companyForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const changeLogoBtn = document.getElementById('changeLogoBtn');
    const logoUpload = document.getElementById('logoUpload');
    const companyLogo = document.getElementById('companyLogo');
    
    // Cargar datos de la empresa si existen
    loadCompanyData();
    
    // Evento para cambiar logo
    changeLogoBtn.addEventListener('click', function() {
        logoUpload.click();
    });
    
    logoUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                companyLogo.src = e.target.result;
                // Guardar en localStorage (en una app real se enviaría al servidor)
                localStorage.setItem('companyLogo', e.target.result);
            }
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Evento para enviar el formulario
    companyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (validateForm()) {
            // Obtener datos del formulario
            const formData = getFormData();
            
            // Guardar datos (en una app real se enviarían al servidor)
            saveCompanyData(formData);
            
            // Mostrar mensaje de éxito
            alert('Company profile updated successfully');
        }
    });
    
    // Evento para cancelar
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
            // Volver a la página anterior
            window.history.back();
        }
    });
    
    // Función para validar el formulario
    function validateForm() {
        const companyName = document.getElementById('companyName').value.trim();
        const industry = document.getElementById('industry').value;
        const companyDescription = document.getElementById('companyDescription').value.trim();
        const contactName = document.getElementById('contactName').value.trim();
        const contactPosition = document.getElementById('contactPosition').value.trim();
        const contactEmail = document.getElementById('contactEmail').value.trim();
        
        if (!companyName) {
            alert('Please enter your company name');
            return false;
        }
        
        if (!industry) {
            alert('Please select your industry');
            return false;
        }
        
        if (!companyDescription) {
            alert('Please enter a company description');
            return false;
        }
        
        if (!contactName) {
            alert('Please enter a contact person name');
            return false;
        }
        
        if (!contactPosition) {
            alert('Please enter the contact person position');
            return false;
        }
        
        if (!contactEmail) {
            alert('Please enter a contact email');
            return false;
        }
        
        if (!isValidEmail(contactEmail)) {
            alert('Please enter a valid email address');
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
            companyName: document.getElementById('companyName').value.trim(),
            industry: document.getElementById('industry').value,
            website: document.getElementById('website').value.trim(),
            employees: document.getElementById('employees').value,
            companyDescription: document.getElementById('companyDescription').value.trim(),
            contactName: document.getElementById('contactName').value.trim(),
            contactPosition: document.getElementById('contactPosition').value.trim(),
            contactEmail: document.getElementById('contactEmail').value.trim(),
            contactPhone: document.getElementById('contactPhone').value.trim(),
            address: document.getElementById('address').value.trim(),
            linkedin: document.getElementById('linkedin').value.trim(),
            twitter: document.getElementById('twitter').value.trim(),
            facebook: document.getElementById('facebook').value.trim(),
            instagram: document.getElementById('instagram').value.trim()
        };
    }
    
    // Función para guardar datos de la empresa
    function saveCompanyData(data) {
        // Guardar en localStorage (en una app real se enviarían al servidor)
        localStorage.setItem('companyData', JSON.stringify(data));
    }
    
    // Función para cargar datos de la empresa
    function loadCompanyData() {
        const savedData = localStorage.getItem('companyData');
        const savedLogo = localStorage.getItem('companyLogo');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Llenar formulario con datos guardados
            document.getElementById('companyName').value = data.companyName || '';
            document.getElementById('industry').value = data.industry || '';
            document.getElementById('website').value = data.website || '';
            document.getElementById('employees').value = data.employees || '';
            document.getElementById('companyDescription').value = data.companyDescription || '';
            document.getElementById('contactName').value = data.contactName || '';
            document.getElementById('contactPosition').value = data.contactPosition || '';
            document.getElementById('contactEmail').value = data.contactEmail || '';
            document.getElementById('contactPhone').value = data.contactPhone || '';
            document.getElementById('address').value = data.address || '';
            document.getElementById('linkedin').value = data.linkedin || '';
            document.getElementById('twitter').value = data.twitter || '';
            document.getElementById('facebook').value = data.facebook || '';
            document.getElementById('instagram').value = data.instagram || '';
        }
        
        if (savedLogo) {
            companyLogo.src = savedLogo;
        }
    }
});
