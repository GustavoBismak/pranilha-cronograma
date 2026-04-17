import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Uber from './pages/Uber';
import Goals from './pages/Goals';
import Weekly from './pages/Weekly';
import Login from './pages/Login';

// Simple mock auth guard for now
const isAuthenticated = () => localStorage.getItem('auth_token') === 'true';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="routine" element={<Routine />} />
          <Route path="uber" element={<Uber />} />
          <Route path="goals" element={<Goals />} />
          <Route path="weekly" element={<Weekly />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
