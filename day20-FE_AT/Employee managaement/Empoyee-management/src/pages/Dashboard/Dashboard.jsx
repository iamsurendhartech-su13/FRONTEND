import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBriefcase, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useEmployees } from '../../context/EmployeeContext';
import { useDepartments } from '../../context/DepartmentContext';
import Loader from '../../components/Loader/Loader';

const Dashboard = () => {
  const { employees, loading: empLoading, fetchEmployees } = useEmployees();
  const { departments, loading: deptLoading, fetchDepartments } = useDepartments();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  if (empLoading || deptLoading) {
    return <div className="h-full flex items-center justify-center"><Loader /></div>;
  }

  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  const stats = [
    { title: 'Total Employees', value: employees.length, icon: <FiUsers />, color: 'bg-blue-500' },
    { title: 'Active Employees', value: activeEmployees, icon: <FiCheckCircle />, color: 'bg-green-500' },
    { title: 'Departments', value: departments.length, icon: <FiBriefcase />, color: 'bg-purple-500' },
    { title: 'Monthly Salary (Avg)', value: `$${Math.round(totalSalary/Math.max(1, employees.length)).toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-brand-500' },
  ];

  const growthData = [
    { month: 'Jan', employees: 40 },
    { month: 'Feb', employees: 45 },
    { month: 'Mar', employees: 48 },
    { month: 'Apr', employees: 55 },
    { month: 'May', employees: 65 },
    { month: 'Jun', employees: employees.length },
  ];

  const pieColors = ['#14b8a6', '#3b82f6', '#8b5cf6', '#ef4444'];
  const departmentData = departments.map(d => ({ name: d.name, value: d.count }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome to your HR management center.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-${stat.color.replace('bg-', '')}/40 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Employee Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="employees" stroke="#14b8a6" fillOpacity={1} fill="url(#colorEmp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Department Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
