// src/public/js/loginCompany.js
// Login de Company con bloqueo si el email no existe o la password es incorrecta.
// Guarda company_id en localStorage SOLO cuando el backend responde 200.

document.addEventListener('DOMContentLoaded', () => {
  // Evita entrar “por accidente” con un company_id previo
  localStorage.removeItem('company_id');

  const form = document.getElementById('companyLoginForm');
  if (!form) return;

  const emailEl = form.querySelector('#companyEmail, [name="companyEmail"], input[type="email"]');
  const passEl  = form.querySelector('#companyPassword, [name="companyPassword"], input[type="password"]');

  // Zona de mensajes (usa Swal si está disponible; fallback a texto)
  let msg = document.getElementById('loginCompanyMsg');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'loginCompanyMsg';
    msg.style.marginTop = '8px';
    form.appendChild(msg);
  }
  const showMsg = (t, ok = false) => {
    if (window.Swal) {
      Swal.fire({ icon: ok ? 'success' : 'error', title: ok ? 'OK' : 'Error', text: t });
    } else {
      msg.textContent = t;
      msg.className = ok ? 'form-msg ok' : 'form-msg error';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (emailEl?.value || '').trim();
    const password = passEl?.value || '';
    if (!email || !password) { showMsg('Por favor ingresa email y contraseña.'); return; }

    try {
      const res = await fetch('/api/auth/company/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Backend: 'El correo no está registrado' o 'Contraseña incorrecta'
        showMsg(data.error || 'Credenciales inválidas');
        return; // ⛔ no redirigir
      }

      // ✅ OK
      localStorage.setItem('company_id', String(data.id));
      window.location.href = '/views/dashboardCompany.html';
    } catch (err) {
      console.error('[loginCompany] Error:', err);
      showMsg('Error de red. Intenta nuevamente.');
    }
  });

  // Enviar con Enter SOLO si el foco está dentro del form
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
      if (form.contains(document.activeElement)) {
        form.dispatchEvent(new Event('submit'));
      }
    }
  });
});
