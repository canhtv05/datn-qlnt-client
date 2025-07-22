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
const DetailTenant = lazy(() => import("@/pages/customer/tenant/DetailTenant"));

/* DASHBOARD */
const DashBoard = lazy(() => import("@/pages/dashboard"));

/* DATA CATEGORIES*/
const Building = lazy(() => import("@/pages/data-category/building"));
const SelectBuilding = lazy(() => import("@/components/data-category/building/SelectBuilding"));
const Floor = lazy(() => import("@/pages/data-category/floor"));
const AssetType = lazy(() => import("@/pages/data-category/asset-type"));
const Asset = lazy(() => import("@/pages/data-category/asset"));
const Room = lazy(() => import("@/pages/data-category/room"));
const Service = lazy(() => import("@/pages/data-category/service"));
const DefaultService = lazy(() => import("@/pages/data-category/default-service"));
const ServiceRoom = lazy(() => import("@/pages/data-category/service-room"));

/* CUSTOMER */
const Vehicle = lazy(() => import("@/pages/customer/vehicle"));
const Tenant = lazy(() => import("@/pages/customer/tenant"));
const Contract = lazy(() => import("@/pages/customer/contract"));
const ContractDetail = lazy(() => import("@/pages/customer/contract/ContractDetailPage"));

/* FINANCE */
const Meter = lazy(() => import("@/pages/finance/meter"));
const MeterStatistics = lazy(() => import("@/pages/finance/meter/MeterStatistics"));
const MeterReading = lazy(() => import("@/pages/finance/meter-reading"));
const Invoice = lazy(() => import("@/pages/finance/invoice"));
const InvoiceDetail = lazy(() => import("@/pages/finance/invoice/InvoiceDetail"));

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
  {
    path: configs.routes.dataCategories.service,
    component: Service,
  },
  {
    path: configs.routes.dataCategories.defaultService,
    component: DefaultService,
  },
  {
    path: configs.routes.dataCategories.roomService,
    component: ServiceRoom,
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
  {
    path: configs.routes.customer.contract,
    component: Contract,
  },
  {
    path: configs.routes.customer.contractDetail,
    component: ContractDetail,
  },

  /* FINANCE */
  {
    path: configs.routes.finance.meter,
    component: SelectBuilding,
  },
  {
    path: configs.routes.finance.meterId,
    component: Meter,
  },
  {
    path: configs.routes.finance.meterStatisticId,
    component: MeterStatistics,
  },
  {
    path: configs.routes.finance.meterReading,
    component: SelectBuilding,
  },
  {
    path: configs.routes.finance.meterReadingId,
    component: MeterReading,
  },
  {
    path: configs.routes.finance.invoice,
    component: Invoice,
  },
  {
    path: configs.routes.finance.invoiceId,
    component: InvoiceDetail,
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
  {
    path: configs.routes.modals.tenantDetail,
    component: DetailTenant,
  },
];

export { publicRoutes, privateRoutes, modals, unprotectedRoutes };
