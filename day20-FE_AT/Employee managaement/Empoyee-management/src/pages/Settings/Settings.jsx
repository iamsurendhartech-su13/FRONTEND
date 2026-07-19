import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { motion } from 'framer-motion';
import { FiSave, FiUser, FiBell, FiShield, FiMoon, FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';

const Settings = () => {
  const { settings, loading, saveSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState({
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
    pushNotifications: false,
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        ...settings,
        password: '',
        confirmPassword: ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Create payload, removing password if it's empty
    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    await saveSettings(payload);
  };

  if (loading && !settings.id) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage application and account preferences.</p>
        </div>
        <button type="submit" form="settingsForm" className="btn-primary flex items-center gap-2">
          <FiSave /> Save Settings
        </button>
      </div>

      <div className="glass-card flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-700/50 p-4">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('company')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === 'company' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <FiBriefcase /> Company Settings
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === 'profile' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <FiUser /> User Profile
            </button>
            <button 
              onClick={() => setActiveTab('theme')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === 'theme' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <FiMoon /> Theme Settings
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === 'notifications' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <FiBell /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === 'security' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <FiShield /> Security
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <form id="settingsForm" onSubmit={handleSubmit}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Company Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="input-field" placeholder="Enter company name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Email</label>
                      <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} className="input-field" placeholder="company@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Phone</label>
                      <input type="text" name="companyPhone" value={formData.companyPhone} onChange={handleChange} className="input-field" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Address</label>
                      <textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} className="input-field" rows="3" placeholder="Full address"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">User Profile</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <img src={formData.profilePhoto || `https://ui-avatars.com/api/?name=${formData.fullName || 'User'}&background=14b8a6&color=fff`} alt="Profile" className="w-20 h-20 rounded-full shadow-md object-cover" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Profile Photo URL</label>
                      <input type="text" name="profilePhoto" value={formData.profilePhoto} onChange={handleChange} className="input-field max-w-md" placeholder="https://example.com/avatar.jpg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Theme Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-colors ${formData.themeMode === 'light' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.themeMode === 'light' ? 'border-brand-500' : 'border-slate-300 dark:border-slate-600'}`}>
                          {formData.themeMode === 'light' && <div className="w-3 h-3 rounded-full bg-brand-500"></div>}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">Light Mode</span>
                      </div>
                      <input type="radio" name="themeMode" value="light" checked={formData.themeMode === 'light'} onChange={handleChange} className="hidden" />
                    </label>

                    <label className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-colors ${formData.themeMode === 'dark' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.themeMode === 'dark' ? 'border-brand-500' : 'border-slate-300 dark:border-slate-600'}`}>
                          {formData.themeMode === 'dark' && <div className="w-3 h-3 rounded-full bg-brand-500"></div>}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">Dark Mode</span>
                      </div>
                      <input type="radio" name="themeMode" value="dark" checked={formData.themeMode === 'dark'} onChange={handleChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Changes will be applied across the application after saving.</p>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Notification Settings</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive system updates via email</p>
                      </div>
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.emailNotifications ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                      <input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} className="hidden" />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Push Notifications</p>
                        <p className="text-sm text-slate-500">Receive alerts inside the application</p>
                      </div>
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.pushNotifications ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                      <input type="checkbox" name="pushNotifications" checked={formData.pushNotifications} onChange={handleChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Security</h3>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Change Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="Enter new password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="Confirm new password" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
