// src/public/js/registerCoder.js
// Registration of Applicant (Coder) adapted to the Applicants schema, with alerts and fallback.

document.addEventListener("DOMContentLoaded", () => {
  // Detect if running on localhost or production
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );
  const API_BASE = isLocalhost
    ? "http://localhost:5173"
    : "https://jobfinder-jdp5.onrender.com";

  const form = document.getElementById("coderRegisterForm");
  if (!form) return;

  // Helper to check if SweetAlert2 is available
  const hasSwal = () => typeof window.Swal !== "undefined";

  // Show error message (SweetAlert2 or fallback to alert)
  function showError(msg) {
    if (hasSwal()) {
      return Swal.fire({
        icon: "error",
        title: "Registration",
        text: msg,
        confirmButtonColor: "#6c5ce7",
      });
    } else {
      alert(msg);
      return Promise.resolve();
    }
  }

  // Show success message (SweetAlert2 or fallback to alert)
  async function showSuccess(msg) {
    if (hasSwal()) {
      await Swal.fire({
        icon: "success",
        title: "Registration",
        text: msg,
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      alert(msg);
    }
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById("fullName")?.value?.trim();
    const first_name = document.getElementById("firstName")?.value?.trim();
    const last_name = document.getElementById("lastName")?.value?.trim();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      ?.value?.trim();

    const phone = document.getElementById("phone")?.value?.trim();
    const address = document.getElementById("address")?.value?.trim();
    const profession = document.getElementById("profession")?.value?.trim();

    // Basic validations
    if ((!fullName && !first_name) || !email || !password || !confirmPassword) {
      return showError("Please complete all fields");
    }
    if (password !== confirmPassword) {
      return showError("Passwords do not match");
    }

    // Show loading state on button
    const btn = form.querySelector("button[type='submit'], .btn-register");
    const prevText = btn ? btn.textContent : null;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Registering...";
    }

    try {
      // Build request body
      const body = { email, password };

      if (first_name || last_name) {
        body.first_name = first_name || "";
        body.last_name = last_name || "-";
      } else if (fullName) {
        body.full_name = fullName; // server will split it
      }

      if (phone) body.phone = phone;
      if (address) body.address = address;
      if (profession) body.profession = profession;

      // Send POST request to backend to register applicant
      const res = await fetch(`${API_BASE}/api/auth/coder/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Save applicant_id and redirect to dashboard
        try {
          localStorage.setItem("applicant_id", String(data.applicant_id));
        } catch {}
        // Wait for alert to show, then redirect
        await showSuccess("Account created successfully");
        window.location.href = "/views/dashboardCoder.html";
        return;
      }

      // Handle duplicate email error
      if (res.status === 409) {
        return showError("Email is already registered");
      }

      // Show other errors
      const msg = data?.error || "Could not register.";
      showError(msg);
    } catch (err) {
      console.error("[registerCoder] Error:", err);
      showError("Network error. Please try again.");
    } finally {
      // Restore button state
      if (btn) {
        btn.disabled = false;
        if (prevText) btn.textContent = prevText;
      }
    }
  });

  // Accessibility: allow Enter key to submit form (except in textarea)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
      if (form.contains(document.activeElement)) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  });
});
