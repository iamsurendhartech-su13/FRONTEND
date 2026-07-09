import { createContext, useEffect, useState } from "react";

export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState(() => {
    const data = localStorage.getItem("leaves");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }, [leaves]);

  const addLeave = (leave) => {
    setLeaves([...leaves, leave]);
  };

  const deleteLeave = (id) => {
    setLeaves(leaves.filter((leave) => leave.id !== id));
  };

  const updateLeaveStatus = (id, status) => {
    setLeaves(
      leaves.map((leave) =>
        leave.id === id ? { ...leave, status } : leave
      )
    );
  };

  return (
    <LeaveContext.Provider
      value={{
        leaves,
        addLeave,
        deleteLeave,
        updateLeaveStatus,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};