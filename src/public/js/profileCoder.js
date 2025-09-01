// src/public/js/profileCoder.js
document.addEventListener("DOMContentLoaded", () => {
  // Detect if running on localhost or production
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );
  const API_BASE = isLocalhost
    ? "http://localhost:5173"
    : "https://jobfinder-jdp5.onrender.com";

  // Helper for querySelector
  const $ = (sel, root = document) => root.querySelector(sel);

  // Get applicant_id from URL or localStorage
  const getApplicantId = () => {
    const p = new URLSearchParams(window.location.search).get("applicant_id");
    if (p && /^\d+$/.test(p)) return Number(p);
    const ls = localStorage.getItem("applicant_id");
    if (ls && /^\d+$/.test(ls)) return Number(ls);
    return null;
  };

  const profileForm = $("#profileForm");
  if (!profileForm) return;

  const msgEl = $("#profileMsg");

  // Show feedback message (success or error)
  const showMsg = (text, ok = true) => {
    if (!msgEl) return alert(text);
    msgEl.textContent = text;
    msgEl.className = ok ? "form-msg ok" : "form-msg error";
  };

  // Fill form fields with data from backend
  const setFormValues = (data) => {
    const map = {
      first_name: "#first_name",
      last_name: "#last_name",
      email: "#email",
      phone: "#phone",
      address: "#address",
      skills: "#skills",
      resume_url: "#resume_url",
      github_url: "#github_url",
      portfolio_url: "#portfolio_url",
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

  // Get current form values as an object
  const getFormValues = () => {
    const v = (sel) => ($(sel)?.value ?? "").trim();
    return {
      first_name: v("#first_name"),
      last_name: v("#last_name"),
      phone: v("#phone"),
      address: v("#address"),
      skills: v("#skills"),
      resume_url: v("#resume_url"),
      github_url: v("#github_url"),
      portfolio_url: v("#portfolio_url"),
      linkedin: v("#linkedin"),
      twitter: v("#twitter"),
      facebook: v("#facebook"),
      instagram: v("#instagram"),
    };
  };

  // Get applicant ID for profile actions
  const id = getApplicantId();
  if (!id) {
    showMsg("applicant_id not found. Please log in again.", false);
    return;
  }

  // Load profile from backend
  (async () => {
    try {
      const r = await fetch(`${API_BASE}/api/coders/${id}`, {
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

  // Save profile changes to backend
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const payload = getFormValues();
      const r = await fetch(`${API_BASE}/api/coders/${id}`, {
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
