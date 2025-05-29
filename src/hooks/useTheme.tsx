import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

export default function useTheme() {
  const { dataStorage, setStorage } = useLocalStorage();

  const initialTheme = dataStorage().theme || 'dark';

  if (typeof window !== 'undefined') {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(String(initialTheme));
  }

  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setStorage({ theme: newTheme });

    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);
  };

  return {
    theme,
    toggleTheme,
  };
}
