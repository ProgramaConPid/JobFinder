// src/public/js/loginCoder.js
// Login de Applicant (Coder). Valida en BD; si no existe muestra aviso.

document.addEventListener("DOMContentLoaded", () => {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const API_BASE = isLocalhost
    ? "http://localhost:5173" // Backend local
    : "https://jobfinder-jdp5.onrender.com"; // Backend producción

  const form = document.getElementById("coderLoginForm");
  if (!form) return;

  // Limpia sesión previa por seguridad
  try { localStorage.removeItem("applicant_id"); } catch {}

  function showError(msg) {
    if (window.Swal) {
      Swal.fire({ icon: "error", title: "Login", text: msg });
    } else {
      alert(msg);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();

    if (!email || !password) {
      return showError("Please fill in all fields");
    }

    const btn = form.querySelector("button[type='submit'], .btn-login");
    const prevText = btn ? btn.textContent : null;
    if (btn) { btn.disabled = true; btn.textContent = "Signing in..."; }

    try {
      const res = await fetch(`${API_BASE}/api/auth/coder/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        try { localStorage.setItem("applicant_id", String(data.applicant_id)); } catch {}
        window.location.href = "/views/dashboardCoder.html";
        return;
      }

      if (res.status === 404) return showError("No estás registrado");
      if (res.status === 401) return showError("Contraseña incorrecta");

      const msg = data?.error || "No se pudo iniciar sesión.";
      showError(msg);
    } catch (err) {
      console.error("[loginCoder] Error:", err);
      showError("Network error. Try again.");
    } finally {
      if (btn) { btn.disabled = false; if (prevText) btn.textContent = prevText; }
    }
  });

  // Enter: enviar solo si el foco está dentro del form
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
      if (form.contains(document.activeElement)) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  });
});
