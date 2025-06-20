import { lazy } from "react";

import configs from "@/configs";
import { RouteType } from "@/provider/useAppProvider";

type ModalRoute = Omit<RouteType, "children" | "layout">;

/* HOME */
const Home = lazy(() => import("@/pages/home"));
const FeaturesPage = lazy(() => import("@/components/home/Features"));
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

/* DASHBOARD */
const DashBoard = lazy(() => import("@/pages/dashboard"));

/* DATA CATEGORIES*/
const Building = lazy(() => import("@/pages/data-category/building"));

const publicRoutes: RouteType[] = [
  /* ✅ HOME là public */
  {
    path: configs.routes.home.home, 
    component: Home,
    layout: null, 
  },
  {
    path: configs.routes.home.features, 
    component: FeaturesPage,
    layout: null,
  },
  {
    path: configs.routes.home.services,
    component: ServicesPage,
    layout: null,
  },
  {
    path: configs.routes.home.contact,
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

const privateRoutes: RouteType[] = [
  /* DASHBOARD */
  {
    path: configs.routes.dashboard,
    component: DashBoard,
  },
  /* DATA CATEGORIES */
  {
    path: configs.routes.dataCategories.buildings,
    component: Building,
  },
];

const modals: ModalRoute[] = [
  {
    path: configs.routes.modals.profile,
    component: Profile,
  },
];

export { publicRoutes, privateRoutes, modals };
