// Function to handle company registration
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('companyRegisterForm');
  
  if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const companyName = document.getElementById('companyName').value;
          const email = document.getElementById('companyEmail').value;
          const password = document.getElementById('companyPassword').value;
          const confirmPassword = document.getElementById('companyConfirmPassword').value;
          
          // Basic validation
          if (!companyName || !email || !password || !confirmPassword) {
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
          registerCompany(companyName, email, password);
      });
  }
  
  // Function to simulate company registration process
  function registerCompany(companyName, email, password) {
      // Show loading state
      const registerButton = document.querySelector('.company-btn');
      const originalText = registerButton.textContent;
      registerButton.textContent = 'Creating account...';
      registerButton.disabled = true;
      
      // Simulate server request
      setTimeout(() => {
          // Normally you would send a request to your backend here
          console.log('Registering company:', { companyName, email, password });
          
          // Redirect to company dashboard (simulated)
          alert('Company account created successfully! Redirecting...');
          window.location.href = 'dashboardCompany.html';
          
          // Restore button (in case of error)
          registerButton.textContent = originalText;
          registerButton.disabled = false;
      }, 1500);
  }
  
  // Accessibility improvement: allow submitting form with Enter key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
          const registerForm = document.getElementById('companyRegisterForm');
          if (registerForm && registerForm.contains(document.activeElement)) {
              registerForm.dispatchEvent(new Event('submit'));
          }
      }
  });
});
