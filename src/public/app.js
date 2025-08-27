// Función para seleccionar el rol y redirigir a la página correspondiente
function selectRole(role) {
  if (role === "applicant") {
    window.location.href = "./views/loginCoder.html";
  } else if (role === "company") {
    window.location.href = "./views/loginCompany.html";
  }
}

// Efectos adicionales al pasar el cursor por las tarjetas
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".option-card");

  cards.forEach((card) => {
    // Añadir efecto de elevación al pasar el cursor
    card.addEventListener("mouseenter", function () {
      this.style.zIndex = "10";
    });

    // Restablecer al quitar el cursor
    card.addEventListener("mouseleave", function () {
      this.style.zIndex = "1";
    });

    // Permitir hacer clic en toda la tarjeta, no solo en el botón
    card.addEventListener("click", function (e) {
      // Evitar que se dispare dos veces si se hace clic en el botón
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

  // Añadir teclado accesible
  document.addEventListener("keydown", function (e) {
    if (e.key === "1" || e.key === "a") {
      selectRole("applicant");
    } else if (e.key === "2" || e.key === "e") {
      selectRole("company");
    }
  });
});

// Efectos adicionales al pasar el cursor por las tarjetas
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".option-card");

  cards.forEach((card) => {
    // Añadir efecto de elevación al pasar el cursor
    card.addEventListener("mouseenter", function () {
      this.style.zIndex = "10";
    });

    // Restablecer al quitar el cursor
    card.addEventListener("mouseleave", function () {
      this.style.zIndex = "1";
    });

    // Permitir hacer clic en toda la tarjeta, no solo en el botón
    card.addEventListener("click", function (e) {
      // Evitar que se dispare dos veces si se hace clic en el botón
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

  // Añadir teclado accesible
  document.addEventListener("keydown", function (e) {
    if (e.key === "1" || e.key === "a") {
      selectRole("applicant");
    } else if (e.key === "2" || e.key === "e") {
      selectRole("company");
    }
  });
});

// Logical Modal - Ofertas
const btnOpenModal = document.getElementById("createNewOffer");
const btnCloseModal = document.getElementById("closeNewOffer");
const modalWindow = document.getElementById("modalNewOffer");

btnOpenModal.addEventListener("click", (e) => {
  modalWindow.classList.add("active");
});

btnCloseModal.addEventListener("click", (e) => {
  e.preventDefault();
  if (modalWindow.classList.contains("active")) {
    modalWindow.classList.remove("active");
  }
});

// Logica Modal - Editar 
const modalEditOffer = document.getElementById("modalEditOffer");
const btnsEdit = document.querySelectorAll(".btn-edit-offer");
const btnCloseEdit = document.getElementById("closeEditOffer");

// Abrir modal al hacer clic en cualquier botón Edit
btnsEdit.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalEditOffer.classList.add("active");
  });
});

// Cerrar Modal
btnCloseEdit.addEventListener("click", (e) => {
  e.preventDefault();
  modalEditOffer.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === modalEditOffer) {
    modalEditOffer.classList.remove("active");
  }
});
