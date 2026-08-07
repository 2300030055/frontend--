import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentProject from './pages/student/StudentProject';
import StudentSessions from './pages/student/StudentSessions';
import StudentCertificates from './pages/student/StudentCertificates';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ImportCSV from './pages/admin/ImportCSV';
import TakeAttendance from './pages/admin/TakeAttendance';
import ManageSessions from './pages/admin/ManageSessions';
import ManageCertificates from './pages/admin/ManageCertificates';

import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import ManageAdmins from './pages/superadmin/ManageAdmins';
import ClubSettings from './pages/superadmin/ClubSettings';

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword) return <Navigate to="/change-password" replace />;
  if (user.role === 'student') return <Navigate to="/student" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/super-admin" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={
            <ProtectedRoute><ChangePasswordPage /></ProtectedRoute>
          } />
          <Route path="/" element={<RoleRedirect />} />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentProfile /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/project" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentProject /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/sessions" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentSessions /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/certificates" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentCertificates /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><ManageStudents /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/import" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><ImportCSV /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><TakeAttendance editWindow="15 minutes" /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sessions" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><ManageSessions /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/certificates" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><ManageCertificates /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Super Admin Routes */}
          <Route path="/super-admin" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><SuperAdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/students" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><ManageStudents /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/admins" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><ManageAdmins /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/import" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><ImportCSV /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/attendance" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><TakeAttendance editWindow="24 hours" /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/sessions" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><ManageSessions canDelete /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/certificates" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><ManageCertificates /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/settings" element={
            <ProtectedRoute roles={['super_admin']}>
              <DashboardLayout><ClubSettings /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
