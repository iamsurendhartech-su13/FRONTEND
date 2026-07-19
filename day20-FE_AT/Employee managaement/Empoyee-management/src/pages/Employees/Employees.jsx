import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiX,
  FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { useEmployees } from '../../context/EmployeeContext';
import { useDepartments } from '../../context/DepartmentContext';
import Loader from '../../components/Loader/Loader';

const PAGE_SIZE = 10;

const INITIAL_FORM = {
  name: '', email: '', phone: '', gender: '', dob: '',
  address: '', department: '', designation: '',
  joiningDate: '', salary: '', employmentType: 'Full-Time', status: 'Active'
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!emailRegex.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!phoneRegex.test(form.phone)) errors.phone = 'Phone must be exactly 10 digits.';
  if (!form.department) errors.department = 'Department is required.';
  if (!form.designation.trim()) errors.designation = 'Designation is required.';
  if (!form.gender) errors.gender = 'Gender is required.';
  if (!form.joiningDate) errors.joiningDate = 'Joining date is required.';
  if (!form.salary && form.salary !== 0) errors.salary = 'Salary is required.';
  else if (Number(form.salary) <= 0) errors.salary = 'Salary must be a positive number.';
  return errors;
}

const SortIcon = ({ col, sortKey, sortDir }) => {
  if (sortKey !== col) return <FiChevronUp className="opacity-20 ml-1 inline" />;
  return sortDir === 'asc'
    ? <FiChevronUp className="ml-1 inline text-brand-500" />
    : <FiChevronDown className="ml-1 inline text-brand-500" />;
};

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-500 validation-error">{error}</p>
    )}
  </div>
);

const Employees = () => {
  const { employees, loading, fetchEmployees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { departments, fetchDepartments } = useDepartments();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.name?.toLowerCase().includes(q) ||
      emp.employeeId?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q)
    );
  }, [employees, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sortKey] ?? '';
      let bv = b[sortKey] ?? '';
      if (sortKey === 'salary') { av = Number(av); bv = Number(bv); }
      else { av = String(av).toLowerCase(); bv = String(bv).toLowerCase(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await deleteEmployee(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingId(emp.id);
    setFormData({ ...INITIAL_FORM, ...emp });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSubmitting(true);
    const success = editingId
      ? await updateEmployee(editingId, formData)
      : await addEmployee(formData);
    setSubmitting(false);
    if (success) { setIsModalOpen(false); fetchEmployees(); }
  };

  const ThCol = ({ col, label }) => (
    <th
      className="p-4 cursor-pointer select-none hover:text-brand-500 transition-colors whitespace-nowrap"
      onClick={() => handleSort(col)}
      id={`sort-${col}`}
    >
      {label}<SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
    </th>
  );

  if (loading && employees.length === 0) return <Loader />;

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Employees Directory</h1>
          <p className="text-slate-500 dark:text-slate-400" id="employee-count-label">
            Manage all company employees — <span id="employee-total-count">{employees.length}</span> total
          </p>
        </div>
        <button id="btn-add-employee" onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Employee
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="employee-search"
              type="text"
              placeholder="Search by name, ID, email or department…"
              className="input-field pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX />
              </button>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap" id="employee-filtered-count">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="employee-table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium border-b border-slate-200 dark:border-slate-700">
                <ThCol col="name" label="Employee" />
                <th className="p-4">ID</th>
                <ThCol col="department" label="Department" />
                <th className="p-4">Designation</th>
                <th className="p-4">Phone</th>
                <ThCol col="salary" label="Salary" />
                <th className="p-4">Gender</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="employee-table-body">
              {paginated.map((emp, idx) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="employee-row border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  id={`row-emp-${emp.id}`}
                  data-email={emp.email}
                  data-name={emp.name}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=14b8a6&color=fff`}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <p className="employee-name font-semibold text-slate-800 dark:text-white">{emp.name}</p>
                        <p className="employee-email text-xs text-slate-500 dark:text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-mono text-sm employee-id">{emp.employeeId}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 employee-department">{emp.department}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 employee-designation">{emp.designation}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 employee-phone">{emp.phone}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 employee-salary">
                    {emp.salary ? `₹${Number(emp.salary).toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 employee-gender">{emp.gender || '—'}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 text-sm employee-joining-date">
                    {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="p-4 employee-status">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        id={`btn-view-${emp.id}`}
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        title="View Details"
                        className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                      >
                        <FiEye />
                      </button>
                      <button
                        id={`btn-edit-${emp.id}`}
                        onClick={() => openEditModal(emp)}
                        title="Edit Employee"
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        id={`btn-delete-${emp.id}`}
                        onClick={() => handleDelete(emp.id)}
                        title="Delete Employee"
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {paginated.length === 0 && (
                <tr id="no-results-row">
                  <td colSpan="10" className="p-10 text-center text-slate-500 dark:text-slate-400">
                    {searchTerm ? 'No employees found matching your search.' : 'No employees found. Click "Add Employee" to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400" id="pagination-info">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length} employees
            </p>
            <div className="flex items-center gap-1" id="pagination-controls">
              <button
                id="btn-prev-page"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-slate-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...'
                    ? <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
                    : <button
                        key={p}
                        id={`btn-page-${p}`}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === p
                            ? 'bg-brand-500 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-500/10'
                        }`}
                      >
                        {p}
                      </button>
                )}
              <button
                id="btn-next-page"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-slate-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" id="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
              id="employee-modal"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white" id="modal-title">
                  {editingId ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  id="btn-close-modal"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form id="empForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>

                  <FormField label="Full Name" error={formErrors.name} required>
                    <input id="input-name" type="text"
                      className={`input-field ${formErrors.name ? 'border-red-400' : ''}`}
                      value={formData.name} onChange={e => handleChange('name', e.target.value)}
                      placeholder="e.g. John Smith" />
                  </FormField>

                  <FormField label="Email Address" error={formErrors.email} required>
                    <input id="input-email" type="email"
                      className={`input-field ${formErrors.email ? 'border-red-400' : ''}`}
                      value={formData.email} onChange={e => handleChange('email', e.target.value)}
                      placeholder="e.g. john@company.com" />
                  </FormField>

                  <FormField label="Phone Number" error={formErrors.phone} required>
                    <input id="input-phone" type="text"
                      className={`input-field ${formErrors.phone ? 'border-red-400' : ''}`}
                      value={formData.phone} onChange={e => handleChange('phone', e.target.value)}
                      placeholder="10-digit number" maxLength={10} />
                  </FormField>

                  <FormField label="Gender" error={formErrors.gender} required>
                    <select id="input-gender"
                      className={`input-field ${formErrors.gender ? 'border-red-400' : ''}`}
                      value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormField>

                  <FormField label="Department" error={formErrors.department} required>
                    <select id="input-department"
                      className={`input-field ${formErrors.department ? 'border-red-400' : ''}`}
                      value={formData.department} onChange={e => handleChange('department', e.target.value)}>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Designation" error={formErrors.designation} required>
                    <input id="input-designation" type="text"
                      className={`input-field ${formErrors.designation ? 'border-red-400' : ''}`}
                      value={formData.designation} onChange={e => handleChange('designation', e.target.value)}
                      placeholder="e.g. Software Engineer" />
                  </FormField>

                  <FormField label="Salary (₹)" error={formErrors.salary} required>
                    <input id="input-salary" type="number" min="1"
                      className={`input-field ${formErrors.salary ? 'border-red-400' : ''}`}
                      value={formData.salary} onChange={e => handleChange('salary', e.target.value)}
                      placeholder="e.g. 50000" />
                  </FormField>

                  <FormField label="Joining Date" error={formErrors.joiningDate} required>
                    <input id="input-joining-date" type="date"
                      className={`input-field ${formErrors.joiningDate ? 'border-red-400' : ''}`}
                      value={formData.joiningDate} onChange={e => handleChange('joiningDate', e.target.value)} />
                  </FormField>

                  <FormField label="Employment Type">
                    <select id="input-employment-type" className="input-field"
                      value={formData.employmentType} onChange={e => handleChange('employmentType', e.target.value)}>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </FormField>

                  <FormField label="Status">
                    <select id="input-status" className="input-field"
                      value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Address">
                      <input id="input-address" type="text" className="input-field"
                        value={formData.address} onChange={e => handleChange('address', e.target.value)}
                        placeholder="e.g. 123 Main Street, City" />
                    </FormField>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button id="btn-cancel" type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button id="btn-submit-employee" type="submit" form="empForm" disabled={submitting}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;
