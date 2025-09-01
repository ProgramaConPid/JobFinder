// Dark Mode Toggle (robust version)
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-theme"); // Button in the DOM
  const body = document.body;

  // If the toggle button is not found, show a warning and exit
  if (!toggleBtn) {
    console.warn("Dark-theme: #toggle-theme button not found in the DOM.");
    return;
  }

  // Function to apply the selected theme
  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-theme"); // Add dark theme CSS class
      toggleBtn.textContent = "☀️"; // Show sun icon when dark
      toggleBtn.setAttribute("aria-pressed", "true");
    } else {
      body.classList.remove("dark-theme"); // Remove dark theme CSS class
      toggleBtn.textContent = "🌙"; // Show moon icon when light
      toggleBtn.setAttribute("aria-pressed", "false");
    }
  };

  // Detect if the user has already saved a theme or prefers dark by default
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    applyTheme("dark");
  } else {
    applyTheme("light"); // Always light if nothing is saved
  }

  // Toggle between themes when the button is clicked
  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme(isDark ? "dark" : "light");
  });
});
