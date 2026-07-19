import { createContext, useContext, useState, useCallback } from 'react';
import { getEmployees as apiGetEmployees, createEmployee as apiCreateEmployee, updateEmployee as apiUpdateEmployee, deleteEmployee as apiDeleteEmployee } from '../api/employeeApi';
import { toast } from 'react-toastify';

const EmployeeContext = createContext();
export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetEmployees();
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEmployee = async (empData) => {
    try {
      const res = await apiCreateEmployee(empData);
      setEmployees(prev => [...prev, res.data]);
      toast.success('Employee Added Successfully');
      return true;
    } catch (err) {
      toast.error('Error adding employee');
      return false;
    }
  };

  const updateEmployee = async (id, empData) => {
    try {
      const res = await apiUpdateEmployee(id, empData);
      setEmployees(prev => prev.map(emp => emp.id === id ? res.data : emp));
      toast.success('Employee Updated Successfully');
      return true;
    } catch (err) {
      toast.error('Error updating employee');
      return false;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await apiDeleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast.success('Employee Deleted Successfully');
      return true;
    } catch (err) {
      toast.error('Error deleting employee');
      return false;
    }
  };

  return (
    <EmployeeContext.Provider value={{
      employees, loading, error, fetchEmployees, addEmployee, updateEmployee, deleteEmployee
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
