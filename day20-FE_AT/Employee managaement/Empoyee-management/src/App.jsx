import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { SalaryProvider } from './context/SalaryContext';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

// Pages (to be implemented)
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/Employees/Employees';
import EmployeeDetails from './pages/Employees/EmployeeDetails';
import Departments from './pages/Departments/Departments';
import Attendance from './pages/Attendance/Attendance';
import Salary from './pages/Salary/Salary';
import Settings from './pages/Settings/Settings';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-dark-bg p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AuthProvider>
          <EmployeeProvider>
            <DepartmentProvider>
              <AttendanceProvider>
                <SalaryProvider>
                  <BrowserRouter>
                    <ToastContainer position="top-right" theme="colored" />
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      
                      {/* Protected Routes */}
                      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                      <Route path="/employees" element={<ProtectedRoute><Layout><Employees /></Layout></ProtectedRoute>} />
                      <Route path="/employees/:id" element={<ProtectedRoute><Layout><EmployeeDetails /></Layout></ProtectedRoute>} />
                      <Route path="/departments" element={<ProtectedRoute><Layout><Departments /></Layout></ProtectedRoute>} />
                      <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
                      <Route path="/salary" element={<ProtectedRoute><Layout><Salary /></Layout></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                      
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </BrowserRouter>
                </SalaryProvider>
              </AttendanceProvider>
            </DepartmentProvider>
          </EmployeeProvider>
        </AuthProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
