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

    Swal.fire({
      icon: "success",
      title: "Offer Created",
      text: "Your new job offer has been created successfully.",
      confirmButtonColor: "#27ae60", // verde principal
      background: "#f0fff4",         // fondo claro
      color: "#2c2c2c",
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

  const editButtons = document.querySelectorAll(".btn-edit-offer");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const offerId = button.dataset.id;
      const card = document.querySelector(`.offer-card[data-id="${offerId}"]`);

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

      document.getElementById("jobTitle").value = title;
      document.getElementById("jobSalary").value = salary;
      document.getElementById("jobDescription").value = description;
      document.getElementById("jobMode").value = mode;
      document.getElementById("jobLevel").value = level;

      openModal(editModal);
    });
  });

  closeEditBtn.addEventListener("click", () => closeModal(editModal));
  cancelEditBtn.addEventListener("click", () => closeModal(editModal));

  window.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal(editModal);
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("Datos editados:", {
      title: editForm.jobTitle.value,
      mode: editForm.jobMode.value,
      level: editForm.jobLevel.value,
      salary: editForm.jobSalary.value,
      description: editForm.jobDescription.value,
    });

    Swal.fire({
      icon: "success",
      title: "Offer Updated",
      text: "The job offer has been updated successfully.",
      confirmButtonColor: "#27ae60",
      background: "#f0fff4",
      color: "#2c2c2c",
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
  document.querySelector(".user-info").textContent = `Hello, ${companyData.name}`;
}

function loadActiveOffers() {
  console.log("Loading active job offers...");
}

function loadCompanyStats() {
  console.log("Loading company statistics...");
}

function createNewOffer() {
  Swal.fire({
    icon: "info",
    title: "Create Offer",
    text: "Redirecting to create a new job offer.",
    confirmButtonColor: "#27ae60",
    background: "#f0fff4",
    color: "#2c2c2c",
  });
}

function viewApplicants(offerId) {
  Swal.fire({
    icon: "info",
    title: "Applicants",
    text: `Viewing applicants for job offer #${offerId}.`,
    confirmButtonColor: "#27ae60",
    background: "#f0fff4",
    color: "#2c2c2c",
  });
}

function completeProfile() {
  Swal.fire({
    icon: "info",
    title: "Profile",
    text: "Redirecting to complete company profile.",
    confirmButtonColor: "#27ae60",
    background: "#f0fff4",
    color: "#2c2c2c",
  });
}

function viewPendingApplications() {
  Swal.fire({
    icon: "info",
    title: "Pending Applications",
    text: "Viewing pending applications for review.",
    confirmButtonColor: "#27ae60",
    background: "#f0fff4",
    color: "#2c2c2c",
  });
}

function logout() {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out from your session.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",      // rojo peligro
    cancelButtonColor: "#27ae60",    // verde coherente
    confirmButtonText: "Yes, log out",
    background: "#f0fff4",
    color: "#2c2c2c",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been logged out successfully.",
        confirmButtonColor: "#27ae60",
        background: "#f0fff4",
        color: "#2c2c2c",
      }).then(() => {
        window.location.href = "../index.html";
      });
    }
  });
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
