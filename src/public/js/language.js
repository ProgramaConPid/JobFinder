/* ./js/language.js - Versión mejorada y simplificada */
(function () {
  "use strict";

  // Traducciones completas (manteniendo tus keys)
  const translations = {
    "en": {
      "header.title": "Welcome to JobFinder",
      "header.subtitle": "We connect talent with opportunities. Choose your profile to get started.",
      "applicant.title": "I am an Applicant",
      "applicant.description": "I'm looking for job opportunities and want to connect with companies",
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
      "footer.copyright": "© 2025 JobFinder. All rights reserved — We don't just help you find work, we help you find purpose.",
      "login.title": "JobFinder - Applicant Login",
      "login.header": "Applicants",
      "login.subtitle": "Log in to access your account",
      "login.emailLabel": "Email Address",
      "login.emailPlaceholder": "your@email.com",
      "login.passwordLabel": "Password",
      "login.passwordPlaceholder": "Enter your password",
      "login.button": "Log In",
      "login.noAccount": "Don't have an account?",
      "login.signUp": "Sign Up",
      "login.back": "Back to Home",
      "register_title": "Applicant Registration",
      "register_subtitle": "Create your account to get started",
      "register_fullname": "Full Name",
      "register_email": "Email Address",
      "register_password": "Password",
      "register_confirm_password": "Confirm Password",
      "register_button": "Create Account",
      "register_have_account": "Already have an account?",
      "register_login_link": "Log in",
      "register_placeholder_fullname": "John Smith",
      "register_placeholder_email": "your@email.com",
      "register_placeholder_password": "Enter your password",
      "register_placeholder_confirm_password": "Confirm your password",
      "back_home": "Back to Home",
      // 
      "title": "JobFinder - Company Login",
      "companyTitle": "Companies",
      "loginSubtitle": "Log in to access your account",
      "emailLabel": "Email Address",
      "passwordLabel": "Password", 
      "loginButton": "Log In",
      "noAccount": "Don't have an account?",
      "signUp": "Sign Up",
      "backHome": "Back to Home",
      "emailPlaceholder": "your@email.com",
      "passwordPlaceholder": "••••••••••",
      // ... traducciones existentes ...
        "registerCompany.title": "JobFinder - Company Registration",
        "registerCompany.header": "Company Registration",
        "registerCompany.subtitle": "Create your account to get started",
        "registerCompany.companyName": "Company Name",
        "registerCompany.companyNamePlaceholder": "My Company Inc.",
        "registerCompany.email": "Email Address",
        "registerCompany.emailPlaceholder": "your@email.com",
        "registerCompany.password": "Password",
        "registerCompany.passwordPlaceholder": "••••••••••",
        "registerCompany.confirmPassword": "Confirm Password",
        "registerCompany.confirmPasswordPlaceholder": "••••••••••",
        "registerCompany.button": "Create Account",
        "registerCompany.haveAccount": "Already have an account?",
        "registerCompany.loginLink": "Log in",
        "registerCompany.backHome": "Back to Home",
         // ... traducciones existentes ...
        "dashboardCompany.title": "JobFinder - Company Dashboard",
        "dashboardCompany.header": "Company Dashboard",
        "dashboardCompany.subtitle": "Manage your job offers and review applicants",
        "dashboardCompany.userInfo": "Hello, TechCorp",
        "dashboardCompany.profile": "Profile",
        "dashboardCompany.logout": "Log Out",
        
        // Stats Cards
        "dashboardCompany.activeOffers": "Active Offers",
        "dashboardCompany.myOffers": "My Offers",
        "dashboardCompany.newApplications": "New Applications",
        "dashboardCompany.applicants": "Applicants",
        "dashboardCompany.companyProfile": "Company Profile",
        "dashboardCompany.completed": "Completed",
        
        // Sections
        "dashboardCompany.activeOffersSection": "Active Offers",
        "dashboardCompany.createOffer": "+ Create New Offer",
        "dashboardCompany.salary": "Salary:",
        "dashboardCompany.viewApplicants": "View Applicants",
        "dashboardCompany.edit": "Edit",
        
        // Sidebar
        "dashboardCompany.recommendations": "Recommendations",
        "dashboardCompany.completeProfileText": "Complete your company profile to increase visibility",
        "dashboardCompany.complete": "Complete",
        "dashboardCompany.reviewApplicationsText": "Review the 5 new pending applications",
        "dashboardCompany.review": "Review",
        "dashboardCompany.quickStats": "Quick Stats",
        "dashboardCompany.totalApplicants": "Total Applicants",
        "dashboardCompany.underReview": "Under Review",
        "dashboardCompany.active": "Active",
        
        // Modals
        "dashboardCompany.newOffer": "New Job Offer",
        "dashboardCompany.editOffer": "Edit Job Offer",
        "dashboardCompany.jobTitle": "Job Title",
        "dashboardCompany.jobTitlePlaceholder": "e.g. Backend Developer Node.js",
        "dashboardCompany.salaryRange": "Salary Range",
        "dashboardCompany.salaryPlaceholder": "e.g. $50,000 - $70,000",
        "dashboardCompany.workMode": "Work Mode",
        "dashboardCompany.seniorityLevel": "Seniority Level",
        "dashboardCompany.description": "Description",
        "dashboardCompany.descriptionPlaceholder": "Write a short description about the role, responsibilities and requirements",
        "dashboardCompany.createOfferBtn": "Create Offer",
        "dashboardCompany.saveChanges": "Save Changes",
        "dashboardCompany.cancel": "Cancel",
        // ... traducciones existentes ...
        "profileCompany.title": "Company Profile - JobFinder",
        "profileCompany.header": "Company Profile",
        "profileCompany.subtitle": "Manage your company information and job postings",
        "profileCompany.changeLogo": "Change logo",
        "profileCompany.activeJobs": "Active Jobs",
        "profileCompany.applications": "Applications",
        "profileCompany.interviews": "Interviews",
        
        // Company Information
        "profileCompany.companyInfo": "Company Information",
        "profileCompany.companyName": "Company Name *",
        "profileCompany.industry": "Industry *",
        "profileCompany.selectIndustry": "Select Industry",
        "profileCompany.technology": "Technology",
        "profileCompany.finance": "Finance",
        "profileCompany.healthcare": "Healthcare",
        "profileCompany.education": "Education",
        "profileCompany.manufacturing": "Manufacturing",
        "profileCompany.retail": "Retail",
        "profileCompany.other": "Other",
        "profileCompany.website": "Website",
        "profileCompany.companySize": "Company Size",
        "profileCompany.selectSize": "Select Size",
        "profileCompany.employees1": "1-10 employees",
        "profileCompany.employees2": "11-50 employees",
        "profileCompany.employees3": "51-200 employees",
        "profileCompany.employees4": "201-500 employees",
        "profileCompany.employees5": "501-1000 employees",
        "profileCompany.employees6": "1000+ employees",
        "profileCompany.companyDescription": "Company Description *",
        "profileCompany.descriptionPlaceholder": "Describe your company culture, mission, and values...",
        
        // Contact Information
        "profileCompany.contactInfo": "Contact Information",
        "profileCompany.contactPerson": "Contact Person *",
        "profileCompany.position": "Position *",
        "profileCompany.email": "Email *",
        "profileCompany.phone": "Phone",
        "profileCompany.companyAddress": "Company Address",
        
        // Social Media
        "profileCompany.socialMedia": "Social Media",
        "profileCompany.linkedin": "LinkedIn",
        "profileCompany.linkedinPlaceholder": "https://linkedin.com/company/",
        "profileCompany.twitter": "Twitter",
        "profileCompany.twitterPlaceholder": "https://twitter.com/",
        "profileCompany.facebook": "Facebook",
        "profileCompany.facebookPlaceholder": "https://facebook.com/",
        "profileCompany.instagram": "Instagram",
        "profileCompany.instagramPlaceholder": "https://instagram.com/",
        
        // Buttons
        "profileCompany.saveChanges": "Save Changes",
        "profileCompany.cancel": "Cancel",
        // ... traducciones existentes ...
        "dashboardCoder.title": "JobFinder - Applicant Dashboard",
        "dashboardCoder.header": "Applicant Dashboard",
        "dashboardCoder.subtitle": "Explore job offers and manage your applications",
        "dashboardCoder.userInfo": "Hello, John Smith",
        "dashboardCoder.myProfile": "My Profile",
        "dashboardCoder.logout": "Log Out",
        
        // Stats Cards
        "dashboardCoder.availableOffers": "Available Offers",
        "dashboardCoder.applicationsSent": "Applications Sent",
        "dashboardCoder.scheduledInterviews": "Scheduled Interviews",
        
        // Sections
        "dashboardCoder.availableOffersSection": "Available Offers",
        "dashboardCoder.myApplications": "My Applications",
        
        // Job Card
        "dashboardCoder.applyNow": "Apply Now",
        "dashboardCoder.viewDetails": "View Details",
        
        // Application Status
        "dashboardCoder.underReview": "Under Review",
        "dashboardCoder.interviewScheduled": "Interview Scheduled",
        "dashboardCoder.applied": "Applied",
        
        // Modal
        "dashboardCoder.location": "Location:",
        "dashboardCoder.salary": "Salary:",
        "dashboardCoder.posted": "Posted:",
        "profileCoder.title": "My Profile - JobFinder",
        "profileCoder.header": "My Profile",
        "profileCoder.subtitle": "Manage your personal and professional information",
        "profileCoder.changePhoto": "Change photo",
        
        // Statistics
        "profileCoder.statistics": "Statistics",
        "profileCoder.applications": "Applications",
        "profileCoder.interviews": "Interviews",
        "profileCoder.offers": "Offers",
        
        // Personal Information
        "profileCoder.personalInfo": "Personal Information",
        "profileCoder.firstName": "First Name",
        "profileCoder.lastName": "Last Name",
        "profileCoder.email": "Email",
        "profileCoder.phone": "Phone",
        "profileCoder.address": "Address",
        
        // Professional Information
        "profileCoder.professionalInfo": "Professional Information",
        "profileCoder.profession": "Profession",
        "profileCoder.yearsExperience": "Years of Experience",
        "profileCoder.educationLevel": "Education Level",
        "profileCoder.selectEducation": "Select",
        "profileCoder.highSchool": "High School",
        "profileCoder.technical": "Technical",
        "profileCoder.university": "University",
        "profileCoder.master": "Master's",
        "profileCoder.phd": "PhD",
        "profileCoder.skills": "Skills (separated by commas)",
        
        // Resume
        "profileCoder.resume": "Resume",
        "profileCoder.uploadResume": "Upload Resume (PDF)",
        "profileCoder.noResume": "No resume uploaded",
        
        // Buttons
        "profileCoder.saveChanges": "Save Changes",
        "profileCoder.cancel": "Cancel"
    },
    "es": {
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
      "footer.copyright": "© 2025 JobFinder. Todos los derechos reservados — No solo te ayudamos a encontrar trabajo, te ayudamos a encontrar propósito.",
      "login.title": "JobFinder - Inicio de sesión (Candidato)",
      "login.header": "Candidatos",
      "login.subtitle": "Inicia sesión para acceder a tu cuenta",
      "login.emailLabel": "Correo Electrónico",
      "login.emailPlaceholder": "tu@correo.com",
      "login.passwordLabel": "Contraseña",
      "login.passwordPlaceholder": "Ingresa tu contraseña",
      "login.button": "Iniciar Sesión",
      "login.noAccount": "¿No tienes una cuenta?",
      "login.signUp": "Regístrate",
      "login.back": "Volver al Inicio",
      "register_title": "Registro de Aspirantes",
      "register_subtitle": "Crea tu cuenta para comenzar",
      "register_fullname": "Nombre completo",
      "register_email": "Correo electrónico",
      "register_password": "Contraseña",
      "register_confirm_password": "Confirmar contraseña",
      "register_button": "Crear cuenta",
      "register_have_account": "¿Ya tienes una cuenta?",
      "register_login_link": "Inicia sesión",
      "register_placeholder_fullname": "Juan Pérez",
      "register_placeholder_email": "tu@correo.com",
      "register_placeholder_password": "Ingresa tu contraseña",
      "register_placeholder_confirm_password": "Confirma tu contraseña",
      "back_home": "Volver al inicio",
      // 
      "title": "JobFinder - Inicio de Sesión Empresa",
      "companyTitle": "Empresas",
      "loginSubtitle": "Inicia sesión para acceder a tu cuenta",
      "emailLabel": "Correo Electrónico",
      "passwordLabel": "Contraseña",
      "loginButton": "Iniciar Sesión",
      "noAccount": "¿No tienes una cuenta?",
      "signUp": "Regístrate",
      "backHome": "Volver al Inicio",
      "emailPlaceholder": "tu@correo.com",
      "passwordPlaceholder": "••••••••••",
      // ... traducciones existentes ...
        "registerCompany.title": "JobFinder - Registro de Empresa",
        "registerCompany.header": "Registro de Empresa",
        "registerCompany.subtitle": "Crea tu cuenta para comenzar",
        "registerCompany.companyName": "Nombre de la Empresa",
        "registerCompany.companyNamePlaceholder": "Mi Empresa S.A.",
        "registerCompany.email": "Correo Electrónico",
        "registerCompany.emailPlaceholder": "tu@correo.com",
        "registerCompany.password": "Contraseña",
        "registerCompany.passwordPlaceholder": "••••••••••",
        "registerCompany.confirmPassword": "Confirmar Contraseña",
        "registerCompany.confirmPasswordPlaceholder": "••••••••••",
        "registerCompany.button": "Crear Cuenta",
        "registerCompany.haveAccount": "¿Ya tienes una cuenta?",
        "registerCompany.loginLink": "Iniciar Sesión",
        "registerCompany.backHome": "Volver al Inicio",
        // ... traducciones existentes ...
        "dashboardCompany.title": "JobFinder - Panel de Empresa",
        "dashboardCompany.header": "Panel de Empresa",
        "dashboardCompany.subtitle": "Gestiona tus ofertas de trabajo y revisa solicitantes",
        "dashboardCompany.userInfo": "Hola, TechCorp",
        "dashboardCompany.profile": "Perfil",
        "dashboardCompany.logout": "Cerrar Sesión",
        
        // Stats Cards
        "dashboardCompany.activeOffers": "Ofertas Activas",
        "dashboardCompany.myOffers": "Mis Ofertas",
        "dashboardCompany.newApplications": "Nuevas Solicitudes",
        "dashboardCompany.applicants": "Solicitantes",
        "dashboardCompany.companyProfile": "Perfil de Empresa",
        "dashboardCompany.completed": "Completado",
        
        // Sections
        "dashboardCompany.activeOffersSection": "Ofertas Activas",
        "dashboardCompany.createOffer": "+ Crear Nueva Oferta",
        "dashboardCompany.salary": "Salario:",
        "dashboardCompany.viewApplicants": "Ver Solicitantes",
        "dashboardCompany.edit": "Editar",
        
        // Sidebar
        "dashboardCompany.recommendations": "Recomendaciones",
        "dashboardCompany.completeProfileText": "Completa tu perfil de empresa para aumentar la visibilidad",
        "dashboardCompany.complete": "Completar",
        "dashboardCompany.reviewApplicationsText": "Revisa las 5 nuevas solicitudes pendientes",
        "dashboardCompany.review": "Revisar",
        "dashboardCompany.quickStats": "Estadísticas Rápidas",
        "dashboardCompany.totalApplicants": "Total Solicitantes",
        "dashboardCompany.underReview": "En Revisión",
        "dashboardCompany.active": "Activos",
        
        // Modals
        "dashboardCompany.newOffer": "Nueva Oferta de Trabajo",
        "dashboardCompany.editOffer": "Editar Oferta de Trabajo",
        "dashboardCompany.jobTitle": "Título del Puesto",
        "dashboardCompany.jobTitlePlaceholder": "ej. Desarrollador Backend Node.js",
        "dashboardCompany.salaryRange": "Rango Salarial",
        "dashboardCompany.salaryPlaceholder": "ej. $50,000 - $70,000",
        "dashboardCompany.workMode": "Modalidad de Trabajo",
        "dashboardCompany.seniorityLevel": "Nivel de Seniority",
        "dashboardCompany.description": "Descripción",
        "dashboardCompany.descriptionPlaceholder": "Escribe una breve descripción sobre el rol, responsabilidades y requisitos",
        "dashboardCompany.createOfferBtn": "Crear Oferta",
        "dashboardCompany.saveChanges": "Guardar Cambios",
        "dashboardCompany.cancel": "Cancelar",
        // ... traducciones existentes ...
        "profileCompany.title": "Perfil de Empresa - JobFinder",
        "profileCompany.header": "Perfil de Empresa",
        "profileCompany.subtitle": "Gestiona la información de tu empresa y ofertas de trabajo",
        "profileCompany.changeLogo": "Cambiar logo",
        "profileCompany.activeJobs": "Trabajos Activos",
        "profileCompany.applications": "Solicitudes",
        "profileCompany.interviews": "Entrevistas",
        
        // Company Information
        "profileCompany.companyInfo": "Información de la Empresa",
        "profileCompany.companyName": "Nombre de la Empresa *",
        "profileCompany.industry": "Industria *",
        "profileCompany.selectIndustry": "Seleccionar Industria",
        "profileCompany.technology": "Tecnología",
        "profileCompany.finance": "Finanzas",
        "profileCompany.healthcare": "Salud",
        "profileCompany.education": "Educación",
        "profileCompany.manufacturing": "Manufactura",
        "profileCompany.retail": "Retail",
        "profileCompany.other": "Otra",
        "profileCompany.website": "Sitio Web",
        "profileCompany.companySize": "Tamaño de la Empresa",
        "profileCompany.selectSize": "Seleccionar Tamaño",
        "profileCompany.employees1": "1-10 empleados",
        "profileCompany.employees2": "11-50 empleados",
        "profileCompany.employees3": "51-200 empleados",
        "profileCompany.employees4": "201-500 empleados",
        "profileCompany.employees5": "501-1000 empleados",
        "profileCompany.employees6": "1000+ empleados",
        "profileCompany.companyDescription": "Descripción de la Empresa *",
        "profileCompany.descriptionPlaceholder": "Describe la cultura, misión y valores de tu empresa...",
        
        // Contact Information
        "profileCompany.contactInfo": "Información de Contacto",
        "profileCompany.contactPerson": "Persona de Contacto *",
        "profileCompany.position": "Cargo *",
        "profileCompany.email": "Correo Electrónico *",
        "profileCompany.phone": "Teléfono",
        "profileCompany.companyAddress": "Dirección de la Empresa",
        
        // Social Media
        "profileCompany.socialMedia": "Redes Sociales",
        "profileCompany.linkedin": "LinkedIn",
        "profileCompany.linkedinPlaceholder": "https://linkedin.com/company/",
        "profileCompany.twitter": "Twitter",
        "profileCompany.twitterPlaceholder": "https://twitter.com/",
        "profileCompany.facebook": "Facebook",
        "profileCompany.facebookPlaceholder": "https://facebook.com/",
        "profileCompany.instagram": "Instagram",
        "profileCompany.instagramPlaceholder": "https://instagram.com/",
        
        // Buttons
        "profileCompany.saveChanges": "Guardar Cambios",
        "profileCompany.cancel": "Cancelar",
        // .
        "dashboardCoder.title": "JobFinder - Panel del Candidato",
        "dashboardCoder.header": "Panel del Candidato",
        "dashboardCoder.subtitle": "Explora ofertas de trabajo y gestiona tus solicitudes",
        "dashboardCoder.userInfo": "Hola, John Smith",
        "dashboardCoder.myProfile": "Mi Perfil",
        "dashboardCoder.logout": "Cerrar Sesión",
        
        // Stats Cards
        "dashboardCoder.availableOffers": "Ofertas Disponibles",
        "dashboardCoder.applicationsSent": "Solicitudes Enviadas",
        "dashboardCoder.scheduledInterviews": "Entrevistas Programadas",
        
        // Sections
        "dashboardCoder.availableOffersSection": "Ofertas Disponibles",
        "dashboardCoder.myApplications": "Mis Solicitudes",
        
        // Job Card
        "dashboardCoder.applyNow": "Aplicar Ahora",
        "dashboardCoder.viewDetails": "Ver Detalles",
        
        // Application Status
        "dashboardCoder.underReview": "En Revisión",
        "dashboardCoder.interviewScheduled": "Entrevista Programada",
        "dashboardCoder.applied": "Aplicado",
        
        // Modal
        "dashboardCoder.location": "Ubicación:",
        "dashboardCoder.salary": "Salario:",
        "dashboardCoder.posted": "Publicado:",
        "profileCoder.title": "Mi Perfil - JobFinder",
        "profileCoder.header": "Mi Perfil",
        "profileCoder.subtitle": "Gestiona tu información personal y profesional",
        "profileCoder.changePhoto": "Cambiar foto",
        
        // Statistics
        "profileCoder.statistics": "Estadísticas",
        "profileCoder.applications": "Solicitudes",
        "profileCoder.interviews": "Entrevistas",
        "profileCoder.offers": "Ofertas",
        
        // Personal Information
        "profileCoder.personalInfo": "Información Personal",
        "profileCoder.firstName": "Nombre",
        "profileCoder.lastName": "Apellido",
        "profileCoder.email": "Correo Electrónico",
        "profileCoder.phone": "Teléfono",
        "profileCoder.address": "Dirección",
        
        // Professional Information
        "profileCoder.professionalInfo": "Información Profesional",
        "profileCoder.profession": "Profesión",
        "profileCoder.yearsExperience": "Años de Experiencia",
        "profileCoder.educationLevel": "Nivel de Educación",
        "profileCoder.selectEducation": "Seleccionar",
        "profileCoder.highSchool": "Bachillerato",
        "profileCoder.technical": "Técnico",
        "profileCoder.university": "Universitario",
        "profileCoder.master": "Maestría",
        "profileCoder.phd": "Doctorado",
        "profileCoder.skills": "Habilidades (separadas por comas)",
        
        // Resume
        "profileCoder.resume": "Currículum",
        "profileCoder.uploadResume": "Subir Currículum (PDF)",
        "profileCoder.noResume": "No hay currículum subido",
        
        // Buttons
        "profileCoder.saveChanges": "Guardar Cambios",
        "profileCoder.cancel": "Cancelar"
    }
  };

  // Obtener idioma actual
  function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
  }

  // Cambiar idioma
  function setLanguage(lang) {
    if (translations[lang]) {
      localStorage.setItem('language', lang);
      applyTranslations(lang);
      updateLanguageButton(lang);
    }
  }

  // Aplicar traducciones
  function applyTranslations(lang) {
    const langData = translations[lang] || translations['en'];
    
    // Traducir elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (langData[key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = langData[key];
        } else if (element.tagName === 'TITLE') {
          document.title = langData[key];
        } else {
          element.textContent = langData[key];
        }
      }
    });

    // Traducir placeholders específicos
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (langData[key] && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
        element.placeholder = langData[key];
      }
    });

    // Traducir atributos específicos
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const attr = element.getAttribute('data-i18n-attr');
      if (langData[key] && attr) {
        element.setAttribute(attr, langData[key]);
      }
    });
  }

  // Actualizar botón de idioma
  function updateLanguageButton(lang) {
    const button = document.getElementById('toggle-language');
    const flagSpan = document.getElementById('language-flag');
    
    if (button && flagSpan) {
      const newLang = lang === 'en' ? 'es' : 'en';
      const flagSrc = newLang === 'es' ? 
        'https://flagcdn.com/co.svg' : 
        'https://flagcdn.com/us.svg';
      const flagAlt = newLang === 'es' ? 'Español' : 'English';
      
      flagSpan.innerHTML = `<img src="${flagSrc}" alt="${flagAlt}" width="22" height="18">`;
    }
  }

  // Inicializar
  function initLanguage() {
    const currentLang = getCurrentLanguage();
    
    // Aplicar traducciones al cargar
    applyTranslations(currentLang);
    updateLanguageButton(currentLang);

    // Configurar evento del botón de idioma
    const toggleBtn = document.getElementById('toggle-language');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        const current = getCurrentLanguage();
        const newLang = current === 'en' ? 'es' : 'en';
        setLanguage(newLang);
      });
    }
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }

})();