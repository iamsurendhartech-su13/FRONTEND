import { createContext, useContext, useState, useCallback } from 'react';
import { getDepartments as apiGetDepartments, createDepartment as apiCreateDepartment, deleteDepartment as apiDeleteDepartment } from '../api/departmentApi';
import { toast } from 'react-toastify';

const DepartmentContext = createContext();
export const useDepartments = () => useContext(DepartmentContext);

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetDepartments();
      setDepartments(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, []);

  const addDepartment = async (deptData) => {
    try {
      const res = await apiCreateDepartment(deptData);
      setDepartments(prev => [...prev, res.data]);
      toast.success('Department Added Successfully');
      return true;
    } catch (err) {
      toast.error('Error adding department');
      return false;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await apiDeleteDepartment(id);
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      toast.success('Department Deleted Successfully');
      return true;
    } catch (err) {
      toast.error('Error deleting department');
      return false;
    }
  };

  return (
    <DepartmentContext.Provider value={{
      departments, loading, error, fetchDepartments, addDepartment, deleteDepartment
    }}>
      {children}
    </DepartmentContext.Provider>
  );
};
