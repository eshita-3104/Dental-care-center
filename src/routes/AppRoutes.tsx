import { Routes,Route,Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PatientsListPage from '../pages/PatientList';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '../components/layout/adminlayout';
import PatientDetailPage from '../pages/PatientDetailPage';
import CalendarPage from '../pages/CalendarPage';
import PatientPortalPage from '../pages/PatientPortalPage';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/patients" 
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <AdminLayout>
              <PatientsListPage />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route
        path="/patients/:patientId"
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <AdminLayout>
              <PatientDetailPage/>
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route 
        path="/calendar" 
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <AdminLayout>
              <CalendarPage />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/my-portal" 
        element={
          <PrivateRoute allowedRoles={['Patient']}>
            <PatientPortalPage />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}