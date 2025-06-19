import { lazy } from "react";

import configs from "@/configs";

/* HOME */
const Home = lazy(() => import("@/pages/home"));
const TinhNangPage = lazy(() => import("@/components/home/Features"));
const ServicesPage = lazy(() => import("@/components/home/service"));
const ContactPage = lazy(() => import("@/components/home/Contact"));
/* AUTH */
const Login = lazy(() => import("@/pages/login"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const Register = lazy(() => import("@/pages/register"));
const Authenticate = lazy(() => import("@/pages/authenticate"));

/* AUTH LAYOUT */
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));

/* MODALS */
const Profile = lazy(() => import("@/pages/profile"));


const publicRoutes = [
  /* ✅ HOME là public */
  {
    path: configs.routes.home, 
    component: Home,
    layout: null, 
  },
  {
    path: configs.routes.features, 
    component: TinhNangPage,
    layout: null, // hoặc layout riêng nếu muốn
  },
  {
    path: configs.routes.services,
    component: ServicesPage,
    layout: null,
  },
  {
    path: configs.routes.contact,
    component: ContactPage,
    layout: null,
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

const privateRoutes = [];

const modals = [
  {
    path: configs.routes.modals.profile,
    component: Profile,
  },
];

export { publicRoutes, privateRoutes, modals };
