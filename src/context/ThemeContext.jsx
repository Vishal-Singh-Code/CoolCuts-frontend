import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEMES = ["atelier", "coast", "ember"];
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("coolcuts-theme");
    return THEMES.includes(saved) ? saved : "atelier";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("coolcuts-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      cycleTheme: () => {
        const currentIndex = THEMES.indexOf(theme);
        const next = THEMES[(currentIndex + 1) % THEMES.length];
        setTheme(next);
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
