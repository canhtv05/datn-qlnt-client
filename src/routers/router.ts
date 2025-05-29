import configs from "@/configs";
import { lazy } from "react";

/* HOME */
const Home = lazy(() => import("@/pages/home"));

/* AUTH */
const Login = lazy(() => import("@/pages/login"));

const publicRoutes = [
  /* HOME */
  {
    path: configs.routes.home,
    component: Home,
  },
  /* AUTH */
  {
    path: configs.routes.login,
    component: Login,
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
