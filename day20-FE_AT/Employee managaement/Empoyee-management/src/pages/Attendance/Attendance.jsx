import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useAttendance } from '../../context/AttendanceContext';
import { useEmployees } from '../../context/EmployeeContext';
import { useDepartments } from '../../context/DepartmentContext';
import Loader from '../../components/Loader/Loader';

const Attendance = () => {
  const { attendanceRecords, loading, fetchAttendance, addAttendance, updateAttendance, deleteAttendance } = useAttendance();
  const { employees, fetchEmployees } = useEmployees();
  const { departments, fetchDepartments } = useDepartments();

  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    employeeName: '',
    employeeId: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    timeIn: '',
    timeOut: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
    fetchDepartments();
  }, [fetchAttendance, fetchEmployees, fetchDepartments]);

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = 
      record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || record.date === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      await deleteAttendance(id);
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
        department: selectedEmp.department
      });
    } else {
      setFormData({
        ...formData,
        employeeName: '',
        employeeId: '',
        department: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    if (editingId) {
      success = await updateAttendance(editingId, formData);
    } else {
      success = await addAttendance(formData);
    }
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  if (loading && attendanceRecords.length === 0) return <Loader />;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400">Track daily employee attendance and leaves.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Attendance
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
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            />
            <button onClick={() => setDateFilter('')} className="btn-secondary whitespace-nowrap">
               Clear Date
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium border-b border-slate-200 dark:border-slate-700">
                <th className="p-4">Employee</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Time In</th>
                <th className="p-4">Time Out</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, idx) => (
                <motion.tr 
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-slate-800 dark:text-white">{record.employeeName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.department} | {record.employeeId}</p>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{record.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Present' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      record.status === 'Late' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                      record.status === 'Absent' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{record.timeIn || '-'}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{record.timeOut || '-'}</td>
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
                    No attendance records found matching your criteria.
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
                  {editingId ? 'Edit Attendance' : 'Add Attendance'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <FiX className="text-2xl" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="attendanceForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Employee *</label>
                    <select required className="input-field" onChange={handleEmployeeChange} value={employees.find(emp => emp.name === formData.employeeName)?.id || ""}>
                      <option value="">Select Employee...</option>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId || emp.id})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                    <input required type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status *</label>
                    <select required className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Half Day">Half Day</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Check-in Time</label>
                    <input type="time" className="input-field" value={formData.timeIn} onChange={e => setFormData({...formData, timeIn: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Check-out Time</label>
                    <input type="time" className="input-field" value={formData.timeOut} onChange={e => setFormData({...formData, timeOut: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                    <textarea className="input-field" rows="2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" form="attendanceForm" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;
