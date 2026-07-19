import { createContext, useContext, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { settings, saveSettings, loading } = useSettings();
  const isDarkMode = settings?.themeMode === 'dark';

  useEffect(() => {
    if (!loading && settings) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, loading, settings]);

  const toggleTheme = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    saveSettings({ ...settings, themeMode: newMode });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
