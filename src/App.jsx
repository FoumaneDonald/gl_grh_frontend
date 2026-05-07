import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DirecteurDashboard from './pages/DirecteurDashboard';
import ChefServiceDashboard from './pages/ChefServiceDashboard';
import OperantDashboard from './pages/OperantDashboard';
import { getRole, isAuthenticated } from './services/authService';

const PrivateRoute = ({ children, roles }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (roles && !roles.includes(getRole())) return <Navigate to="/login" />;
  return children;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/directeur" element={
        <PrivateRoute roles={['DIRECTEUR']}><DirecteurDashboard /></PrivateRoute>
      } />
      <Route path="/chef-service" element={
        <PrivateRoute roles={['CHEF_SERVICE']}><ChefServiceDashboard /></PrivateRoute>
      } />
      <Route path="/operant" element={
        <PrivateRoute roles={['OPERANT']}><OperantDashboard /></PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);

export default App;