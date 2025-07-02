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
  },
  customer: {
    vehicles: "/customers/vehicles",
  },
};

export default routes;
