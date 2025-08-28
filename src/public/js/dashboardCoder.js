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
      const card = e.target.closest(".job-card");

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
  const userData = {
    name: "John Smith",
    email: "john@email.com",
    profileCompleted: true,
  };

  document.querySelector(".user-info").textContent = `Hello, ${userData.name}`;
}

function loadJobOffers() {
  console.log("Loading job offers...");
}

function loadUserApplications() {
  console.log("Loading user applications...");
}

function applyJob(jobId) {
  const applyButton = event.target;
  applyButton.textContent = "Applying...";
  applyButton.disabled = true;

  setTimeout(() => {
    Swal.fire({
      icon: "success",
      title: "Application Sent!",
      text: `You have successfully applied for job #${jobId}.`,
      confirmButtonColor: "#6A0DAD", // morado principal
      background: "#f5f0fa",         // fondo lila claro
      color: "#2c2c2c",              // texto oscuro
    });
    applyButton.textContent = "Already applied";
    applyButton.disabled = true;
    applyButton.style.background = "#27ae60"; // verde éxito
  }, 1500);
}

function logout() {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out from your session.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",      // rojo acción peligrosa
    cancelButtonColor: "#6A0DAD",    // morado botón cancelar
    confirmButtonText: "Yes, log out",
    background: "#f5f0fa",
    color: "#2c2c2c",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been logged out successfully.",
        confirmButtonColor: "#6A0DAD",
        background: "#f5f0fa",
        color: "#2c2c2c",
      }).then(() => {
        window.location.href = "../index.html";
      });
    }
  });
}

// Keyboard navigation
document.addEventListener("keydown", function (e) {
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

