import { createContext, useContext, useState, useCallback } from 'react';
import { getAttendance as apiGetAttendance, createAttendance as apiCreateAttendance, updateAttendance as apiUpdateAttendance, deleteAttendance as apiDeleteAttendance } from '../api/attendanceApi';
import { toast } from 'react-toastify';

const AttendanceContext = createContext();
export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAttendance();
      setAttendanceRecords(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance records');
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAttendance = async (data) => {
    try {
      const res = await apiCreateAttendance(data);
      setAttendanceRecords(prev => [...prev, res.data]);
      toast.success('Attendance Record Added Successfully');
      return true;
    } catch (err) {
      toast.error('Error adding attendance record');
      return false;
    }
  };

  const updateAttendance = async (id, data) => {
    try {
      const res = await apiUpdateAttendance(id, data);
      setAttendanceRecords(prev => prev.map(record => record.id === id ? res.data : record));
      toast.success('Attendance Record Updated Successfully');
      return true;
    } catch (err) {
      toast.error('Error updating attendance record');
      return false;
    }
  };

  const deleteAttendance = async (id) => {
    try {
      await apiDeleteAttendance(id);
      setAttendanceRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Attendance Record Deleted Successfully');
      return true;
    } catch (err) {
      toast.error('Error deleting attendance record');
      return false;
    }
  };

  return (
    <AttendanceContext.Provider value={{
      attendanceRecords, loading, error, fetchAttendance, addAttendance, updateAttendance, deleteAttendance
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};
