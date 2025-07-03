import { lazy } from "react";

import configs from "@/configs";
import { RouteType } from "@/provider/useAppProvider";

type ModalRoute = Omit<RouteType, "children" | "layout">;

/* HOME */
const Home = lazy(() => import("@/pages/home"));
const FeaturesPage = lazy(() => import("@/components/home/Features"));
const ServicesPage = lazy(() => import("@/components/home/service"));
const ContactPage = lazy(() => import("@/components/home/Contact"));
const PolicyPage = lazy(() => import("@/components/home/policy"));
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
const SelectBuilding = lazy(() => import("@/components/data-category/building/SelectBuilding"));
const Floor = lazy(() => import("@/pages/data-category/floor"));
const AssetType = lazy(() => import("@/pages/data-category/asset-type"));
const Asset = lazy(() => import("@/pages/data-category/asset"));
const Room = lazy(() => import("@/pages/data-category/room"));

/* CUSTOMER */
const Vehicle = lazy(() => import("@/pages/customer/vehicle"));
const Tenant = lazy(() => import("@/pages/customer/tenant"));

const publicRoutes: RouteType[] = [
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
  {
    path: configs.routes.dataCategories.floors,
    component: SelectBuilding,
  },
  {
    path: configs.routes.dataCategories.floorId,
    component: Floor,
  },
  {
    path: configs.routes.dataCategories.assetType,
    component: AssetType,
  },
  {
    path: configs.routes.dataCategories.rooms,
    component: SelectBuilding,
  },
  {
    path: configs.routes.dataCategories.roomId,
    component: Room,
  },
  {
    path: configs.routes.dataCategories.roomAsset,
    component: Asset,
  },

  /* CUSTOMER */
  {
    path: configs.routes.customer.vehicles,
    component: Vehicle,
  },
  {
    path: configs.routes.customer.tenants,
    component: Tenant,
  },
];

const unprotectedRoutes: RouteType[] = [
  /*HOME là public */
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
  {
    path: configs.routes.home.policy,
    component: PolicyPage,
    layout: null,
  },
];

const modals: ModalRoute[] = [
  {
    path: configs.routes.modals.profile,
    component: Profile,
  },
];

export { publicRoutes, privateRoutes, modals, unprotectedRoutes };
