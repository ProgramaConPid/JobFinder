// src/public/js/profileCoder.js
document.addEventListener('DOMContentLoaded', () => {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const API_BASE = isLocalhost ? "http://localhost:5173" : "https://jobfinder-jdp5.onrender.com";

  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const getApplicantId = () => {
    const p = new URLSearchParams(window.location.search).get("applicant_id");
    if (p && /^\d+$/.test(p)) return Number(p);
    const ls = localStorage.getItem("applicant_id");
    if (ls && /^\d+$/.test(ls)) return Number(ls);
    return null;
  };

  const profileForm = $('#profileForm');
  if (!profileForm) return;

  const msgEl = $('#profileMsg');

  const showMsg = (text, ok = true) => {
    if (!msgEl) return alert(text);
    msgEl.textContent = text;
    msgEl.className = ok ? 'form-msg ok' : 'form-msg error';
  };

  const setFormValues = (data) => {
    const map = {
      first_name: '#first_name',
      last_name: '#last_name',
      email: '#email',
      phone: '#phone',
      address: '#address',
      skills: '#skills',
      resume_url: '#resume_url',
      github_url: '#github_url',
      portfolio_url: '#portfolio_url',
      linkedin: '#linkedin',
      twitter: '#twitter',
      facebook: '#facebook',
      instagram: '#instagram'
    };
    for (const [k, sel] of Object.entries(map)) {
      const input = $(sel);
      if (input) input.value = data?.[k] ?? '';
    }
  };

  const getFormValues = () => {
    const v = (sel) => ($(sel)?.value ?? '').trim();
    return {
      first_name: v('#first_name'),
      last_name: v('#last_name'),
      phone: v('#phone'),
      address: v('#address'),
      skills: v('#skills'),
      resume_url: v('#resume_url'),
      github_url: v('#github_url'),
      portfolio_url: v('#portfolio_url'),
      linkedin: v('#linkedin'),
      twitter: v('#twitter'),
      facebook: v('#facebook'),
      instagram: v('#instagram')
    };
  };

  const id = getApplicantId();
  if (!id) {
    showMsg('No se encontró applicant_id. Inicia sesión de nuevo.', false);
    return;
  }

  // Load profile
  (async () => {
    try {
      const r = await fetch(`${API_BASE}/api/coders/${id}`, { credentials: 'include' });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || 'No se pudo cargar el perfil');
      }
      const data = await r.json();
      setFormValues(data);
      showMsg('Perfil cargado.');
    } catch (err) {
      console.error(err);
      showMsg(err.message, false);
    }
  })();

  // Save profile
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const payload = getFormValues();
      const r = await fetch(`${API_BASE}/api/coders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || 'No se pudo guardar el perfil');
      }
      const updated = await r.json();
      setFormValues(updated);
      showMsg('Perfil actualizado con éxito.');
    } catch (err) {
      console.error(err);
      showMsg(err.message, false);
    }
  });
});
