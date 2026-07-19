import { FiSearch, FiBell, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-white/70 dark:bg-dark-card/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-brand-500/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
        <FiSearch className="text-slate-400 text-lg" />
        <input 
          type="text" 
          placeholder="Search employees, departments..." 
          className="bg-transparent border-none outline-none w-full ml-3 text-sm text-slate-700 dark:text-slate-200"
        />
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiBell className="text-xl" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'Administrator'}</p>
          </div>
          <img 
            src="https://ui-avatars.com/api/?name=Admin+User&background=14b8a6&color=fff" 
            alt="Profile" 
            className="w-10 h-10 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
          />
          <button onClick={logout} className="ml-2 text-slate-500 hover:text-red-500 transition-colors" title="Logout">
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
