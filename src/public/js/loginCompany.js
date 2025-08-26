// Function to handle company login
    document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('companyLoginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('companyEmail').value;
            const password = document.getElementById('companyPassword').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate company login
            loginCompany(email, password);
        });
    }
    
    // Function to simulate company login process
    function loginCompany(email, password) {
        // Show loading state
        const loginButton = document.querySelector('.company-btn');
        const originalText = loginButton.textContent;
        loginButton.textContent = 'Signing in...';
        loginButton.disabled = true;
        
        // Simulate server request
        setTimeout(() => {
            // Normally you would send a request to your backend here
            console.log('Attempting company login with:', { email, password });
            
            // Redirect to company dashboard (simulated)
            alert('Login successful! Redirecting to your dashboard...');
            window.location.href = 'dashboardCompany.html';
            
            // Restore button (in case of error)
            loginButton.textContent = originalText;
            loginButton.disabled = false;
        }, 1500);
    }
    
    // Accessibility improvement: allow submitting form with Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
            const loginForm = document.getElementById('companyLoginForm');
            if (loginForm && loginForm.contains(document.activeElement)) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});
