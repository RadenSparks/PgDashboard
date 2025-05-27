import { isAuthenticated } from '../../utils/auth';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children } : { children: JSX.Element }) => {
  const auth = isAuthenticated();
  return !auth ? children : <Navigate to="/" replace />;
}

export default PublicRoute;