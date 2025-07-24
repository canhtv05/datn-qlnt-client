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
  },
  dashboard: "/dashboard",
  dataCategories: {
    buildings: "/data-categories/buildings",
    floors: "/data-categories/floors",
    floorId: "/data-categories/floors/:id",
    assetType: "/data-categories/asset-types",
    rooms: "/data-categories/rooms",
    roomId: "/data-categories/rooms/:id",
    roomAsset: "/data-categories/assets",
    defaultService: "/data-categories/default-services",
    service: "/data-categories/services",
    roomService: "/data-categories/room-services",
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
    invoiceId: "/finance/invoice/:id",
  },
  user: {
    room: "/room",
  },
};

export default routes;
