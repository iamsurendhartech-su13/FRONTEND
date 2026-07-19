import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUsers, FiBriefcase, 
  FiCalendar, FiDollarSign, FiSettings 
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <FiHome /> },
  { name: 'Employees', path: '/employees', icon: <FiUsers /> },
  { name: 'Departments', path: '/departments', icon: <FiBriefcase /> },
  { name: 'Attendance', path: '/attendance', icon: <FiCalendar /> },
  { name: 'Salary', path: '/salary', icon: <FiDollarSign /> },
  { name: 'Settings', path: '/settings', icon: <FiSettings /> },
];

const Sidebar = () => {
  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-slate-700/50 shadow-lg flex flex-col h-full"
    >
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700/50">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
          E
        </div>
        <span className="text-xl font-bold text-slate-800 dark:text-white">EmpManage</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium
              ${isActive 
                ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 text-xs text-center text-slate-500 dark:text-slate-400">
        © 2026 EmpManage Pro
      </div>
    </motion.aside>
  );
};

export default Sidebar;
