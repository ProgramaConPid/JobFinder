// src/public/js/loginCoder.js
// Applicant (Coder) login. Validates against the database; shows alert if not found.

document.addEventListener("DOMContentLoaded", () => {
  // Detect if running on localhost or production
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );
  const API_BASE = isLocalhost
    ? "http://localhost:5173" // Local backend
    : "https://jobfinder-jdp5.onrender.com"; // Production backend

  const form = document.getElementById("coderLoginForm");
  if (!form) return;

  // Clear previous session for security
  try {
    localStorage.removeItem("applicant_id");
  } catch {}

  // Show error message (SweetAlert2 or fallback to alert)
  function showError(msg) {
    if (window.Swal) {
      Swal.fire({ icon: "error", title: "Login", text: msg });
    } else {
      alert(msg);
    }
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();

    if (!email || !password) {
      return showError("Please fill in all fields");
    }

    // Show loading state on button
    const btn = form.querySelector("button[type='submit'], .btn-login");
    const prevText = btn ? btn.textContent : null;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Signing in...";
    }

    try {
      // Send POST request to backend to log in
      const res = await fetch(`${API_BASE}/api/auth/coder/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Save applicant_id and redirect to dashboard
        try {
          localStorage.setItem("applicant_id", String(data.applicant_id));
        } catch {}
        window.location.href = "/views/dashboardCoder.html";
        return;
      }

      // Handle not registered and incorrect password errors
      if (res.status === 404) return showError("You are not registered");
      if (res.status === 401) return showError("Incorrect password");

      // Show other errors
      const msg = data?.error || "Could not log in.";
      showError(msg);
    } catch (err) {
      console.error("[loginCoder] Error:", err);
      showError("Network error. Try again.");
    } finally {
      // Restore button state
      if (btn) {
        btn.disabled = false;
        if (prevText) btn.textContent = prevText;
      }
    }
  });

  // Enter: submit only if focus is inside the form
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
      if (form.contains(document.activeElement)) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  });
});
