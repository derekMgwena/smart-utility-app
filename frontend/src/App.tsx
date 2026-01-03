import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ElectricityMonitor from './components/ElectricityMonitor';
import WaterMonitor from './components/WaterMonitor';
import ApplianceManager from './components/ApplianceManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('token') !== null;
  });

  const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30">
      <Navigation onLogout={() => setIsAuthenticated(false)} />
      <div className="pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900">
              <Login onLogin={() => setIsAuthenticated(true)} />
            </div> : 
            <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900">
              <Register onRegister={() => setIsAuthenticated(true)} />
            </div> : 
            <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <ProtectedLayout><Dashboard /></ProtectedLayout> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/electricity" 
          element={
            isAuthenticated ? 
            <ProtectedLayout><ElectricityMonitor /></ProtectedLayout> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/water" 
          element={
            isAuthenticated ? 
            <ProtectedLayout><WaterMonitor /></ProtectedLayout> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/appliances" 
          element={
            isAuthenticated ? 
            <ProtectedLayout><ApplianceManager /></ProtectedLayout> : 
            <Navigate to="/login" />
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
