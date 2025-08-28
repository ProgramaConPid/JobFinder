// Company dashboard functionalities
document.addEventListener("DOMContentLoaded", function () {
  console.log("Company dashboard loaded");

  // Load company data
  loadCompanyData();

  // Load active job offers
  loadActiveOffers();

  // Load company statistics
  loadCompanyStats();

  /* -------------------------
     Funciones generales modales
  ---------------------------- */
  function openModal(modal) {
    modal.style.display = "block";
    modal.classList.add("show");
  }

  function closeModal(modal) {
    modal.classList.remove("show");
    modal.classList.add("closing");
    modal.addEventListener(
      "animationend",
      () => {
        modal.style.display = "none";
        modal.classList.remove("closing");
      },
      { once: true }
    );
  }

  /* -------------------------
     Modal Create New Offer
  ---------------------------- */
  const createModal = document.getElementById("createOfferModal");
  const openCreateBtn = document.getElementById("createNewOffer");
  const closeCreateBtn = document.getElementById("closeCreateOffer");
  const cancelCreateBtn = document.getElementById("cancelCreateOffer");
  const createForm = document.getElementById("createOfferForm");

  // Abrir modal
  openCreateBtn.addEventListener("click", () => openModal(createModal));

  // Cerrar modal (X y Cancel)
  closeCreateBtn.addEventListener("click", () => closeModal(createModal));
  cancelCreateBtn.addEventListener("click", () => closeModal(createModal));

  // Cerrar clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === createModal) closeModal(createModal);
  });

  // Submit (temporal)
  createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Nueva oferta creada:", {
      title: createForm.newJobTitle.value,
      salary: createForm.newJobSalary.value,
      mode: createForm.newJobMode.value,
      level: createForm.newJobLevel.value,
      description: createForm.newJobDescription.value,
    });
    closeModal(createModal);
    createForm.reset();
  });

  /* -------------------------
     Modal Edit Offer
  ---------------------------- */
  const editModal = document.getElementById("editOfferModal");
  const closeEditBtn = document.getElementById("closeEditOffer");
  const cancelEditBtn = document.getElementById("cancelEditOffer");
  const editForm = document.getElementById("editOfferForm");

  // Buttons Edit
  const editButtons = document.querySelectorAll(".btn-edit-offer");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const offerId = button.dataset.id;
      const card = document.querySelector(`.offer-card[data-id="${offerId}"]`);

      // Extraer datos
      const title = card.querySelector(".offer-title").innerText;
      const salary = card.querySelector(".offer-salary-value").innerText;
      const description = card.querySelector(".offer-description").innerText;
      const mode = card.querySelector(".offer-tag.remote")
        ? "remote"
        : card.querySelector(".offer-tag.hybrid")
        ? "hybrid"
        : "onsite";
      const level = card
        .querySelector(".offer-tag.level")
        .innerText.toLowerCase();

      // Pasar al formulario
      document.getElementById("jobTitle").value = title;
      document.getElementById("jobSalary").value = salary;
      document.getElementById("jobDescription").value = description;
      document.getElementById("jobMode").value = mode;
      document.getElementById("jobLevel").value = level;

      // Mostrar modal
      openModal(editModal);
    });
  });

  // Cerrar modal
  closeEditBtn.addEventListener("click", () => closeModal(editModal));
  cancelEditBtn.addEventListener("click", () => closeModal(editModal));

  window.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal(editModal);
  });

  // Guardar cambios
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("Datos editados:", {
      title: editForm.jobTitle.value,
      mode: editForm.jobMode.value,
      level: editForm.jobLevel.value,
      salary: editForm.jobSalary.value,
      description: editForm.jobDescription.value,
    });

    closeModal(editModal);
  });
});

/* -------------------------
   Funciones auxiliares
---------------------------- */
function loadCompanyData() {
  const companyData = {
    name: "TechCorp",
    email: "contact@techcorp.com",
    profileCompletion: 90,
  };
  document.querySelector(
    ".user-info"
  ).textContent = `Hello, ${companyData.name}`;
}

function loadActiveOffers() {
  console.log("Loading active job offers...");
}

function loadCompanyStats() {
  console.log("Loading company statistics...");
}

function createNewOffer() {
  alert("Redirecting to create a new job offer");
}

function viewApplicants(offerId) {
  alert(`Viewing applicants for job offer #${offerId}`);
}

function completeProfile() {
  alert("Redirecting to complete company profile");
}

function viewPendingApplications() {
  alert("Viewing pending applications for review");
}

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    alert("Logged out successfully");
    window.location.href = "../index.html";
  }
}

/* -------------------------
   Keyboard navigation
---------------------------- */
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey) {
    switch (e.key) {
      case "n":
        createNewOffer();
        break;
      case "p":
        completeProfile();
        break;
      case "a":
        viewPendingApplications();
        break;
    }
  }
});
