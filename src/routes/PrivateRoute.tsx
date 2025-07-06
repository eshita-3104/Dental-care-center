// src/routes/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';

interface PrivateRouteProps {
  children: React.ReactElement;
  allowedRoles?: User['role'][];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}