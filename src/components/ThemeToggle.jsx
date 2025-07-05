import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-white text-sm text-black dark:text-black border-black"
    >
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeToggle;
