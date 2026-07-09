import { createContext, useEffect, useState } from "react";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState(() => {
    const data = localStorage.getItem("attendance");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  const markAttendance = (record) => {
    setAttendance((prev) => [...prev, record]);
  };

  const deleteAttendance = (id) => {
    setAttendance((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        markAttendance,
        deleteAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};