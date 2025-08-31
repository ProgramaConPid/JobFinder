// Dark Mode Toggle (robusto)
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-theme"); // botón en el DOM
  const body = document.body;

  if (!toggleBtn) {
    console.warn("Dark-theme: botón #toggle-theme no encontrado en el DOM.");
    return;
  }

  // Función que aplica el tema
  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-theme");    // usa tu clase CSS
      toggleBtn.textContent = "☀️";       // sol cuando está oscuro
      toggleBtn.setAttribute("aria-pressed", "true");
    } else {
      body.classList.remove("dark-theme");
      toggleBtn.textContent = "🌙";       // luna cuando está claro
      toggleBtn.setAttribute("aria-pressed", "false");
    }
  };

  // Detecta si el usuario ya guardó un tema o prefiere oscuro por defecto
const saved = localStorage.getItem("theme");

if (saved === "dark") {
  applyTheme("dark");
} else {
  applyTheme("light"); // siempre claro si no hay nada guardado
}


  // Cambia entre temas al hacer click
  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme(isDark ? "dark" : "light");
  });
});

