// src/public/js/registerCompany.js
// REAL registration of Company against the backend (POST /api/companies)

document.addEventListener("DOMContentLoaded", function () {
  // Detect if running on localhost or production
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );

  // Set API base URL depending on environment
  const API_BASE = isLocalhost
    ? "http://localhost:5173" // Local Backend Host
    : "https://jobfinder-jdp5.onrender.com"; // Production Backend (Render)

  const registerForm = document.getElementById("companyRegisterForm");
  if (!registerForm) return;

  // Message element for feedback
  let msg = document.getElementById("registerCompanyMsg");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "registerCompanyMsg";
    msg.style.marginTop = "8px";
    registerForm.appendChild(msg);
  }

  // Function to show feedback messages (uses SweetAlert2 if available)
  const showMsg = (t, ok = false) => {
    if (window.Swal) {
      Swal.fire({
        icon: ok ? "success" : "error",
        title: ok ? "OK" : "Error",
        text: t,
      });
    } else {
      msg.textContent = t;
      msg.className = ok ? "form-msg ok" : "form-msg error";
    }
  };

  // Handle form submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const companyName =
      document.getElementById("companyName")?.value.trim() || "";
    const email = document.getElementById("companyEmail")?.value.trim() || "";
    const password = document.getElementById("companyPassword")?.value || "";
    const confirmPassword =
      document.getElementById("companyConfirmPassword")?.value || "";

    // Basic validations
    if (!companyName || !email || !password || !confirmPassword) {
      showMsg("Please complete all fields.");
      return;
    }
    if (password !== confirmPassword) {
      showMsg("Passwords do not match.");
      return;
    }

    // Show loading state on button
    const registerButton = registerForm.querySelector(".company-btn");
    const originalText = registerButton ? registerButton.textContent : "";
    if (registerButton) {
      registerButton.textContent = "Creating account...";
      registerButton.disabled = true;
    }

    // IMPORTANT:
    // Your Companies table requires several NOT NULL fields (industry, contact_person, phone, address).
    // Since the current form only asks for name/email/password, we send reasonable default values.
    const payload = {
      name: companyName,
      industry: "General", // required by schema
      website: null,
      company_size: null,
      description: null,
      contact_person: companyName, // required by schema
      contact_position: null,
      email,
      phone: "0000000000", // required (placeholder)
      address: "Pending", // required (placeholder)
      password,
    };

    try {
      // Send POST request to backend to register company
      const res = await fetch(`${API_BASE}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 409 → duplicate email/website, etc.
        showMsg(data.error || "Could not register the company.");
        return;
      }

      // Success → save company_id and redirect
      localStorage.setItem("company_id", String(data.id));
      showMsg("Company created successfully. Redirecting…", true);
      window.location.href = "dashboardCompany.html";
    } catch (err) {
      console.error("[registerCompany] Error:", err);
      showMsg("Network error. Please try again.");
    } finally {
      // Restore button state
      if (registerButton) {
        registerButton.textContent = originalText;
        registerButton.disabled = false;
      }
    }
  });

  // Accessibility: allow Enter key to submit form (except in textarea)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
      if (registerForm.contains(document.activeElement)) {
        registerForm.dispatchEvent(new Event("submit"));
      }
    }
  });
});
