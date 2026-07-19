import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useSalary } from '../../context/SalaryContext';
import { useEmployees } from '../../context/EmployeeContext';
import Loader from '../../components/Loader/Loader';

const Salary = () => {
  const { salaryRecords, loading, fetchSalary, addSalary, updateSalary, deleteSalary } = useSalary();
  const { employees, fetchEmployees } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    employeeName: '',
    employeeId: '',
    department: '',
    basicSalary: 0,
    bonus: 0,
    deductions: 0,
    tax: 0,
    netSalary: 0,
    salaryMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    paymentStatus: 'Pending'
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchSalary();
    fetchEmployees();
  }, [fetchSalary, fetchEmployees]);

  // Auto-calculate Net Salary
  useEffect(() => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const bonus = parseFloat(formData.bonus) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const net = basic + bonus - deductions - tax;
    setFormData(prev => ({ ...prev, netSalary: net }));
  }, [formData.basicSalary, formData.bonus, formData.deductions, formData.tax]);

  const filteredRecords = salaryRecords.filter(record => {
    const matchesSearch = 
      record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = !monthFilter || record.salaryMonth === monthFilter;
    
    return matchesSearch && matchesMonth;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      await deleteSalary(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingId(record.id);
    setFormData({ ...record });
    setIsModalOpen(true);
  };

  const handleEmployeeChange = (e) => {
    const selectedEmp = employees.find(emp => emp.id.toString() === e.target.value);
    if (selectedEmp) {
      setFormData({
        ...formData,
        employeeName: selectedEmp.name,
        employeeId: selectedEmp.employeeId || selectedEmp.id.toString(),
        department: selectedEmp.department,
        basicSalary: selectedEmp.salary || 0
      });
    } else {
      setFormData({
        ...formData,
        employeeName: '',
        employeeId: '',
        department: '',
        basicSalary: 0
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    if (editingId) {
      success = await updateSalary(editingId, formData);
    } else {
      success = await addSalary(formData);
    }
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  if (loading && salaryRecords.length === 0) return <Loader />;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Salary Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage employee salaries, bonuses, and deductions.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Salary
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID or department..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full md:w-auto items-center gap-4">
             <input 
              type="month" 
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="input-field"
            />
            <button onClick={() => setMonthFilter('')} className="btn-secondary whitespace-nowrap">
               Clear Month
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium border-b border-slate-200 dark:border-slate-700">
                <th className="p-4">Employee</th>
                <th className="p-4">Month</th>
                <th className="p-4">Basic</th>
                <th className="p-4">Net Salary</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, idx) => (
                <motion.tr 
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-slate-800 dark:text-white">{record.employeeName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.department} | {record.employeeId}</p>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{record.salaryMonth}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">${parseFloat(record.basicSalary).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-brand-600 dark:text-brand-400">${parseFloat(record.netSalary).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                    }`}>
                      {record.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                     <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(record)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(record.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No salary records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Edit Salary' : 'Add Salary'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <FiX className="text-2xl" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="salaryForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Employee *</label>
                    <select required className="input-field" onChange={handleEmployeeChange} value={employees.find(emp => emp.name === formData.employeeName)?.id || ""}>
                      <option value="">Select Employee...</option>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId || emp.id})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Month *</label>
                    <input required type="month" className="input-field" value={formData.salaryMonth} onChange={e => setFormData({...formData, salaryMonth: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Status *</label>
                    <select required className="input-field" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Basic Salary *</label>
                    <input required type="number" min="0" step="0.01" className="input-field" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bonus</label>
                    <input type="number" min="0" step="0.01" className="input-field" value={formData.bonus} onChange={e => setFormData({...formData, bonus: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deductions</label>
                    <input type="number" min="0" step="0.01" className="input-field" value={formData.deductions} onChange={e => setFormData({...formData, deductions: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax</label>
                    <input type="number" min="0" step="0.01" className="input-field" value={formData.tax} onChange={e => setFormData({...formData, tax: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-600 dark:text-brand-400 mb-1">Net Salary (Auto Calculated)</label>
                    <input type="number" readOnly className="input-field bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed font-bold" value={formData.netSalary} />
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" form="salaryForm" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Add Salary'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Salary;
