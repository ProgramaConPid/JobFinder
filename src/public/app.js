// Function to select the role and redirect to the corresponding page
function selectRole(role) {
  if (role === "applicant") {
    window.location.href = "./views/loginCoder.html";
  } else if (role === "company") {
    window.location.href = "./views/loginCompany.html";
  }
}

// Additional effects when hovering over cards
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".option-card");

  cards.forEach((card) => {
    // Add elevation effect when hovering
    card.addEventListener("mouseenter", function () {
      this.style.zIndex = "10";
    });

    // Reset when removing the cursor
    card.addEventListener("mouseleave", function () {
      this.style.zIndex = "1";
    });

    // Allow clicking on the entire card, not just the button
    card.addEventListener("click", function (e) {
      // Prevent it from being triggered twice if the button is clicked
      if (e.target.tagName !== "BUTTON") {
        const button = this.querySelector("button");
        if (button) {
          const role = button.getAttribute("onclick").includes("applicant")
            ? "applicant"
            : "company";
          selectRole(role);
        }
      }
    });
  });

  // Add keyboard accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "1" || e.key === "a") {
      selectRole("applicant");
    } else if (e.key === "2" || e.key === "e") {
      selectRole("company");
    }
  });
});

/* Floating Button */
document.addEventListener('DOMContentLoaded', function() {
  const contactFloatingBtn = document.getElementById('contactFloatingBtn');
  const contactMenu = document.getElementById('contactMenu');
  const closeMenu = document.getElementById('closeMenu');
  const overlay = document.getElementById('overlay');
  
  // Open contact menu
  contactFloatingBtn.addEventListener('click', function() {
      contactMenu.classList.add('active');
      overlay.classList.add('active');
  });
  
  // Close contact menu
  closeMenu.addEventListener('click', function() {
      contactMenu.classList.remove('active');
      overlay.classList.remove('active');
  });
  
  // Close menu when clicking on the overlay
  overlay.addEventListener('click', function() {
      contactMenu.classList.remove('active');
      overlay.classList.remove('active');
  });
  
  // Close menu when clicking on an option (optional)
  const contactOptions = document.querySelectorAll('.contact-option');
  contactOptions.forEach(option => {
      option.addEventListener('click', function() {
          // You can add specific functionality for each option here
          console.log('Selected option: ' + this.querySelector('h4').textContent);
          
          // Close the menu after selecting an option
          contactMenu.classList.remove('active');
          overlay.classList.remove('active');
      });
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          contactMenu.classList.remove('active');
          overlay.classList.remove('active');
      }
  });
});
