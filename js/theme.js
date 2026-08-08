const THEME_KEY = "tanmia-theme";

function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
  updateThemeIcons(theme);
  updateThemeButtonTitle(theme);
}

function updateThemeIcons(theme) {
  document.querySelectorAll("[data-theme-icon]").forEach((el) => {
    el.textContent = theme === "light" ? "☽" : "☀";
  });
}

function updateThemeButtonTitle(theme) {
  const t = typeof getTranslations === "function" ? getTranslations() : null;
  if (!t) return;
  const title = theme === "light" ? t.themeLight : t.themeDark;
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.title = title;
  });
}

function toggleTheme() {
  const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
  applyTheme(next);
}

function initTheme() {
  applyTheme(getTheme());
}
