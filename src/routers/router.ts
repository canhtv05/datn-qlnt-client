import { lazy } from "react";

import configs from "@/configs";
import { RouteType } from "@/provider/useAppProvider";

type ModalRoute = Omit<RouteType, "children" | "layout">;

const UpdateProfile = lazy(() => import("@/components/UpdateProfile"));

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
const RoomMembers = lazy(() => import("@/pages/user/members"));
const RoomDetail = lazy(() => import("@/pages/user/room-detail"));

/* DASHBOARD */
const DashBoard = lazy(() => import("@/pages/dashboard"));

/* DATA CATEGORIES*/
const Building = lazy(() => import("@/pages/data-category/building"));
const HistoryBuilding = lazy(() => import("@/pages/data-category/building/HistoryBuilding"));
const SelectBuilding = lazy(() => import("@/components/data-category/building/SelectBuilding"));
const Floor = lazy(() => import("@/pages/data-category/floor"));
const HistoryFloor = lazy(() => import("@/pages/data-category/floor/HistoryFloor"));
const AssetType = lazy(() => import("@/pages/data-category/asset-type"));
const RoomAsset = lazy(() => import("@/pages/data-category/room-assets"));
const Asset = lazy(() => import("@/pages/data-category/asset"));
const HistoryAsset = lazy(() => import("@/pages/data-category/asset/HistoryAsset"));
const Room = lazy(() => import("@/pages/data-category/room"));
const HistoryRoom = lazy(() => import("@/pages/data-category/room/HistoryRoom"));
const Service = lazy(() => import("@/pages/data-category/service"));
const HistoryService = lazy(() => import("@/pages/data-category/service/HistoryService"));
const ServiceRoom = lazy(() => import("@/pages/data-category/service-room"));
const ServiceRoomDetail = lazy(() => import("@/pages/data-category/service-room-detail"));
const RoomAssetDetail = lazy(() => import("@/components/data-category/room-assets/RoomAssetDetail"));

/* CUSTOMER */
const Vehicle = lazy(() => import("@/pages/customer/vehicle"));
const HistoryVehicle = lazy(() => import("@/pages/customer/vehicle/HistoryVehicle"));
const Tenant = lazy(() => import("@/pages/customer/tenant"));
const HistoryTenant = lazy(() => import("@/pages/customer/tenant/HistoryTenant"));
const Contract = lazy(() => import("@/pages/customer/contract"));
const AddContract = lazy(() => import("@/components/customer/contract/AddContract"));
const HistoryContract = lazy(() => import("@/pages/customer/contract/HistoryContract"));
const ContractDetail = lazy(() => import("@/pages/customer/contract/ContractDetailPage"));

/* FINANCE */
const Meter = lazy(() => import("@/pages/finance/meter"));
// const MeterStatistics = lazy(() => import("@/pages/finance/meter/MeterStatistics"));
const MeterReading = lazy(() => import("@/pages/finance/meter-reading"));
const Invoice = lazy(() => import("@/pages/finance/invoice"));
const HistoryInvoice = lazy(() => import("@/pages/finance/invoice/HistoryInvoice"));
const InvoiceDetail = lazy(() => import("@/pages/finance/invoice/invoice-detail/InvoiceDetail"));
const ViewInvoiceDetail = lazy(() => import("@/pages/finance/invoice/invoice-detail/ViewInvoiceDetail"));
const PaymentReceipt = lazy(() => import("@/pages/finance/payment-receipt"));

/* USER ROLE */
const UserRoom = lazy(() => import("@/pages/user/room"));
const UserPaymentReceipt = lazy(() => import("@/pages/user/payment-receipt"));
const UserInvoice = lazy(() => import("@/pages/user/invoice"));
const UserInvoicePayment = lazy(() => import("@/components/finance/invoice/InvoicePayment"));
const PaymentCallbackVnPay = lazy(() => import("@/pages/payment-callback"));

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
  {
    path: configs.routes.updateProfile,
    component: UpdateProfile,
    allowedRoles: ["ADMIN", "MANAGER", "STAFF", "USER"],
  },
  /* DASHBOARD */
  {
    path: configs.routes.dashboard,
    component: DashBoard,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  /* Facilities */
  {
    path: configs.routes.facilities.buildings,
    component: Building,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.buildingsHistory,
    component: HistoryBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.floors,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.floorsHistoryId,
    component: HistoryFloor,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.floorsHistory,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.floorId,
    component: Floor,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.rooms,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.roomsHistory,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.roomsHistoryId,
    component: HistoryRoom,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.facilities.roomId,
    component: Room,
    allowedRoles: ["ADMIN", "MANAGER"],
  },

  /* ASSET MANAGEMENT */
  {
    path: configs.routes.assetMng.assetType,
    component: AssetType,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.assetMng.roomAsset,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.assetMng.asset,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.assetMng.assetHistory,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.assetMng.assetHistoryId,
    component: HistoryAsset,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.assetMng.assetId,
    component: Asset,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.assetMng.roomId,
    component: RoomAsset,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.assetMng.roomAssetDetail,
    component: RoomAssetDetail,
    allowedRoles: ["ADMIN", "MANAGER"],
  },

  /* SERVICE MANAGEMENT */
  {
    path: configs.routes.serviceMng.service,
    component: Service,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.serviceMng.serviceHistory,
    component: HistoryService,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.serviceMng.roomService,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.serviceMng.roomServiceId,
    component: ServiceRoom,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.serviceMng.roomServiceDetail,
    component: ServiceRoomDetail,
    allowedRoles: ["ADMIN", "MANAGER"],
  },

  /* CUSTOMER */
  {
    path: configs.routes.customer.vehicles,
    component: Vehicle,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.customer.vehiclesHistory,
    component: HistoryVehicle,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.customer.tenants,
    component: Tenant,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.customer.tenantsHistory,
    component: HistoryTenant,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.customer.contract,
    component: Contract,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.customer.contractAdd,
    component: AddContract,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.customer.contractHistory,
    component: HistoryContract,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.customer.contractDetail,
    component: ContractDetail,
    allowedRoles: ["ADMIN", "MANAGER"],
  },

  /* FINANCE */
  {
    path: configs.routes.finance.meter,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.finance.meterId,
    component: Meter,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  // {
  //   path: configs.routes.finance.meterStatisticId,
  //   component: MeterStatistics,
  //   allowedRoles: ["ADMIN", "MANAGER"],
  // },
  {
    path: configs.routes.finance.meterReading,
    component: SelectBuilding,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.finance.meterReadingId,
    component: MeterReading,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.finance.invoice,
    component: Invoice,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.finance.invoiceHistory,
    component: HistoryInvoice,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.finance.invoiceId,
    component: InvoiceDetail,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.finance.invoiceViewId,
    component: ViewInvoiceDetail,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.finance.paymentReceipt,
    component: PaymentReceipt,
    allowedRoles: ["ADMIN", "MANAGER"],
  },

  // ROLE USER
  {
    path: configs.routes.user.room,
    component: UserRoom,
    allowedRoles: ["USER"],
  },
  {
    path: configs.routes.user.roomDetail,
    component: RoomDetail,
    allowedRoles: ["USER"],
  },
  {
    path: configs.routes.user.paymentReceipt,
    component: UserPaymentReceipt,
    allowedRoles: ["USER"],
  },
  {
    path: configs.routes.user.viewInvoice,
    component: ViewInvoiceDetail,
    allowedRoles: ["USER"],
  },
  {
    path: configs.routes.user.invoice,
    component: UserInvoice,
    allowedRoles: ["USER"],
  },
  {
    path: configs.routes.user.invoicePayment,
    component: UserInvoicePayment,
    allowedRoles: ["USER"],
  },
  {
    path: configs.routes.user.paymentCallback,
    component: PaymentCallbackVnPay,
    allowedRoles: ["USER"],
    layout: null,
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
    allowedRoles: ["ADMIN", "MANAGER", "STAFF", "USER"],
  },
  {
    path: configs.routes.modals.tenantDetail,
    component: DetailTenant,
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    path: configs.routes.modals.roomMembers,
    component: RoomMembers,
    allowedRoles: ["ADMIN", "MANAGER", "STAFF", "USER"],
  },
];

export { publicRoutes, privateRoutes, modals, unprotectedRoutes };
