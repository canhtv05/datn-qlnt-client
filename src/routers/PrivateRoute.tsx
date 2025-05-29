import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuth: boolean = true;

  return isAuth ? <Outlet /> : <Navigate to={`/login`} replace />;
};

export default PrivateRoute;
