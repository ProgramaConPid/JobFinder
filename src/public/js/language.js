/*Change Language*/
const translations = {
  en: {
    "header.title": "Welcome to JobFinder",
    "header.subtitle": "We connect talent with opportunities. Choose your profile to get started.",
    "applicant.title": "I am an Applicant",
    "applicant.description": "I’m looking for job opportunities and want to connect with companies",
    "applicant.button": "Continue as Applicant",
    "company.title": "I am a Company",
    "company.description": "I post job offers and look for the best talent",
    "company.button": "Continue as Company",
    "contact.title": "JobFinder Tools",
    "contact.searchJobs": "Search Jobs",
    "contact.searchJobsDesc": "Find openings that match your profile",
    "contact.aboutUs": "About Us",
    "contact.aboutUsDesc": "This project is your all-in-one launchpad to job opportunities, recruiter connections, and skill-building — giving every job seeker the tools to rise, thrive, and lead their future.",
    "contact.chatRecruiters": "Chat with Recruiters",
    "contact.chatRecruitersDesc": "Start conversations with potential employers",
    "contact.findCenters": "Find Job Centers",
    "contact.findCentersDesc": "Locate offices near you",
    "contact.learnSkills": "Learn New Skills",
    "contact.learnSkillsDesc": "Improve your resume with online courses",
    "footer.copyright": "© 2025 JobFinder. All rights reserved — We don't just help you find work, we help you find purpose."
  },
  es: {
    "header.title": "Bienvenido a JobFinder",
    "header.subtitle": "Conectamos talento con oportunidades. Elige tu perfil para comenzar.",
    "applicant.title": "Soy Candidato",
    "applicant.description": "Busco oportunidades laborales y quiero conectar con empresas",
    "applicant.button": "Continuar como Candidato",
    "company.title": "Soy Empresa",
    "company.description": "Publico ofertas de empleo y busco el mejor talento",
    "company.button": "Continuar como Empresa",
    "contact.title": "Herramientas JobFinder",
    "contact.searchJobs": "Buscar Empleos",
    "contact.searchJobsDesc": "Encuentra vacantes que coincidan con tu perfil",
    "contact.aboutUs": "Sobre Nosotros",
    "contact.aboutUsDesc": "Este proyecto es tu plataforma integral hacia oportunidades laborales, conexiones con reclutadores y desarrollo de habilidades — dándole a cada buscador de empleo las herramientas para crecer, destacar y liderar su futuro.",
    "contact.chatRecruiters": "Chatea con Reclutadores",
    "contact.chatRecruitersDesc": "Inicia conversaciones con posibles empleadores",
    "contact.findCenters": "Encuentra Centros de Empleo",
    "contact.findCentersDesc": "Ubica oficinas cercanas a ti",
    "contact.learnSkills": "Aprende Nuevas Habilidades",
    "contact.learnSkillsDesc": "Mejora tu currículum con cursos en línea",
    "footer.copyright": "© 2025 JobFinder. Todos los derechos reservados — No solo te ayudamos a encontrar trabajo, te ayudamos a encontrar propósito."
  }
};

// Estado inicial
let currentLang = "en";

function translatePage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Botón de cambio de idioma
const toggleBtn = document.getElementById("toggle-language");
const flagSpan = document.getElementById("language-flag");

toggleBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  translatePage(currentLang);

  // Cambiar bandera con emoji
  flagSpan.textContent = currentLang === "en" ? "🇨🇴" : "🇺🇸";
});

// Cargar idioma inicial
document.addEventListener("DOMContentLoaded", () => {
  translatePage(currentLang);
});


