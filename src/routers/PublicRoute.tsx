import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const isAuth: boolean = false;

  return isAuth ? <Navigate to={`/`} replace /> : <Outlet />;
};

export default PublicRoute;
