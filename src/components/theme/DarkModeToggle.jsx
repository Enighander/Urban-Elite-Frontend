import React, { useEffect, useState } from "react";
import { DarkThemeToggle } from "flowbite-react";

const DarkModeToggle = () => {
  const initialDarkModeState = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(initialDarkModeState);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    window.location.reload();
  };

  return <DarkThemeToggle onClick={toggleDarkMode} />;
};

export default DarkModeToggle;

