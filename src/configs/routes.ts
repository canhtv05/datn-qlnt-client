const routes = {
  home: {
    home: "/",
    features: "/features",
    services: "/services",
    contact: "/contact",
    policy: "/policy",
  },
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    register: "/register",
    authenticate: "/authenticate",
  },
  modals: {
    profile: "/profile",
    tenantDetail: "/customers/tenants/:id",
    roomMembers: "/room/members/:id",
  },
  dashboard: "/dashboard",
  facilities: {
    buildings: "/facilities/buildings",
    floors: "/facilities/floors",
    floorId: "/facilities/floors/:id",
    rooms: "/facilities/rooms",
    roomId: "/facilities/rooms/:id",
  },
  assetMng: {
    assetType: "/asset-management/asset-types",
    asset: "/asset-management/assets",
  },
  serviceMng: {
    roomService: "/service-management/room-services",
    service: "/service-management/services",
  },
  customer: {
    vehicles: "/customers/vehicles",
    tenants: "/customers/tenants",
    contract: "/customers/contracts",
    contractDetail: "/customers/contracts/:contractId",
  },
  finance: {
    meter: "/finance/meters",
    meterId: "/finance/meters/:id",
    meterStatisticId: "/finance/meters/statistics/:id",
    meterReading: "/finance/meter-reading",
    meterReadingId: "/finance/meter-reading/:id",
    invoice: "/finance/invoice",
    paymentReceipt: "/finance/payment-receipt",
    invoiceId: "/finance/invoice/:id",
    invoiceViewId: "/finance/invoice/view/:id",
  },
  user: {
    room: "/room",
    roomDetail: "/room/detail/:id",
    invoice: "/invoices",
    paymentReceipt: "/payment-receipts",
    viewInvoice: "/invoices/view/:id",
  },
};

export default routes;
