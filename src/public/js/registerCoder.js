// src/public/js/registerCoder.js
// Registro de Applicant (Coder) adaptado al esquema Applicants, con alertas y fallback.

document.addEventListener("DOMContentLoaded", () => {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const API_BASE = isLocalhost
    ? "http://localhost:5173"
    : "https://jobfinder-jdp5.onrender.com";

  const form = document.getElementById("coderRegisterForm");
  if (!form) return;

  const hasSwal = () => typeof window.Swal !== "undefined";

  function showError(msg) {
    if (hasSwal()) {
      return Swal.fire({
        icon: "error",
        title: "Registro",
        text: msg,
        confirmButtonColor: "#6c5ce7",
      });
    } else {
      alert(msg);
      return Promise.resolve();
    }
  }

  async function showSuccess(msg) {
    if (hasSwal()) {
      await Swal.fire({
        icon: "success",
        title: "Registro",
        text: msg,
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      alert(msg);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName")?.value?.trim();
    const first_name = document.getElementById("firstName")?.value?.trim();
    const last_name  = document.getElementById("lastName")?.value?.trim();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();
    const confirmPassword = document.getElementById("confirmPassword")?.value?.trim();

    const phone = document.getElementById("phone")?.value?.trim();
    const address = document.getElementById("address")?.value?.trim();
    const profession = document.getElementById("profession")?.value?.trim();

    if ((!fullName && !first_name) || !email || !password || !confirmPassword) {
      return showError("Por favor completa todos los campos");
    }
    if (password !== confirmPassword) {
      return showError("Las contraseñas no coinciden");
    }

    const btn = form.querySelector("button[type='submit'], .btn-register");
    const prevText = btn ? btn.textContent : null;
    if (btn) { btn.disabled = true; btn.textContent = "Registrando..."; }

    try {
      const body = { email, password };

      if (first_name || last_name) {
        body.first_name = first_name || "";
        body.last_name = last_name || "-";
      } else if (fullName) {
        body.full_name = fullName; // el server lo separa
      }

      if (phone) body.phone = phone;
      if (address) body.address = address;
      if (profession) body.profession = profession;

      const res = await fetch(`${API_BASE}/api/auth/coder/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        try { localStorage.setItem("applicant_id", String(data.applicant_id)); } catch {}
        // Espera a que se muestre la alerta y luego redirige
        await showSuccess("Cuenta creada correctamente");
        window.location.href = "/views/dashboardCoder.html";
        return;
      }

      if (res.status === 409) {
        return showError("El email ya está registrado");
      }

      const msg = data?.error || "No se pudo registrar.";
      showError(msg);
    } catch (err) {
      console.error("[registerCoder] Error:", err);
      showError("Error de red. Intenta nuevamente.");
    } finally {
      if (btn) { btn.disabled = false; if (prevText) btn.textContent = prevText; }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
      if (form.contains(document.activeElement)) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  });
});
