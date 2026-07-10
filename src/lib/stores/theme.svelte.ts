const STORAGE_KEY = "pokedex-theme";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof document === "undefined") {
    return "light";
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

class ThemeStore {
  current = $state<Theme>(getInitialTheme());

  toggle() {
    this.set(this.current === "dark" ? "light" : "dark");
  }

  set(theme: Theme) {
    this.current = theme;
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }
}

export const themeStore = new ThemeStore();
export { STORAGE_KEY as THEME_STORAGE_KEY };
