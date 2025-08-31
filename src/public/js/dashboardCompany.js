// src/public/js/dashboardCompany.js
(function () {
  // API base
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );

  const API_BASE = isLocalhost
    ? "http://localhost:5173" // Local Backend Host
    : "https://jobfinder-jdp5.onrender.com"; // Backend on production (Render - Web Service)

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const getCompanyId = () => {
    const p = new URLSearchParams(window.location.search).get("company_id");
    if (p && /^\d+$/.test(p)) return p;
    const ls = localStorage.getItem("company_id");
    if (ls && /^\d+$/.test(ls)) return ls;
    return null;
  };

  // ====== CONTADOR DE OFERTAS (ADICIÓN MÍNIMA) ======
  function updateActiveOffersCount(n) {
    const el = document.getElementById("activeOffersCount");
    if (el) el.textContent = Number(n) || 0;
  }
  function recalcActiveOffersCount() {
    const cont = document.querySelector(".offer-cards");
    const n = cont ? cont.querySelectorAll(".offer-card").length : 0;
    updateActiveOffersCount(n);
  }
  // ==================================================

  // Logout
  window.logout = function () {
    try {
      localStorage.removeItem("company_id");
    } catch {}
    window.location.href = "./loginCompany.html";
  };

  // Modales
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("show");
    modalEl.style.display = "block";
    if (!$(".modal-backdrop")) {
      const bd = document.createElement("div");
      bd.className = "modal-backdrop";
      document.body.appendChild(bd);
    }
    document.body.classList.add("modal-open");
  }
  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("show");
    modalEl.style.display = "none";
    const bd = $(".modal-backdrop");
    if (bd) bd.remove();
    document.body.classList.remove("modal-open");
  }

  // Estado
  let offersState = [];
  window.offersIndex = new Map();

  // Render helpers
  const salaryText = (min, max) => {
    const hasMin = min !== null && min !== undefined && String(min) !== "";
    const hasMax = max !== null && max !== undefined && String(max) !== "";
    if (!hasMin && !hasMax) return "A convenir";
    const a = hasMin ? Number(min) : "";
    const b = hasMax ? Number(max) : "";
    return `${a}${hasMin && hasMax ? " - " : ""}${b}`;
  };

  function renderOffers(offers, cont) {
    cont.innerHTML = "";
    if (!Array.isArray(offers) || offers.length === 0) {
      cont.innerHTML =
        `<div class="no-offers">
          <p>Aún no tienes ofertas publicadas.</p>
        </div>`;
      // === contador cuando no hay ofertas ===
      updateActiveOffersCount(0);
      return;
    }
    offers.forEach((o) => {
      const modalityClass = String(o.modality || "")
        .toLowerCase()
        .includes("remote")
        ? "remote"
        : String(o.modality || "")
            .toLowerCase()
            .includes("hybrid")
        ? "hybrid"
        : "onsite";
      const created = o.created_at
        ? new Date(o.created_at).toLocaleDateString()
        : "-";
      const updated = o.updated_at
        ? new Date(o.updated_at).toLocaleDateString()
        : "-";

      const card = document.createElement("div");
      card.className = "offer-card";
      card.dataset.id = o.id;
      card.innerHTML = `
        <div class="offer-header">
          <h3 class="offer-title">${o.title}</h3>
          <div class="offer-tags">
            <span class="offer-tag ${modalityClass}">${o.modality}</span>
            <span class="offer-tag level">${o.level}</span>
          </div>
        </div>
        <div class="offer-details">
          <div class="offer-location">
            <strong data-i18n="dashboardCompany.location">Location:</strong>
            <span class="offer-job-location">${o.location}</span>
          </div>
          <div class="offer-salary"><strong>Salary:</strong>
            <span class="offer-salary-value">${salaryText(
              o.salary_min,
              o.salary_max
            )}</span>
          </div>
          <div class="description-offer"><p class="offer-description">${
            o.description
          }</p></div>
          <div class="offer-stats">
            <span class="stat-item-offer"><strong>Date posted:</strong> ${created}</span>
            <span class="stat-item-offer"><strong>Last update:</strong> ${updated}</span>
          </div>
        </div>
        <div class="offer-actions">
          <button class="btn-view-applicants" type="button"><img src="../assets/img/eye_icon.png" alt="" />View Applicants</button>
          <button class="btn-edit-offer" type="button"><img src="../assets/img/edit_icon.png" alt="" />Edit</button>
          <button class="btn-delete-offer" type="button" title="Delete"><img src="../assets/img/trash_icon.png" alt="" /></button>
        </div>
      `;
      cont.appendChild(card);
    });
    // === contador con total renderizado ===
    updateActiveOffersCount(offers.length);
  }

  async function loadActiveOffers() {
    const cont = document.querySelector(".offer-cards");
    if (!cont) return;
    const companyId = getCompanyId();
    if (!companyId) {
      cont.innerHTML =
        '<div class="warn-msg">No se detectó company_id. Inicia sesión.</div>';
      // === contador sin sesión ===
      updateActiveOffersCount(0);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/offers?company_id=${encodeURIComponent(companyId)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const offers = await res.json();

      offersState = offers;
      window.offersIndex = new Map(offers.map((o) => [Number(o.id), o]));
      renderOffers(offers, cont);
    } catch (err) {
      console.error("[CompanyDashboard] loadActiveOffers error:", err);
      cont.innerHTML =
        '<div class="error-msg">No se pudieron cargar las ofertas.</div>';
      // === contador en error ===
      updateActiveOffersCount(0);
    }
  }

  // Mapas/parsers
  const mapModality = (v) =>
    ({
      remote: "Remote",
      hybrid: "Hybrid",
      "on-site": "On-site",
      onsite: "On-site",
    }[String(v || "").toLowerCase()] || null);
  const revModality = (v) =>
    ({ remote: "remote", hybrid: "hybrid", "on-site": "on-site" }[
      String(v || "").toLowerCase()
    ] || "on-site");
  const mapLevel = (v) =>
    ({ junior: "Junior", "mid-level": "Mid-level", senior: "Senior" }[
      String(v || "").toLowerCase()
    ] || null);
  const revLevel = (v) =>
    ({ junior: "junior", "mid-level": "mid-level", senior: "senior" }[
      String(v || "").toLowerCase()
    ] || "junior");

  const parseSalaryRange = (s) => {
    if (!s) return { min: null, max: null };
    const cleaned = String(s)
      .replace(/[^\d,.\-–—]/g, "")
      .replace(/[–—]/g, "-");
    const parts = cleaned
      .split("-")
      .map((x) => x.trim())
      .filter(Boolean);
    const toNum = (x) => {
      if (!x) return null;
      const n = Number(x.replace(/,/g, ""));
      return Number.isFinite(n) ? n : null;
    };
    if (parts.length === 1) return { min: toNum(parts[0]), max: null };
    if (parts.length >= 2)
      return { min: toNum(parts[0]), max: toNum(parts[1]) };
    return { min: null, max: null };
  };
  const buildSalaryRangeText = (min, max) => {
    if (min == null && max == null) return "";
    if (min != null && max == null) return `${min}`;
    if (min == null && max != null) return `0 - ${max}`;
    return `${min} - ${max}`;
  };

  // CREATE
  function initCreateOfferModal() {
    const createModal = $("#createOfferModal");
    const createForm = $("#createOfferForm");
    if (!createForm) return;

    [
      ".btn-create-offer",
      "#btnCreateOffer",
      '[data-open-modal="createOfferModal"]',
    ].forEach((sel) => {
      $$(sel).forEach((btn) => {
        try {
          btn.type = "button";
        } catch {}
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          openModal(createModal);
          setTimeout(() => $("#newJobTitle")?.focus(), 0);
        });
      });
    });

    [
      "#closeCreateOffer",
      "#cancelCreateOffer",
      ".btn-cancel",
      ".btn-close",
    ].forEach((sel) => {
      $$(sel, createModal || document).forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          closeModal(createModal);
        });
      });
    });

    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const companyId = getCompanyId();
      const title = createForm.newJobTitle?.value?.trim() || "";
      const location = createForm.newJobLocation?.value.trim() || "";
      const salaryRaw = createForm.newJobSalary?.value?.trim() || "";
      const modalityRaw = createForm.newJobMode?.value || "";
      const levelRaw = createForm.newJobLevel?.value || "";
      const description = createForm.newJobDescription?.value?.trim() || "";

      if (!companyId || !title || !location || !modalityRaw || !levelRaw || !description) {
        (window.Swal &&
          Swal.fire({
            icon: "error",
            title: "Incomplete fields",
            text: "Please complete all required fields.",
          })) ||
          alert("Complete all fields");
        return;
      }

      const modality = mapModality(modalityRaw);
      const level = mapLevel(levelRaw);
      if (!modality || !level) {
        (window.Swal &&
          Swal.fire({
            icon: "error",
            title: "Valores inválidos",
            text: "Revisa modality/level.",
          })) ||
          alert("Valores inválidos");
        return;
      }

      const { min: salary_min, max: salary_max } = parseSalaryRange(salaryRaw);
      const autoLocation = location ? location : "Por definir";

      const payload = {
        company_id: Number(companyId),
        title,
        description,
        location: autoLocation,
        salary_min,
        salary_max,
        modality,
        level,
      };

      const submitBtn = createForm.querySelector(".btn-save, [type='submit']");
      const prevTxt = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving...";
      }

      try {
        const res = await fetch(`${API_BASE}/api/offers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.error || "No se pudo crear la oferta.";
          (window.Swal &&
            Swal.fire({ icon: "error", title: "Error", text: msg })) ||
            alert(msg);
          return;
        }

        createForm.reset();
        closeModal(createModal);
        window.Swal &&
          Swal.fire({
            icon: "success",
            title: "Offer Created",
            timer: 1200,
            showConfirmButton: false,
          });
        await loadActiveOffers();
      } catch (err) {
        console.error("[CreateOffer] Error:", err);
        (window.Swal &&
          Swal.fire({
            icon: "error",
            title: "Error de red",
            text: "Inténtalo nuevamente.",
          })) ||
          alert("Error de red");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = prevTxt;
        }
      }
    });
  }

  // EDIT
  function initEditOfferModal() {
    const editModal = $("#editOfferModal");
    const editForm = $("#editOfferForm");
    if (!editForm) return;

    [
      "#closeEditOffer",
      "#cancelEditOffer",
      ".btn-cancel",
      ".btn-close",
    ].forEach((sel) => {
      $$(sel, editModal || document).forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          closeModal(editModal);
        });
      });
    });

    const container = $(".offer-cards") || document;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-edit-offer");
      if (!btn) return;

      const card = btn.closest(".offer-card");
      const idStr = card?.dataset?.id;
      const id = Number(idStr);
      if (!Number.isFinite(id)) return;

      editForm.dataset.offerId = String(id);

      const offer = (window.offersIndex && window.offersIndex.get(id)) || {};
      $("#jobTitle").value = String(offer.title || "");
      $("#jobLocation").value = String(offer.location || "");
      $("#jobSalary").value = (() => {
        const min = offer.salary_min,
          max = offer.salary_max;
        if (min == null && max == null) return "";
        if (min != null && max == null) return `${min}`;
        if (min == null && max != null) return `0 - ${max}`;
        return `${min} - ${max}`;
      })();
      $("#jobMode").value = (function (v) {
        const m = String(v || offer.modality || "on-site").toLowerCase();
        if (m.includes("remote")) return "remote";
        if (m.includes("hybrid")) return "hybrid";
        return "on-site";
      })();
      $("#jobLevel").value = (function (v) {
        const m = String(v || offer.level || "junior").toLowerCase();
        if (m.includes("mid")) return "mid-level";
        if (m.includes("senior")) return "senior";
        return "junior";
      })();
      $("#jobDescription").value = String(offer.description || "");

      openModal(editModal);
    });

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const idStr = editForm.dataset.offerId;
      const id = Number(idStr);
      if (!Number.isFinite(id)) return;

      const title = $("#jobTitle")?.value?.trim() || "";
      const location = $("#jobLocation")?.value?.trim() || "";
      const salaryRaw = $("#jobSalary")?.value?.trim() || "";
      const modalityRaw = $("#jobMode")?.value || "";
      const levelRaw = $("#jobLevel")?.value || "";
      const description = $("#jobDescription")?.value?.trim() || "";

      if (!title || !location || !modalityRaw || !levelRaw || !description) {
        (window.Swal &&
          Swal.fire({
            icon: "error",
            title: "Campos incompletos",
            text: "Completa todos los campos requeridos.",
          })) ||
          alert("Completa los campos");
        return;
      }

      const modality = mapModality(modalityRaw);
      const level = mapLevel(levelRaw);
      const { min: salary_min, max: salary_max } = parseSalaryRange(salaryRaw);
      const autoLocation = location ? location : "Por definir";

      const payload = {
        title,
        description,
        location: autoLocation,
        salary_min,
        salary_max,
        modality,
        level,
      };

      const submitBtn = editForm.querySelector(".btn-save, [type='submit']");
      const prevTxt = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving...";
      }

      try {
        const res = await fetch(
          `${API_BASE}/api/offers/${encodeURIComponent(id)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.error || "No se pudo actualizar la oferta.";
          (window.Swal &&
            Swal.fire({ icon: "error", title: "Error", text: msg })) ||
            alert(msg);
          return;
        }

        closeModal(editModal);
        window.Swal &&
          Swal.fire({
            icon: "success",
            title: "Offer Updated",
            timer: 1200,
            showConfirmButton: false,
          });
        await loadActiveOffers();
      } catch (err) {
        console.error("[EditOffer] Error:", err);
        (window.Swal &&
          Swal.fire({
            icon: "error",
            title: "Error de red",
            text: "Inténtalo nuevamente.",
          })) ||
          alert("Error de red");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = prevTxt;
        }
      }
    });
  }

  // DELETE — papelera (quita la card; no recarga toda la lista)
  function initDeleteOffer() {
    const container = document.querySelector(".offer-cards") || document;

    container.addEventListener("click", async (e) => {
      const delBtn = e.target.closest(".btn-delete-offer");
      if (!delBtn) return;

      const card = delBtn.closest(".offer-card");
      const id = Number(card?.dataset?.id);
      if (!Number.isFinite(id)) return;

      const title =
        card.querySelector(".offer-title")?.textContent?.trim() || "this offer";

      let confirmed = true;
      if (window.Swal) {
        const r = await Swal.fire({
          icon: "warning",
          title: "Delete offer?",
          html: `You are about to delete <b>${title}</b>.<br/>This action cannot be undone.`,
          showCancelButton: true,
          confirmButtonText: "Yes, delete",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#c0392b",
        });
        confirmed = r.isConfirmed;
      } else {
        confirmed = window.confirm(
          `Delete "${title}"? This action cannot be undone.`
        );
      }
      if (!confirmed) return;

      delBtn.disabled = true;

      try {
        const res = await fetch(
          `${API_BASE}/api/offers/${encodeURIComponent(id)}`,
          { method: "DELETE" }
        );
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = data?.error || "No se pudo eliminar la oferta.";
          (window.Swal &&
            Swal.fire({ icon: "error", title: "Error", text: msg })) ||
            alert(msg);
          delBtn.disabled = false;
          return;
        }

        // Remueve del DOM y del índice local
        card.remove();
        if (window.offersIndex instanceof Map) window.offersIndex.delete(id);

        // === actualizar contador tras eliminar ===
        recalcActiveOffersCount();

        window.Swal &&
          Swal.fire({
            icon: "success",
            title: "Offer deleted",
            timer: 1000,
            showConfirmButton: false,
          });
      } catch (err) {
        console.error("[DeleteOffer] Error:", err);
        (window.Swal &&
          Swal.fire({
            icon: "error",
            title: "Network error",
            text: "Inténtalo nuevamente.",
          })) ||
          alert("Network error");
      } finally {
        delBtn.disabled = false;
      }
    });
  }

  



  // INIT
  document.addEventListener("DOMContentLoaded", () => {
    loadActiveOffers();
    initCreateOfferModal();
    initEditOfferModal();
    initDeleteOffer();
  });
})();
