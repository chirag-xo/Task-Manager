import { useState, useEffect } from 'react';
import { storageUtils } from '../utils/storage';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = storageUtils.getTheme();
    setIsDark(savedTheme);
    updateTheme(savedTheme);
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    storageUtils.saveTheme(newTheme);
    updateTheme(newTheme);
  };

  return { isDark, toggleTheme };
};