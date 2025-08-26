// Company dashboard functionalities
document.addEventListener('DOMContentLoaded', function() {
  console.log('Company dashboard loaded');
  
  // Load company data
  loadCompanyData();
  
  // Load active job offers
  loadActiveOffers();
  
  // Load company statistics
  loadCompanyStats();
});

function loadCompanyData() {
  // Simulate loading company data
  // In a real app, this would come from your API
  const companyData = {
      name: "TechCorp",
      email: "contact@techcorp.com",
      profileCompletion: 90
  };
  
  document.querySelector('.user-info').textContent = `Hello, ${companyData.name}`;
}

function loadActiveOffers() {
  // Simulate loading active offers
  // In a real app, this would come from your API
  console.log('Loading active job offers...');
}

function loadCompanyStats() {
  // Simulate loading company statistics
  // In a real app, this would come from your API
  console.log('Loading company statistics...');
}

function createNewOffer() {
  // Simulate creating a new job offer
  alert('Redirecting to create a new job offer');
  // In a real app, this would redirect to a creation form
}

function viewApplicants(offerId) {
  // Simulate viewing applicants
  alert(`Viewing applicants for job offer #${offerId}`);
  // In a real app, this would redirect to an applicants page
}

function editOffer(offerId) {
  // Simulate editing a job offer
  alert(`Editing job offer #${offerId}`);
  // In a real app, this would redirect to an edit form
}

function completeProfile() {
  // Simulate completing company profile
  alert('Redirecting to complete company profile');
}

function viewPendingApplications() {
  // Simulate reviewing pending applications
  alert('Viewing pending applications for review');
}

function logout() {
  // Simulate logging out
  if (confirm('Are you sure you want to log out?')) {
      alert('Logged out successfully');
      window.location.href = '../index.html';
  }
}

// Keyboard navigation for company dashboard
document.addEventListener('keydown', function(e) {
  // Keyboard shortcuts for company dashboard
  if (e.ctrlKey) {
      switch(e.key) {
          case 'n':
              createNewOffer();
              break;
          case 'p':
              completeProfile();
              break;
          case 'a':
              viewPendingApplications();
              break;
      }
  }
});
