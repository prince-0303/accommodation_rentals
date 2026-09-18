import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPropertyListPage from './pages/AdminPropertyListPage';
import AdminBookingListPage from './pages/AdminBookingListPage';
import AdminUserListPage from './pages/AdminUserListPage';
import { ProtectedRoute, AdminRoute, PublicUserRoute } from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPropertyFormPage from './pages/AdminPropertyFormPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* User Side Layout */}
          <Route element={
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Outlet />
              </main>
            </div>
          }>
            {/* Public/User Routes */}
            <Route path="/" element={<PublicUserRoute><PropertyListPage /></PublicUserRoute>} />
            <Route path="/properties/:id" element={<PublicUserRoute><PropertyDetailPage /></PublicUserRoute>} />
            <Route path="/login" element={<PublicUserRoute><LoginPage /></PublicUserRoute>} />
            <Route path="/register" element={<PublicUserRoute><RegisterPage /></PublicUserRoute>} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/bookings" element={<MyBookingsPage />} />
            </Route>
          </Route>

          {/* Admin Side Layout */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="properties" element={<AdminPropertyListPage />} />
              <Route path="properties/new" element={<AdminPropertyFormPage />} />
              <Route path="properties/:id/edit" element={<AdminPropertyFormPage />} />
              <Route path="bookings" element={<AdminBookingListPage />} />
              <Route path="users" element={<AdminUserListPage />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
          }} 
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
