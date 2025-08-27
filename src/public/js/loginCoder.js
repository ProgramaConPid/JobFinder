document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('coderLoginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please fill in all fields',
                });
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Email',
                    text: 'Please enter a valid email',
                });
                return;
            }
            
            // Simulate login process
            loginUser(email, password);
        });
    }
    
    // Function to simulate the login process
    function loginUser(email, password) {
        // Show loading state
        const loginButton = document.querySelector('.btn-login');
        const originalText = loginButton.textContent;
        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;
        
        // Simulate server request
        setTimeout(() => {
            // Normally a request to your backend would happen here
            console.log('Attempting login with:', { email, password });
            
            // Simulate successful login
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Redirecting to your dashboard...',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // Redirect to dashboard (simulated)
                window.location.href = 'dashboardCoder.html';
            });
            
            // Restore button (in case of error)
            loginButton.textContent = originalText;
            loginButton.disabled = false;
        }, 1500);
    }
    
    // Accessibility improvement: allow form submission with Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
            const loginForm = document.getElementById('coderLoginForm');
            if (loginForm && loginForm.contains(document.activeElement)) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});
