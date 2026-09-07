import { createContext, useEffect, useState, useContext } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;

    htmlElement.classList.toggle("dark", darkMode);
    htmlElement.style.colorScheme = darkMode ? "dark" : "light";

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode((previousMode) => !previousMode);
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Gunakan di ThemeProvider");
  }

  return context;
}
