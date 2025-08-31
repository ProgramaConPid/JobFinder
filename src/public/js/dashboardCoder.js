// src/public/js/dashboardCoder.js
const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_BASE = isLocalhost
  ? "http://localhost:5173" // Local Backend Host
  : "https://jobfinder-jdp5.onrender.com"; // Backend on production (Render)

// --------------------------
// Helpers y estado
// --------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const getApplicantId = () => {
  // 1) query param ?applicant_id=, 2) localStorage "applicant_id"
  const p = new URLSearchParams(window.location.search).get("applicant_id");
  if (p && /^\d+$/.test(p)) return Number(p);
  const ls = localStorage.getItem("applicant_id");
  if (ls && /^\d+$/.test(ls)) return Number(ls);
  return null;
};

let offersIndex = new Map();       // id -> offer
let appliedJobIds = new Set();     // job_ids ya aplicados del usuario

function isApplied(jobId) { return appliedJobIds.has(Number(jobId)); }

function salaryText(min, max) {
  const hasMin = min !== null && min !== undefined && String(min) !== "";
  const hasMax = max !== null && max !== undefined && String(max) !== "";
  if (!hasMin && !hasMax) return "A convenir";
  const a = hasMin ? Number(min) : "";
  const b = hasMax ? Number(max) : "";
  return `${a}${hasMin && hasMax ? " - " : ""}${b}`;
}

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
// Carga de usuario (placeholder)
// --------------------------
function loadUserData() {
  // Si ya tienes datos reales, reemplaza esto
  const name = "John Smith";
  const ui = $(".user-info");
  if (ui) ui.textContent = `Hello, ${name}`;
}

// --------------------------
// Render de Ofertas
// --------------------------
function renderOffers(list, cont) {
  cont.innerHTML = "";
  if (!Array.isArray(list) || list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "no-offers";
    empty.textContent = "No hay ofertas disponibles por ahora.";
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
        <div class="job-detail">
          <span class="detail-icon">📍</span>
          <span class="job-location">${o.location}</span>
        </div>
        <div class="job-detail">
          <span class="detail-icon">💰</span>
          <span class="job-salary">${minMaxText}</span>
        </div>
        <div class="job-detail">
          <span class="detail-icon">🕒</span>
          <span class="job-posted">${posted}</span>
        </div>
      </div>

      <div class="job-description">
        <p>${o.description}</p>
      </div>

      <div class="job-tags">
        <span class="job-tag">${o.modality}</span>
        <span class="job-tag">${o.level}</span>
      </div>

      <div class="job-actions">
        <button class="btn-apply" data-i18n="dashboardCoder.applyNow">Apply Now</button>
        <button class="btn-view" data-i18n="dashboardCoder.viewDetails">View Details</button>
      </div>
    `;
    // Estado inicial del botón Apply si ya aplicó
    const btn = card.querySelector(".btn-apply");
    if (btn && isApplied(o.id)) {
      btn.textContent = "Already applied";
      btn.disabled = true;
      btn.style.background = "#27ae60";
    }
    cont.appendChild(card);
  });

  // Actualiza contador Available Offers (total ofertas)
  const span = $("#availableOffersCount");
  if (span) span.textContent = String(list.length);
}

// --------------------------
// Render de Postulaciones
// --------------------------
function applicationCardTemplate(app) {
  // app puede traer job_title/company_name; si no, buscamos en offersIndex
  const job = offersIndex.get(Number(app.job_id)) || {};
  const title = app.job_title || job.title || "Job";
  const company = app.company_name || job.company_name || "Company";
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
  if (!Array.isArray(apps) || apps.length === 0) {
    // puedes dejar vacío o colocar un mensaje
    return;
  }
  apps.forEach((a) => {
    cont.appendChild(applicationCardTemplate(a));
  });

  // Actualiza contador Applications Sent
  const span = $("#applicationsSentCount");
  if (span) span.textContent = String(apps.length);
}

// --------------------------
// Cargas desde el backend
// --------------------------
async function loadJobOffers() {
  const container = $(".job-cards");
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/offers`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const offers = await res.json();

    offersIndex = new Map((offers || []).map((o) => [Number(o.id), o]));
    renderOffers(offers, container);
  } catch (err) {
    console.error("[DashboardCoder] loadJobOffers error:", err);
  }
}

async function loadUserApplications() {
  const container = $(".application-cards");
  if (!container) return;

  const applicantId = getApplicantId();
  if (!applicantId) {
    // Si no hay applicant_id aún, deja contador en 0
    const span = $("#applicationsSentCount");
    if (span) span.textContent = "0";
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/applications?applicant_id=${encodeURIComponent(applicantId)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    // llena el set para deshabilitar botones "Apply Now"
    appliedJobIds = new Set((Array.isArray(apps) ? apps : []).map(a => Number(a.job_id)));

    renderApplications(apps, container);

    // también repintamos las ofertas si ya se cargaron, para reflejar “Already applied”
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
// Aplicar a una oferta
// --------------------------
async function applyJob(jobId) {
  const applicantId = getApplicantId();
  if (!applicantId) {
    Swal.fire({
      icon: "warning",
      title: "No estás registrado",
      text: "Inicia sesión o regístrate para postularte.",
      confirmButtonColor: "#6A0DAD",
      background: "#f5f0fa",
      color: "#2c2c2c",
    });
    return;
  }
  if (isApplied(jobId)) return; // ya aplicado

  // deshabilita botón de la card si existe
  const card = $(`.job-card[data-id="${jobId}"]`);
  const btnCard = card?.querySelector(".btn-apply");
  const prevTxt = btnCard?.textContent;
  if (btnCard) {
    btnCard.disabled = true;
    btnCard.textContent = "Applying...";
  }
  // deshabilita botón del modal si abierto
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
      // 409 si ya existía; otros códigos muestran error
      if (res.status === 409) {
        Swal.fire({
          icon: "info",
          title: "Ya aplicaste",
          text: "Esta oferta ya está en tus aplicaciones.",
          confirmButtonColor: "#6A0DAD",
          background: "#f5f0fa",
          color: "#2c2c2c",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Network error",
          text: "Inténtalo nuevamente.",
          confirmButtonColor: "#6A0DAD",
          background: "#f5f0fa",
          color: "#2c2c2c",
        });
      }
      return;
    }

    // éxito
    appliedJobIds.add(Number(jobId));

    // Marca botones como "Already applied"
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

    // Agrega la aplicación a la columna derecha
    const appList = $(".application-cards");
    if (appList) {
      const nowIso = new Date().toISOString();
      const app = {
        job_id: Number(jobId),
        status: "Under Review",
        applied_at: nowIso,
        job_title: offersIndex.get(Number(jobId))?.title || "Job",
        company_name: offersIndex.get(Number(jobId))?.company_name || "Company",
      };
      appList.prepend(applicationCardTemplate(app));
    }

    // Incrementa contador "Applications Sent"
    const cnt = $("#applicationsSentCount");
    if (cnt) {
      const n = Number(cnt.textContent || "0");
      cnt.textContent = String(n + 1);
    }

    Swal.fire({
      icon: "success",
      title: "Application Sent!",
      text: "Tu postulación fue enviada con éxito.",
      confirmButtonColor: "#6A0DAD",
      background: "#f5f0fa",
      color: "#2c2c2c",
    });

    // Si estabas en el modal, puedes cerrarlo si quieres:
    // closeModal();

  } catch (err) {
    console.error("[applyJob] error:", err);
    Swal.fire({
      icon: "error",
      title: "Network error",
      text: "Inténtalo nuevamente.",
      confirmButtonColor: "#6A0DAD",
      background: "#f5f0fa",
      color: "#2c2c2c",
    });
    // Rehabilita botón de la card si falló
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
// Eventos y wiring
// --------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Datos usuario
  loadUserData();

  // Primero carga aplicaciones (para saber qué jobs deshabilitar)
  loadUserApplications().then(() => {
    // Luego carga ofertas (para pintar botones en estado correcto)
    loadJobOffers();
  });

  // Delegación: clicks en cards de ofertas
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
        // Llenar modal
        $("#modalJobTitle").textContent = card.querySelector(".job-title")?.innerText || o.title || "Job";
        $("#modalCompanyName").textContent = card.querySelector(".company-name")?.innerText || o.company_name || "Company";
        $("#modalLocation").textContent = card.querySelector(".job-location")?.innerText || o.location || "";
        $("#modalSalary").textContent = card.querySelector(".job-salary")?.innerText || salaryText(o.salary_min, o.salary_max);
        $("#modalPosted").textContent = card.querySelector(".job-posted")?.innerText || (o.created_at ? new Date(o.created_at).toLocaleDateString() : "Recently");
        $("#modalDescription").textContent = card.querySelector(".job-description p")?.innerText || o.description || "";
        // Clonar tags
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
        // Guardar jobId en el modal y setear estado del botón
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

  // Botón Apply del modal
  if (modalApplyBtn) {
    modalApplyBtn.addEventListener("click", () => {
      const id = Number(jobModal?.dataset?.jobId);
      if (Number.isFinite(id)) applyJob(id);
    });
  }

  // Cerrar modal
  if (closeJobModal) closeJobModal.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === jobModal) closeModal();
  });
});

// --------------------------
// Logout (mantiene tu diseño)
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

// Atajos de teclado (sin cambios)
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
