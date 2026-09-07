import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={darkMode ? "Aktifkan light mode" : "Aktifkan dark mode"}
      title={darkMode ? "Aktifkan light mode" : "Aktifkan dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-primary hover:cursor-pointer hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {darkMode ? (
        <FiSun className="h-5 w-5" />
      ) : (
        <FiMoon className="h-5 w-5" />
      )}
    </button>
  );
}

export default ThemeToggle;
