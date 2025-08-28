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

  // Añadir teclado accesible
  document.addEventListener("keydown", function (e) {
    if (e.key === "1" || e.key === "a") {
      selectRole("applicant");
    } else if (e.key === "2" || e.key === "e") {
      selectRole("company");
    }
  });
});