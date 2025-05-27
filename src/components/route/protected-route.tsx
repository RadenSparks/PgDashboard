import { isAuthenticated } from '../../utils/auth';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children } : { children: JSX.Element }) => {
  const auth = isAuthenticated();
  return auth ? children : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;