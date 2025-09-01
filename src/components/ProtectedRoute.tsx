import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'supplier' | 'buyer' | 'admin';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Check role requirement if specified
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user's actual role
    const redirectPath = user.role === 'supplier' ? '/supplier/dashboard' : '/tenders';
    return (
      <Navigate 
        to={redirectPath}
        replace 
      />
    );
  }

  // User is authenticated and has correct role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;