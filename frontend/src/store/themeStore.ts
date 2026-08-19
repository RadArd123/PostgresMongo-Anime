import { create } from "zustand";

export type ThemeColor = "blue" | "red" | "green" | "purple" | "gold" | "cyan";

interface ThemeState {
  themeColor: ThemeColor;
  setTheme: (color: ThemeColor) => void;
  initTheme: () => void;
}

const getInitialTheme = (): ThemeColor => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("app-theme") as ThemeColor;
    if (["blue", "red", "green", "purple", "gold", "cyan"].includes(saved)) {
      return saved;
    }
  }
  return "blue";
};

export const useThemeStore = create<ThemeState>((set) => ({
  themeColor: getInitialTheme(),

  setTheme: (color: ThemeColor) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app-theme", color);
      if (color === "blue") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", color);
      }
    }
    set({ themeColor: color });
  },

  initTheme: () => {
    if (typeof window !== "undefined") {
      const color = getInitialTheme();
      if (color === "blue") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", color);
      }
      set({ themeColor: color });
    }
  },
}));
