"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "secret";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  secretUnlocked: boolean;
  setSecretUnlocked: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [secretUnlocked, setSecretUnlockedState] = useState(false);

  useEffect(() => {
    // Load saved theme
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    const savedSecret = localStorage.getItem("secretUnlocked") === "true";

    setSecretUnlockedState(savedSecret);

    // Only set secret theme if unlocked
    if (savedTheme === "secret" && !savedSecret) {
      setThemeState("light");
      document.documentElement.classList.add("light");
    } else {
      setThemeState(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }

    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    // Only allow secret if unlocked
    if (newTheme === "secret" && !secretUnlocked) return;

    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark", "secret");
    document.documentElement.classList.add(newTheme);
    setThemeState(newTheme);
  };

  const setSecretUnlocked = (value: boolean) => {
    localStorage.setItem("secretUnlocked", value.toString());
    setSecretUnlockedState(value);
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        secretUnlocked,
        setSecretUnlocked,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
