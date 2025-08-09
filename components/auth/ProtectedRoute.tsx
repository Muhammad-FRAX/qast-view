
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // User not authenticated
    return <Navigate to="/login" replace />;
  }

  if (currentUser.requiresPasswordChange) {
    // User must change password
    return <Navigate to="/change-password" replace />;
  }
  
  // User is authenticated and doesn't need to change password
  return children;
};

export default ProtectedRoute;