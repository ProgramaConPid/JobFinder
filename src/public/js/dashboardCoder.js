// src/public/js/dashboardCoder.js

// Detect if running on localhost or production
const isLocalhost = ["localhost", "127.0.0.1"].includes(
  window.location.hostname
);

const API_BASE = isLocalhost
  ? "http://localhost:5173" // Local Backend Host
  : "https://jobfinder-jdp5.onrender.com"; // Production Backend

// --------------------------
// Helpers and state
// --------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Get applicant_id from query param or localStorage
const getApplicantId = () => {
  const p = new URLSearchParams(window.location.search).get("applicant_id");
  if (p && /^\d+$/.test(p)) {
    try {
      localStorage.setItem("applicant_id", String(p));
    } catch {}
    return Number(p);
  }
  const ls = localStorage.getItem("applicant_id");
  if (ls && /^\d+$/.test(ls)) return Number(ls);
  return null;
};

let offersIndex = new Map(); // id -> offer
let appliedJobIds = new Set(); // job_ids already applied by user
let lastApplications = []; // Anti-ghost: store last raw applications list

function isApplied(jobId) {
  return appliedJobIds.has(Number(jobId));
}

// Format salary range text
function salaryText(min, max) {
  const hasMin = min !== null && min !== undefined && String(min) !== "";
  const hasMax = max !== null && max !== undefined && String(max) !== "";
  if (!hasMin && !hasMax) return "Negotiable";
  const a = hasMin ? Number(min) : "";
  const b = hasMax ? Number(max) : "";
  return `${a}${hasMin && hasMax ? " - " : ""}${b}`;
}

// --------------------------
// NEW: Scheduled interviews counter (per coder)
// --------------------------
async function fetchAndRenderInterviewsCount() {
  const applicantId = getApplicantId();
  const el = $("#scheduledInterviewsCount");
  if (!el) {
    console.warn("[CoderDashboard] Missing #scheduledInterviewsCount in DOM.");
    return;
  }
  if (!applicantId) {
    el.textContent = "0";
    console.warn(
      "[CoderDashboard] applicant_id not available (query or localStorage)."
    );
    return;
  }
  try {
    const r = await fetch(
      `${API_BASE}/api/applicants/${applicantId}/interviews/count`,
      {
        credentials: "include",
      }
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const { total } = await r.json();
    el.textContent = Number(total) || 0;
  } catch (err) {
    console.error("[CoderDashboard] Error getting interviews:", err);
    el.textContent = "0";
  }
}

// Expose a public refresh function
window.CoderDashboard = Object.assign(window.CoderDashboard || {}, {
  refreshInterviewsCount: fetchAndRenderInterviewsCount,
});

// --------------------------
// Modal "View Details"
// --------------------------
const jobModal = $("#jobModal");
const closeJobModal = $("#closeJobModal");
const modalApplyBtn = jobModal ? jobModal.querySelector(".btn-apply") : null;

function openModal() {
  if (!jobModal) return;
  jobModal.classList.add("active");
}
function closeModal() {
  if (!jobModal) return;
  jobModal.classList.add("closing");
  setTimeout(() => {
    jobModal.classList.remove("active", "closing");
  }, 200);
}

// --------------------------
// Load user data (placeholder)
// --------------------------
function loadUserData() {
  // Replace with real user data if available
  const name = "John Smith";
  const ui = $(".user-info");
  if (ui) ui.textContent = `Hello, ${name}`;
}

// --------------------------
// Render job offers
// --------------------------
function renderOffers(list, cont) {
  cont.innerHTML = "";

  // Always update the offers counter
  const span = $("#availableOffersCount");
  if (span) span.textContent = String(Array.isArray(list) ? list.length : 0);

  if (!Array.isArray(list) || list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "no-offers card-empty";
    empty.innerHTML = `
      <div class="empty-icon">🔎</div>
      <div class="empty-text">
        <h4>No offers available at the moment</h4>
        <p>Check back later or adjust your filters.</p>
      </div>
    `;
    cont.appendChild(empty);
    return;
  }

  list.forEach((o) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.dataset.id = o.id;

    const minMaxText = salaryText(o.salary_min, o.salary_max);
    const posted = o.created_at
      ? new Date(o.created_at).toLocaleDateString()
      : "Recently";

    card.innerHTML = `
      <div class="job-header">
        <h3 class="job-title">${o.title}</h3>
        <span class="company-name">${o.company_name ?? ""}</span>
      </div>

      <div class="job-details">
        <div class="job-detail"><span class="detail-icon">📍</span><span class="job-location">${
          o.location
        }</span></div>
        <div class="job-detail"><span class="detail-icon">💰</span><span class="job-salary">${minMaxText}</span></div>
        <div class="job-detail"><span class="detail-icon">🕒</span><span class="job-posted">${posted}</span></div>
      </div>

      <div class="job-description"><p>${o.description}</p></div>

      <div class="job-tags">
        <span class="job-tag">${o.modality}</span>
        <span class="job-tag">${o.level}</span>
      </div>

      <div class="job-actions">
        <button class="btn-apply" data-i18n="dashboardCoder.applyNow">Apply Now</button>
        <button class="btn-view" data-i18n="dashboardCoder.viewDetails">View Details</button>
      </div>
    `;

    const btn = card.querySelector(".btn-apply");
    if (btn && isApplied(o.id)) {
      btn.textContent = "Already applied";
      btn.disabled = true;
      btn.style.background = "#27ae60";
    }
    cont.appendChild(card);
  });
}

// --------------------------
// Anti-ghost helpers
// --------------------------
function filterValidApplications(apps) {
  // Valid if backend already brought title or if job exists in offersIndex
  return (apps || []).filter((a) => {
    const hasTitle = Boolean(a?.job_title && String(a.job_title).trim());
    const inIndex = offersIndex.has(Number(a?.job_id));
    return hasTitle || inIndex;
  });
}

function getTitleAndCompany(app) {
  // Prefer backend data; fallback to offersIndex
  const job = offersIndex.get(Number(app.job_id)) || {};
  return {
    title: app.job_title || job.title,
    company: app.company_name || job.company_name,
  };
}

// --------------------------
// Render applications
// --------------------------
function applicationCardTemplate(app) {
  const { title, company } = getTitleAndCompany(app);
  const appliedDate = app.applied_at
    ? new Date(app.applied_at).toLocaleDateString()
    : "Recently";
  const statusText = app.status || "Under Review";

  const wrap = document.createElement("div");
  wrap.className = "application-card";
  wrap.dataset.jobId = app.job_id;
  wrap.innerHTML = `
    <div class="app-job-info">
      <h4>${title}</h4>
      <span class="company-name">${company}</span>
    </div>
    <div class="app-status">
      <span class="status-badge status-pending"> ${statusText} </span>
    </div>
    <div class="app-date">
      <span>Applied: ${appliedDate}</span>
    </div>
  `;
  return wrap;
}

function renderApplications(apps, cont) {
  cont.innerHTML = "";

  // Anti-ghost: only valid applications
  const sane = filterValidApplications(apps);

  if (sane.length === 0) {
    // You can leave empty or show a message if you want
    const span = $("#applicationsSentCount");
    if (span) span.textContent = "0";
    return;
  }

  sane.forEach((a) => cont.appendChild(applicationCardTemplate(a)));

  // Update Applications Sent counter with valid applications
  const span = $("#applicationsSentCount");
  if (span) span.textContent = String(sane.length);
}

// --------------------------
// Load from backend
// --------------------------
async function loadJobOffers() {
  const container = $(".job-cards");
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/offers`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const payload = await res.json();

    // Normalize: direct array or inside .data / .offers / .results / .rows
    let offers =
      (Array.isArray(payload) && payload) ||
      payload?.offers ||
      payload?.data ||
      payload?.results ||
      payload?.rows ||
      [];

    // If comes as object-index (id => offer)
    if (!Array.isArray(offers) && typeof offers === "object") {
      offers = Object.values(offers);
    }

    // Ensure each item has a numeric id
    offers = (offers || []).map((o) => ({
      ...o,
      id: Number(o.id ?? o.job_id ?? o.offer_id),
    }));

    offersIndex = new Map((offers || []).map((o) => [Number(o.id), o]));
    renderOffers(offers, container);

    // Anti-ghost: when offersIndex is ready, re-render applications
    const appsCont = $(".application-cards");
    if (appsCont && lastApplications.length) {
      renderApplications(lastApplications, appsCont);
    }
  } catch (err) {
    console.error("[DashboardCoder] loadJobOffers error:", err);
    // Show empty card if failed
    renderOffers([], container);
  }
}

async function loadUserApplications() {
  const container = $(".application-cards");
  if (!container) return;

  const applicantId = getApplicantId();
  if (!applicantId) {
    // If no applicant_id, set counter to 0
    const span = $("#applicationsSentCount");
    if (span) span.textContent = "0";
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/applications?applicant_id=${encodeURIComponent(
        applicantId
      )}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    lastApplications = Array.isArray(apps) ? apps : [];

    // Fill set to disable "Apply Now" buttons
    appliedJobIds = new Set(lastApplications.map((a) => Number(a.job_id)));

    renderApplications(lastApplications, container);

    // Also repaint offers if already loaded, to reflect “Already applied”
    const cards = $$(".job-card");
    cards.forEach((card) => {
      const id = Number(card.dataset.id);
      const btn = card.querySelector(".btn-apply");
      if (btn && isApplied(id)) {
        btn.textContent = "Already applied";
        btn.disabled = true;
        btn.style.background = "#27ae60";
      }
    });
  } catch (err) {
    console.error("[DashboardCoder] loadUserApplications error:", err);
  }
}

// --------------------------
// Apply to a job offer
// --------------------------
async function applyJob(jobId) {
  const applicantId = getApplicantId();
  if (!applicantId) {
    Swal.fire({
      icon: "warning",
      title: "You are not registered",
      text: "Log in or register to apply.",
      confirmButtonColor: "#6A0DAD",
      background: "#f5f0fa",
      color: "#2c2c2c",
    });
    return;
  }
  if (isApplied(jobId)) return; // already applied

  // Disable button on the card if exists
  const card = $(`.job-card[data-id="${jobId}"]`);
  const btnCard = card?.querySelector(".btn-apply");
  const prevTxt = btnCard?.textContent;
  if (btnCard) {
    btnCard.disabled = true;
    btnCard.textContent = "Applying...";
  }
  // Disable button in modal if open
  if (modalApplyBtn && jobModal?.classList.contains("active")) {
    modalApplyBtn.disabled = true;
    modalApplyBtn.textContent = "Applying...";
  }

  try {
    const res = await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicant_id: Number(applicantId),
        job_id: Number(jobId),
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // 409 if already exists; other codes show error
      if (res.status === 409) {
        Swal.fire({
          icon: "info",
          title: "Already applied",
          text: "This offer is already in your applications.",
          confirmButtonColor: "#6A0DAD",
          background: "#f5f0fa",
          color: "#2c2c2c",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Network error",
          text: "Please try again.",
          confirmButtonColor: "#6A0DAD",
          background: "#f5f0fa",
          color: "#2c2c2c",
        });
      }
      return;
    }

    // Success
    appliedJobIds.add(Number(jobId));

    // Mark buttons as "Already applied"
    if (btnCard) {
      btnCard.textContent = "Already applied";
      btnCard.disabled = true;
      btnCard.style.background = "#27ae60";
    }
    if (modalApplyBtn) {
      modalApplyBtn.textContent = "Already applied";
      modalApplyBtn.disabled = true;
      modalApplyBtn.style.background = "#27ae60";
    }

    // Add application to right column (only if offer exists)
    const appList = $(".application-cards");
    const offer = offersIndex.get(Number(jobId));
    if (appList && offer) {
      const nowIso = new Date().toISOString();
      const app = {
        job_id: Number(jobId),
        status: "Under Review",
        applied_at: nowIso,
        job_title: offer.title,
        company_name: offer.company_name,
      };

      // Update raw state and re-render with filter
      lastApplications = [app, ...lastApplications];
      renderApplications(lastApplications, appList);
    } else {
      // If no offer in index, do not add "ghost" cards
      console.warn("[applyJob] Offer not in offersIndex: not adding card.");
    }

    Swal.fire({
      icon: "success",
      title: "Application Sent!",
      text: "Your application was sent successfully.",
      confirmButtonColor: "#6A0DAD",
      background: "#f5f0fa",
      color: "#2c2c2c",
    });
  } catch (err) {
    console.error("[applyJob] error:", err);
    Swal.fire({
      icon: "error",
      title: "Network error",
      text: "Please try again.",
      confirmButtonColor: "#6A0DAD",
      background: "#f5f0fa",
      color: "#2c2c2c",
    });
    // Re-enable button on card if failed
    if (btnCard) {
      btnCard.disabled = false;
      btnCard.textContent = prevTxt || "Apply Now";
    }
    if (modalApplyBtn) {
      modalApplyBtn.disabled = false;
      modalApplyBtn.textContent = "Apply Now";
      modalApplyBtn.style.background = "";
    }
  }
}

// --------------------------
// Events and wiring
// --------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Load user data
  loadUserData();

  // Scheduled interviews counter (new)
  fetchAndRenderInterviewsCount();

  // Update when returning to foreground (in case recruiter schedules an interview meanwhile)
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) fetchAndRenderInterviewsCount();
  });

  // First load applications (to know which jobs to disable)
  loadUserApplications().then(() => {
    // Then load offers (to paint buttons in correct state)
    loadJobOffers();
  });

  // Delegation: clicks on job cards
  const offersContainer = $(".job-cards");
  if (offersContainer) {
    offersContainer.addEventListener("click", (e) => {
      const btnView = e.target.closest(".btn-view");
      const btnApply = e.target.closest(".btn-apply");
      const card = e.target.closest(".job-card");
      if (!card) return;
      const jobId = Number(card.dataset.id);
      const o = offersIndex.get(jobId) || {};

      if (btnView) {
        // Fill modal
        $("#modalJobTitle").textContent =
          card.querySelector(".job-title")?.innerText || o.title || "Job";
        $("#modalCompanyName").textContent =
          card.querySelector(".company-name")?.innerText ||
          o.company_name ||
          "Company";
        $("#modalLocation").textContent =
          card.querySelector(".job-location")?.innerText || o.location || "";
        $("#modalSalary").textContent =
          card.querySelector(".job-salary")?.innerText ||
          salaryText(o.salary_min, o.salary_max);
        $("#modalPosted").textContent =
          card.querySelector(".job-posted")?.innerText ||
          (o.created_at
            ? new Date(o.created_at).toLocaleDateString()
            : "Recently");
        $("#modalDescription").textContent =
          card.querySelector(".job-description p")?.innerText ||
          o.description ||
          "";
        // Clone tags
        const tagsContainer = $("#modalTags");
        if (tagsContainer) {
          tagsContainer.innerHTML = "";
          card.querySelectorAll(".job-tag").forEach((t) => {
            const span = document.createElement("span");
            span.className = "job-tag";
            span.textContent = t.textContent;
            tagsContainer.appendChild(span);
          });
        }
        // Save jobId in modal and set button state
        jobModal.dataset.jobId = String(jobId);
        if (modalApplyBtn) {
          const already = isApplied(jobId);
          modalApplyBtn.textContent = already ? "Already applied" : "Apply Now";
          modalApplyBtn.disabled = already;
          modalApplyBtn.style.background = already ? "#27ae60" : "";
        }
        openModal();
      }

      if (btnApply) {
        applyJob(jobId);
      }
    });
  }

  // Apply button in modal
  if (modalApplyBtn) {
    modalApplyBtn.addEventListener("click", () => {
      const id = Number(jobModal?.dataset?.jobId);
      if (Number.isFinite(id)) applyJob(id);
    });
  }

  // Close modal
  if (closeJobModal) closeJobModal.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === jobModal) closeModal();
  });
});

// --------------------------
// Logout (keeps your design)
// --------------------------
function logout() {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out from your session.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6A0DAD",
    confirmButtonText: "Yes, log out",
    background: "#f5f0fa",
    color: "#2c2c2c",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been logged out successfully.",
        confirmButtonColor: "#6A0DAD",
        background: "#f5f0fa",
        color: "#2c2c2c",
      }).then(() => {
        window.location.href = "../index.html";
      });
    }
  });
}

// Keyboard shortcuts (unchanged)
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey) {
    switch (e.key) {
      case "1":
        window.scrollTo(0, 0);
        break;
      case "2":
        document.querySelector(".job-offers-section")?.scrollIntoView();
        break;
      case "3":
        document.querySelector(".applications-section")?.scrollIntoView();
        break;
    }
  }
});
