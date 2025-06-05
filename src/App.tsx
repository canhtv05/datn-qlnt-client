import { Route, Routes } from "react-router-dom";

import PublicRoute from "./routers/PublicRoute";
import PrivateRoute from "./routers/PrivateRoute";
import { modals, privateRoutes, publicRoutes } from "./routers/router";
import RenderIf from "./components/RenderIf";
import LoadingPage from "./components/LoadingPage";
import { useAppProvider } from "./provider/useAppProvider";
import AppProvider from "./provider";

function App() {
  const { background, isLoading, loadModalRoute, loadRoute, location } = useAppProvider();

  return (
    <AppProvider>
      <RenderIf value={!isLoading}>
        <Routes location={background || location}>
          <Route element={<PublicRoute />}>{publicRoutes.map(loadRoute)}</Route>
          <Route element={<PrivateRoute />}>{privateRoutes.map(loadRoute)}</Route>
        </Routes>
        {background && (
          <Routes>
            <Route element={<PrivateRoute />}>{modals.map(loadModalRoute)}</Route>
          </Routes>
        )}
      </RenderIf>
      <RenderIf value={isLoading}>
        <LoadingPage />
      </RenderIf>
    </AppProvider>
  );
}

export default App;
