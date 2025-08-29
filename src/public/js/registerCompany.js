// src/public/js/registerCompany.js
// Registro REAL de Company contra el backend (POST /api/companies)

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('companyRegisterForm');
  if (!registerForm) return;

  // Mensajes
  let msg = document.getElementById('registerCompanyMsg');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'registerCompanyMsg';
    msg.style.marginTop = '8px';
    registerForm.appendChild(msg);
  }
  const showMsg = (t, ok=false) => {
    if (window.Swal) {
      Swal.fire({ icon: ok ? 'success' : 'error', title: ok ? 'OK' : 'Error', text: t });
    } else {
      msg.textContent = t;
      msg.className = ok ? 'form-msg ok' : 'form-msg error';
    }
  };

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const companyName      = document.getElementById('companyName')?.value.trim() || '';
    const email            = document.getElementById('companyEmail')?.value.trim() || '';
    const password         = document.getElementById('companyPassword')?.value || '';
    const confirmPassword  = document.getElementById('companyConfirmPassword')?.value || '';

    // Validaciones básicas
    if (!companyName || !email || !password || !confirmPassword) {
      showMsg('Completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      showMsg('Las contraseñas no coinciden.');
      return;
    }

    // Botón loading
    const registerButton = registerForm.querySelector('.company-btn');
    const originalText = registerButton ? registerButton.textContent : '';
    if (registerButton) { registerButton.textContent = 'Creando cuenta...'; registerButton.disabled = true; }

    // IMPORTANTE:
    // Tu tabla Companies exige varios campos NOT NULL (industry, contact_person, phone, address).
    // Como el form actual solo pide nombre/email/password, mandamos valores por defecto razonables.
    const payload = {
      name: companyName,
      industry: 'General',             // requerido por tu esquema
      website: null,
      company_size: null,
      description: null,
      contact_person: companyName,     // requerido por tu esquema
      contact_position: null,
      email,
      phone: '0000000000',             // requerido (placeholder)
      address: 'Pending',              // requerido (placeholder)
      password
    };

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // 409 → email/website duplicado, etc.
        showMsg(data.error || 'No se pudo registrar la empresa.');
        return;
      }

      // OK → guardar company_id y redirigir
      localStorage.setItem('company_id', String(data.id));
      showMsg('Empresa creada correctamente. Redirigiendo…', true);
      window.location.href = 'dashboardCompany.html';
    } catch (err) {
      console.error('[registerCompany] Error:', err);
      showMsg('Error de red. Inténtalo nuevamente.');
    } finally {
      if (registerButton) { registerButton.textContent = originalText; registerButton.disabled = false; }
    }
  });

  // Accesibilidad: Enter dentro del form
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
      if (registerForm.contains(document.activeElement)) {
        registerForm.dispatchEvent(new Event('submit'));
      }
    }
  });
});
