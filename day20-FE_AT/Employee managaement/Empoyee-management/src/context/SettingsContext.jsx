import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getSettings as apiGetSettings, createSettings as apiCreateSettings, updateSettings as apiUpdateSettings } from '../api/settingsApi';
import { toast } from 'react-toastify';

const SettingsContext = createContext();
export const useSettings = () => useContext(SettingsContext);

export const defaultSettings = {
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  profilePhoto: '',
  fullName: '',
  email: '',
  phone: '',
  themeMode: 'light',
  emailNotifications: false,
  pushNotifications: false
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetSettings();
      if (res.data && res.data.length > 0) {
        setSettings(res.data[0]); // Assume ID 1 is the main settings object
      } else {
        // If no settings exist yet, create default
        const newSettings = { id: "1", ...defaultSettings };
        await apiCreateSettings(newSettings);
        setSettings(newSettings);
      }
      setError(null);
    } catch (err) {
      if (!err.response) {
        setError('Unable to connect to the server. Please start JSON Server.');
      } else {
        const errorMsg = `Error: ${err.response.status} - ${err.response.statusText}`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (data) => {
    try {
      if (settings.id) {
        const res = await apiUpdateSettings(settings.id, data);
        setSettings(res.data);
      } else {
        const res = await apiCreateSettings({ id: "1", ...data });
        setSettings(res.data);
      }
      toast.success('Settings Saved Successfully');
      return true;
    } catch (err) {
      toast.error('Error saving settings');
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{
      settings, loading, error, fetchSettings, saveSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
