// src/public/js/profileCompany.js
document.addEventListener("DOMContentLoaded", () => {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );
  const API_BASE = isLocalhost
    ? "http://localhost:5173"
    : "https://jobfinder-jdp5.onrender.com";

  const $ = (sel, root = document) => root.querySelector(sel);

  const getCompanyId = () => {
    const p = new URLSearchParams(window.location.search).get("company_id");
    if (p && /^\d+$/.test(p)) return Number(p);
    const ls = localStorage.getItem("company_id");
    if (ls && /^\d+$/.test(ls)) return Number(ls);
    return null;
  };

  const companyForm = $("#companyForm");
  if (!companyForm) return;
  const msgEl = $("#profileMsg");

  const showMsg = (text, ok = true) => {
    if (!msgEl) return alert(text);
    msgEl.textContent = text;
    msgEl.className = ok ? "form-msg ok" : "form-msg error";
  };

  // Corregido: usar columnas reales de Companies
  const setFormValues = (data) => {
    const map = {
      name: "#name",
      email: "#email",
      phone: "#phone",
      address: "#address",
      description: "#description",
      website: "#website",   // ✅ existe en DB
      linkedin: "#linkedin",
      twitter: "#twitter",
      facebook: "#facebook",
      instagram: "#instagram",
    };
    for (const [k, sel] of Object.entries(map)) {
      const input = $(sel);
      if (input) input.value = data?.[k] ?? "";
    }
  };

  const getFormValues = () => {
    const v = (sel) => ($(sel)?.value ?? "").trim();
    return {
      name: v("#name"),
      phone: v("#phone"),
      address: v("#address"),
      description: v("#description"),
      website: v("#website"),   // ✅ existe en DB
      linkedin: v("#linkedin"),
      twitter: v("#twitter"),
      facebook: v("#facebook"),
      instagram: v("#instagram"),
    };
  };

  const id = getCompanyId();
  if (!id) {
    showMsg("company_id not found. Please log in again.", false);
    return;
  }

  // Load company profile
  (async () => {
    try {
      const r = await fetch(`${API_BASE}/api/companies/${id}`, {
        credentials: "include",
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || "Could not load profile");
      }
      const data = await r.json();
      setFormValues(data);
      showMsg("Profile loaded.");
    } catch (err) {
      console.error(err);
      showMsg(err.message, false);
    }
  })();

  // Save changes
  companyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const payload = getFormValues();
      const r = await fetch(`${API_BASE}/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || "Could not save profile");
      }
      const updated = await r.json();
      setFormValues(updated);
      showMsg("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      showMsg(err.message, false);
    }
  });
});
