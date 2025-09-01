// src/public/js/loginCompany.js
// Company login with blocking if the email does not exist or the password is incorrect.
// Saves company_id in localStorage ONLY when the backend responds with 200 OK.

document.addEventListener("DOMContentLoaded", () => {
  // Detect if running on localhost or production
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );

  const API_BASE = isLocalhost
    ? "http://localhost:5173" // Local Backend Host
    : "https://jobfinder-jdp5.onrender.com"; // Production Backend (Render)

  // Prevent accidental login with a previous company_id
  localStorage.removeItem("company_id");

  const form = document.getElementById("companyLoginForm");
  if (!form) return;

  const emailEl = form.querySelector(
    '#companyEmail, [name="companyEmail"], input[type="email"]'
  );
  const passEl = form.querySelector(
    '#companyPassword, [name="companyPassword"], input[type="password"]'
  );

  // Message area (uses Swal if available; fallback to text)
  let msg = document.getElementById("loginCompanyMsg");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "loginCompanyMsg";
    msg.style.marginTop = "8px";
    form.appendChild(msg);
  }
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (emailEl?.value || "").trim();
    const password = passEl?.value || "";
    if (!email || !password) {
      showMsg("Please enter email and password.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/company/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Backend: 'Email not registered' or 'Incorrect password'
        showMsg(data.error || "Invalid credentials");
        return; // ⛔ do not redirect
      }

      // ✅ OK
      localStorage.setItem("company_id", String(data.id));
      window.location.href = "/views/dashboardCompany.html";
    } catch (err) {
      console.error("[loginCompany] Error:", err);
      showMsg("Network error. Please try again.");
    }
  });

  // Submit with Enter ONLY if the focus is inside the form
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
      if (form.contains(document.activeElement)) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  });
});
