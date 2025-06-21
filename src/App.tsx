import { Route, Routes } from "react-router-dom";

import PublicRoute from "./routers/PublicRoute";
import PrivateRoute from "./routers/PrivateRoute";
import { modals, privateRoutes, publicRoutes } from "./routers/router";
import { useAppProvider } from "./provider/useAppProvider";
import AppProvider from "./provider";

function App() {
  const { background, loadModalRoute, loadRoute, location } = useAppProvider();

  return (
    <AppProvider>
      <Routes location={background || location}>
        <Route element={<PublicRoute />}>{publicRoutes.map(loadRoute)}</Route>
        <Route element={<PrivateRoute />}>{privateRoutes.map(loadRoute)}</Route>
      </Routes>
      {background && (
        <Routes>
          <Route element={<PrivateRoute />}>{modals.map(loadModalRoute)}</Route>
        </Routes>
      )}
    </AppProvider>
  );
}

export default App;
