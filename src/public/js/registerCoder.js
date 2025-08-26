// Function to handle applicant registration
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('coderRegisterForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (!fullName || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Matching passwords validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Password strength validation
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            // Simulate registration
            registerUser(fullName, email, password);
        });
    }
    
    // Function to simulate applicant registration process
    function registerUser(fullName, email, password) {
        // Show loading state
        const registerButton = document.querySelector('.btn-register');
        const originalText = registerButton.textContent;
        registerButton.textContent = 'Creating account...';
        registerButton.disabled = true;
        
        // Simulate server request
        setTimeout(() => {
            // Normally you would send a request to your backend here
            console.log('Registering applicant:', { fullName, email, password });
            
            // Redirect to applicant dashboard (simulated)
            alert('Account created successfully! Redirecting...');
            window.location.href = 'dashboardCoder.html';
            
            // Restore button (in case of error)
            registerButton.textContent = originalText;
            registerButton.disabled = false;
        }, 1500);
    }
    
    // Accessibility improvement: allow submitting form with Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
            const registerForm = document.getElementById('coderRegisterForm');
            if (registerForm && registerForm.contains(document.activeElement)) {
                registerForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});
