// src/public/js/dashboardCompany.js
(function () {
  // API base URL selection (local or production)
  const isLocalhost = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );
  const API_BASE = isLocalhost
    ? "http://localhost:5173"
    : "https://jobfinder-jdp5.onrender.com";

  // Helper functions for DOM selection
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Get company_id from URL or localStorage
  const getCompanyId = () => {
    const p = new URLSearchParams(window.location.search).get("company_id");
    if (p && /^\d+$/.test(p)) return p;
    const ls = localStorage.getItem("company_id");
    if (ls && /^\d+$/.test(ls)) return ls;
    return null;
  };

  // ===== Card Counters =====
  function updateActiveOffersCount(n) {
    const el = $("#activeOffersCount");
    if (el) el.textContent = Number(n) || 0;
  }
  function recalcActiveOffersCount() {
    const cont = $(".offer-cards");
    const n = cont ? cont.querySelectorAll(".offer-card").length : 0;
    updateActiveOffersCount(n);
  }
  async function fetchAndRenderNewApplicants() {
    const companyId = getCompanyId();
    if (!companyId) return;
    const el = $("#newApplicantsCount");
    try {
      const r = await fetch(
        `${API_BASE}/api/companies/${companyId}/new-applicants`,
        { credentials: "include" }
      );
      if (!r.ok) throw new Error("fetch error");
      const { total } = await r.json();
      if (el) el.textContent = Number(total) || 0;
    } catch (e) {
      console.error("[dashboard] new applicants error:", e);
      if (el) el.textContent = 0;
    }
  }

  // ===== Logout Function =====
  window.logout = function () {
    try {
      localStorage.removeItem("company_id");
    } catch {}
    window.location.href = "./loginCompany.html";
  };

  // ===== Basic Modal Functions =====
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

  // ===== State =====
  let offersState = [];
  window.offersIndex = new Map();

  // ===== Helpers =====
  // Format salary range text
  const salaryText = (min, max) => {
    const hasMin = min !== null && min !== undefined && String(min) !== "";
    const hasMax = max !== null && max !== undefined && String(max) !== "";
    if (!hasMin && !hasMax) return "Negotiable";
    const a = hasMin ? Number(min) : "";
    const b = hasMax ? Number(max) : "";
    return `${a}${hasMin && hasMax ? " - " : ""}${b}`;
  };

  // ===== Render Offers =====
  function renderOffers(offers, cont) {
    cont.innerHTML = "";
    if (!Array.isArray(offers) || offers.length === 0) {
      cont.innerHTML = `<div class="no-offers"><p>You have no published offers yet.</p></div>`;
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
    updateActiveOffersCount(offers.length);
  }

  // Load active offers from backend and render them
  async function loadActiveOffers() {
    const cont = $(".offer-cards");
    if (!cont) return;
    const companyId = getCompanyId();
    if (!companyId) {
      cont.innerHTML =
        '<div class="warn-msg">No company_id detected. Please log in.</div>';
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
      cont.innerHTML = '<div class="error-msg">Could not load offers.</div>';
      updateActiveOffersCount(0);
    }
  }

  // ===== Mappers/Parsers =====
  // Map modality and level values to display text
  const mapModality = (v) =>
    ({
      remote: "Remote",
      hybrid: "Hybrid",
      "on-site": "On-site",
      onsite: "On-site",
    }[String(v || "").toLowerCase()] || null);
  const mapLevel = (v) =>
    ({ junior: "Junior", "mid-level": "Mid-level", senior: "Senior" }[
      String(v || "").toLowerCase()
    ] || null);
  // Parse salary range string to min/max numbers
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

  // ===== CREATE OFFER =====
  // Initialize modal for creating a new offer
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
      $$(sel, createModal || document).forEach((btn) =>
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          closeModal(createModal);
        })
      );
    });

    // Handle offer creation form submission
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const companyId = getCompanyId();
      const title = createForm.newJobTitle?.value?.trim() || "";
      const location = createForm.newJobLocation?.value.trim() || "";
      const salaryRaw = createForm.newJobSalary?.value?.trim() || "";
      const modalityRaw = createForm.newJobMode?.value || "";
      const levelRaw = createForm.newJobLevel?.value || "";
      const description = createForm.newJobDescription?.value?.trim() || "";

      if (
        !companyId ||
        !title ||
        !location ||
        !modalityRaw ||
        !levelRaw ||
        !description
      ) {
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
            title: "Invalid values",
            text: "Check modality/level.",
          })) ||
          alert("Invalid values");
        return;
      }

      const { min: salary_min, max: salary_max } = parseSalaryRange(salaryRaw);
      const payload = {
        company_id: Number(companyId),
        title,
        description,
        location: location || "To be defined",
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
          const msg = data?.error || "Could not create offer.";
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
            title: "Network error",
            text: "Please try again.",
          })) ||
          alert("Network error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = prevTxt;
        }
      }
    });
  }

  // ===== EDIT OFFER =====
  // Initialize modal for editing an existing offer
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
      $$(sel, editModal || document).forEach((btn) =>
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          closeModal(editModal);
        })
      );
    });

    const container = $(".offer-cards") || document;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-edit-offer");
      if (!btn) return;

      const card = btn.closest(".offer-card");
      const id = Number(card?.dataset?.id);
      if (!Number.isFinite(id)) return;

      editForm.dataset.offerId = String(id);

      const offer = (window.offersIndex && window.offersIndex.get(id)) || {};
      $("#jobTitle").value = String(offer.title || "");
      $("#jobLocation").value = String(offer.location || "");
      $("#jobSalary").value = (() => {
        const { salary_min: min, salary_max: max } = offer;
        if (min == null && max == null) return "";
        if (min != null && max == null) return `${min}`;
        if (min == null && max != null) return `0 - ${max}`;
        return `${min} - ${max}`;
      })();
      $("#jobMode").value = String(offer.modality || "on-site")
        .toLowerCase()
        .includes("remote")
        ? "remote"
        : String(offer.modality || "")
            .toLowerCase()
            .includes("hybrid")
        ? "hybrid"
        : "on-site";
      $("#jobLevel").value = String(offer.level || "junior")
        .toLowerCase()
        .includes("mid")
        ? "mid-level"
        : String(offer.level || "")
            .toLowerCase()
            .includes("senior")
        ? "senior"
        : "junior";
      $("#jobDescription").value = String(offer.description || "");

      openModal(editModal);
    });

    // Handle offer edit form submission
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
            title: "Incomplete fields",
            text: "Please complete all required fields.",
          })) ||
          alert("Complete all fields");
        return;
      }

      const modality = mapModality(modalityRaw);
      const level = mapLevel(levelRaw);
      const { min: salary_min, max: salary_max } = parseSalaryRange(salaryRaw);
      const payload = {
        title,
        description,
        location: location || "To be defined",
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
          const msg = data?.error || "Could not update offer.";
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
            title: "Network error",
            text: "Please try again.",
          })) ||
          alert("Network error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = prevTxt;
        }
      }
    });
  }

  // ===== DELETE OFFER =====
  // Initialize delete offer action
  function initDeleteOffer() {
    const container = $(".offer-cards") || document;

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
          const msg = data?.error || "Could not delete offer.";
          (window.Swal &&
            Swal.fire({ icon: "error", title: "Error", text: msg })) ||
            alert(msg);
          delBtn.disabled = false;
          return;
        }

        card.remove();
        if (window.offersIndex instanceof Map) window.offersIndex.delete(id);

        recalcActiveOffersCount();
        await fetchAndRenderNewApplicants();
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
            text: "Please try again.",
          })) ||
          alert("Network error");
      } finally {
        delBtn.disabled = false;
      }
    });
  }

  // ===== VIEW APPLICANTS (MODAL, with button to schedule interview) =====
  // Render applicants rows in the modal table
  function renderApplicantsRows(list) {
    const tbody = $("#viewApplicantsTbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; opacity:.7;">No applicants yet</td></tr>`;
      return;
    }

    const frag = document.createDocumentFragment();
    list.forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.name ? a.name : "-"}</td>
        <td><a href="mailto:${a.email}">${a.email}</a></td>
        <td class="cell-interviews" data-application-id="${a.application_id}">${
        a.interviews_count ?? 0
      }</td>
        <td>
          <button class="btn btn-sm btn-primary btn-schedule" data-application-id="${
            a.application_id
          }">
            Schedule interview
          </button>
        </td>
      `;
      frag.appendChild(tr);
    });
    tbody.appendChild(frag);
  }

  // Open applicants modal and load applicants for an offer
  async function openViewApplicantsModal(offerId) {
    const modal = $("#viewApplicantsModal");
    const tbody = $("#viewApplicantsTbody");
    if (!modal || !tbody) return;

    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; opacity:.7;">Loading...</td></tr>`;
    try {
      const r = await fetch(
        `${API_BASE}/api/offers/${encodeURIComponent(offerId)}/applicants`,
        { credentials: "include" }
      );
      const data = await r.json().catch(() => []);
      if (!r.ok) throw new Error(data?.error || "Error loading applicants");
      renderApplicantsRows(data);
    } catch (e) {
      console.error("[ViewApplicants] error:", e);
      renderApplicantsRows([]);
    }

    openModal(modal);
  }

  // Initialize applicants modal actions
  function initViewApplicantsModal() {
    const modal = $("#viewApplicantsModal");
    if (!modal) return;

    const closeEls = [
      $("#closeViewApplicants"),
      $("#closeViewApplicantsFooter"),
    ].filter(Boolean);
    closeEls.forEach((btn) =>
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        closeModal(modal);
      })
    );

    // Delegation: Schedule interview (changes to "Scheduled" and disables button)
    modal.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-schedule");
      if (!btn) return;

      const applicationId = Number(btn.getAttribute("data-application-id"));
      if (!Number.isFinite(applicationId) || applicationId <= 0) return;

      let confirmed = true;
      if (window.Swal) {
        const r = await Swal.fire({
          icon: "question",
          title: "Schedule interview",
          text: "Do you want to schedule the interview for this applicant?",
          showCancelButton: true,
          confirmButtonText: "Yes, schedule",
          cancelButtonText: "Cancel",
        });
        confirmed = r.isConfirmed;
      } else {
        confirmed = window.confirm("Schedule interview?");
      }
      if (!confirmed) return;

      btn.disabled = true;

      try {
        const r = await fetch(`${API_BASE}/api/interviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ application_id: applicationId }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error || "Could not schedule");

        // Update only that cell with the returned total
        const cell = $(
          `.cell-interviews[data-application-id="${applicationId}"]`
        );
        if (cell && typeof data.interviews_total === "number") {
          cell.textContent = data.interviews_total;
        } else if (cell) {
          const prev = Number(cell.textContent) || 0;
          cell.textContent = prev + 1;
        }

        // Change button state
        btn.textContent = "Scheduled";
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-success");
        btn.disabled = true;

        window.Swal &&
          Swal.fire({
            icon: "success",
            title: "Interview scheduled",
            timer: 1000,
            showConfirmButton: false,
          });
      } catch (err) {
        console.error("[ScheduleInterview] error:", err);
        (window.Swal &&
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message || "Could not schedule",
          })) ||
          alert("Could not schedule");
        btn.disabled = false; // re-enable in case of error
      }
    });
  }

  // Initialize action to open applicants modal from offer card
  function initViewApplicantsAction() {
    const container = $(".offer-cards") || document;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-view-applicants");
      if (!btn) return;
      const card = btn.closest(".offer-card");
      const id = Number(card?.dataset?.id);
      if (!Number.isFinite(id)) return;
      openViewApplicantsModal(id);
    });
  }

  // ===== INIT =====
  document.addEventListener("DOMContentLoaded", () => {
    loadActiveOffers();
    initCreateOfferModal();
    initEditOfferModal();
    initDeleteOffer();

    fetchAndRenderNewApplicants(); // total applications (dashboard card)
    initViewApplicantsModal();
    initViewApplicantsAction();
  });
})();
