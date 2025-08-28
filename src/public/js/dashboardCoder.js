// Applicant dashboard functionalities
document.addEventListener("DOMContentLoaded", function () {
  console.log("Applicant dashboard loaded");

  // Load user data
  loadUserData();

  // Load job offers
  loadJobOffers();

  // Load user applications
  loadUserApplications();

  // Logica Modal - Ver detalles
  const jobModal = document.getElementById("jobModal");
  const closeJobModal = document.getElementById("closeJobModal");

  // Asignamos evento a todos los botones "View Details"
  document.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".job-card"); // el card de ese botón

      // Sacamos info desde el card
      const title = card.querySelector(".job-title").innerText;
      const company = card.querySelector(".company-name").innerText;
      const location = card.querySelector(".job-location").innerText;
      const salary = card.querySelector(".job-salary").innerText;
      const posted = card.querySelector(".job-posted").innerText;
      const description = card.querySelector(".job-description p").innerText;

      // Tags
      const tagsContainer = document.getElementById("modalTags");
      tagsContainer.innerHTML = "";
      card.querySelectorAll(".job-tag").forEach((tagEl) => {
        const span = document.createElement("span");
        span.className = "job-tag";
        span.innerText = tagEl.innerText;
        tagsContainer.appendChild(span);
      });

      // Pintamos en el modal
      document.getElementById("modalJobTitle").innerText = title;
      document.getElementById("modalCompanyName").innerText = company;
      document.getElementById("modalLocation").innerText = location;
      document.getElementById("modalSalary").innerText = salary;
      document.getElementById("modalPosted").innerText = posted;
      document.getElementById("modalDescription").innerText = description;

      // Mostrar modal
      jobModal.classList.add("active");
    });
  });

  // 🔥 Función para cerrar con animación
  function closeJobModalWithAnimation() {
    jobModal.classList.add("closing");
    setTimeout(() => {
      jobModal.classList.remove("active", "closing");
    }, 300); // mismo tiempo que tu animación CSS
  }

  // Botón de cerrar
  closeJobModal.addEventListener("click", closeJobModalWithAnimation);

  // Click fuera del modal
  window.addEventListener("click", (e) => {
    if (e.target === jobModal) {
      closeJobModalWithAnimation();
    }
  });
});

function loadUserData() {
  // Simulate loading user data
  // In a real app, this would come from your API
  const userData = {
    name: "John Smith",
    email: "john@email.com",
    profileCompleted: true,
  };

  document.querySelector(".user-info").textContent = `Hello, ${userData.name}`;
}

function loadJobOffers() {
  // Simulate loading job offers
  // In a real app, this would come from your API
  console.log("Loading job offers...");
}

function loadUserApplications() {
  // Simulate loading user applications
  // In a real app, this would come from your API
  console.log("Loading user applications...");
}

function applyJob(jobId) {
  // Simulate job application
  const applyButton = event.target;
  applyButton.textContent = "Applying...";
  applyButton.disabled = true;

  setTimeout(() => {
    alert(`You have successfully applied for job #${jobId}!`);
    applyButton.textContent = "Already applied";
    applyButton.disabled = true;
    applyButton.style.background = "#27ae60";
  }, 1500);
}

// function viewJob(jobId) {
//   // Simulate viewing job details
//   alert(`Viewing details for job #${jobId}`);
//   // In a real app, this would redirect to a job details page
// }

function logout() {
  // Simulate logging out
  if (confirm("Are you sure you want to log out?")) {
    alert("Logged out successfully");
    window.location.href = "../index.html";
  }
}

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  // Keyboard shortcuts for applicant dashboard
  if (e.ctrlKey) {
    switch (e.key) {
      case "1":
        window.scrollTo(0, 0);
        break;
      case "2":
        document.querySelector(".job-offers-section").scrollIntoView();
        break;
      case "3":
        document.querySelector(".applications-section").scrollIntoView();
        break;
    }
  }
});
