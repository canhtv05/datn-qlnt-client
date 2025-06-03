import { lazy } from "react";

import configs from "@/configs";

/* HOME */
const Home = lazy(() => import("@/pages/home"));

/* AUTH */
const Login = lazy(() => import("@/pages/login"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const Register = lazy(() => import("@/pages/register"));
const Authenticate = lazy(() => import("@/pages/authenticate"));

/* AUTH LAYOUT */
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));

const publicRoutes = [
  /* HOME */
  {
    path: configs.routes.home,
    component: Home,
  },
  /* AUTH */
  {
    path: configs.routes.auth.login,
    component: Login,
    layout: AuthLayout,
  },
  {
    path: configs.routes.auth.forgotPassword,
    component: ForgotPassword,
    layout: AuthLayout,
  },
  {
    path: configs.routes.auth.register,
    component: Register,
    layout: AuthLayout,
  },
  {
    path: configs.routes.auth.authenticate,
    component: Authenticate,
    layout: null,
  },
];

const privateRoutes = [
  {
    path: configs.routes.home,
    component: Home,
  },
];

const modals = [
  {
    path: configs.routes.home,
    component: Home,
  },
];

export { publicRoutes, privateRoutes, modals };
