import { createContext, useContext, useState, useCallback } from 'react';
import { getSalary as apiGetSalary, createSalary as apiCreateSalary, updateSalary as apiUpdateSalary, deleteSalary as apiDeleteSalary } from '../api/salaryApi';
import { toast } from 'react-toastify';

const SalaryContext = createContext();
export const useSalary = () => useContext(SalaryContext);

export const SalaryProvider = ({ children }) => {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetSalary();
      setSalaryRecords(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch salary records');
      toast.error('Failed to fetch salary records');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSalary = async (data) => {
    try {
      const res = await apiCreateSalary(data);
      setSalaryRecords(prev => [...prev, res.data]);
      toast.success('Salary Record Added Successfully');
      return true;
    } catch (err) {
      toast.error('Error adding salary record');
      return false;
    }
  };

  const updateSalary = async (id, data) => {
    try {
      const res = await apiUpdateSalary(id, data);
      setSalaryRecords(prev => prev.map(record => record.id === id ? res.data : record));
      toast.success('Salary Record Updated Successfully');
      return true;
    } catch (err) {
      toast.error('Error updating salary record');
      return false;
    }
  };

  const deleteSalary = async (id) => {
    try {
      await apiDeleteSalary(id);
      setSalaryRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Salary Record Deleted Successfully');
      return true;
    } catch (err) {
      toast.error('Error deleting salary record');
      return false;
    }
  };

  return (
    <SalaryContext.Provider value={{
      salaryRecords, loading, error, fetchSalary, addSalary, updateSalary, deleteSalary
    }}>
      {children}
    </SalaryContext.Provider>
  );
};
