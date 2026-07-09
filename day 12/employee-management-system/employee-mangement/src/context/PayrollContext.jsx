import { createContext, useEffect, useState } from "react";

export const PayrollContext = createContext();

export const PayrollProvider = ({ children }) => {
  const [payrolls, setPayrolls] = useState(() => {
    const data = localStorage.getItem("payrolls");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("payrolls", JSON.stringify(payrolls));
  }, [payrolls]);

  const addPayroll = (payroll) => {
    setPayrolls([...payrolls, payroll]);
  };

  const deletePayroll = (id) => {
    setPayrolls(payrolls.filter((item) => item.id !== id));
  };

  return (
    <PayrollContext.Provider
      value={{
        payrolls,
        addPayroll,
        deletePayroll,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};