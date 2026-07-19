import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import {
  FiArrowLeft, FiMail, FiPhone, FiMapPin,
  FiCalendar, FiBriefcase, FiUser, FiDollarSign
} from 'react-icons/fi';
import Loader from '../../components/Loader/Loader';

const Detail = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
    <Icon className="text-brand-500 mt-0.5 shrink-0" />
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
      <p className="font-medium" id={`detail-${label.toLowerCase().replace(/\s/g, '-')}`}>{value || '—'}</p>
    </div>
  </div>
);

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, loading, fetchEmployees } = useEmployees();

  useEffect(() => {
    if (employees.length === 0) fetchEmployees();
  }, [employees.length, fetchEmployees]);

  if (loading) return <Loader />;

  const emp = employees.find(e => String(e.id) === String(id));

  if (!emp) {
    return (
      <div className="text-center py-20" id="employee-not-found">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Employee not found</h2>
        <button onClick={() => navigate('/employees')} className="mt-4 btn-primary">
          Back to Employees
        </button>
      </div>
    );
  }

  const salary = emp.salary ? `₹${Number(emp.salary).toLocaleString('en-IN')} / year` : '—';
  const joining = emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        id="btn-back-to-directory"
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-500 transition-colors"
      >
        <FiArrowLeft /> Back to Directory
      </button>

      <div className="glass-card overflow-hidden" id="employee-detail-card">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-brand-400 to-blue-500" />

        <div className="px-8 pb-8">
          {/* Avatar + Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 mb-6 gap-4">
            <div className="flex items-end gap-6">
              <img
                src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=14b8a6&color=fff&size=128`}
                alt={emp.name}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-dark-card shadow-lg bg-white"
                id="detail-avatar"
              />
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white" id="detail-name">{emp.name}</h1>
                <p className="text-brand-600 dark:text-brand-400 font-medium" id="detail-designation">{emp.designation}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400" id="detail-employee-id">
                  {emp.employeeId}
                </p>
              </div>
            </div>
            <span
              id="detail-status-badge"
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                emp.status === 'Active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
              }`}
            >
              {emp.status} Employee
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                Contact Information
              </h3>
              <Detail icon={FiMail} label="Email" value={emp.email} />
              <Detail icon={FiPhone} label="Phone" value={emp.phone} />
              <Detail icon={FiUser} label="Gender" value={emp.gender} />
              <Detail icon={FiMapPin} label="Address" value={emp.address} />
            </div>

            {/* Employment */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                Employment Details
              </h3>
              <Detail icon={FiBriefcase} label="Department" value={emp.department} />
              <Detail icon={FiBriefcase} label="Designation" value={emp.designation} />
              <Detail icon={FiCalendar} label="Joining Date" value={joining} />
              <Detail icon={FiDollarSign} label="Salary" value={salary} />
              <Detail icon={FiUser} label="Employment Type" value={emp.employmentType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
