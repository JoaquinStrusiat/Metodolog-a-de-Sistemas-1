import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Header from "./components/header";
import Landing from "./pages/Landing";
import Login from "./pages/Login/login";
import Register from "./pages/Register/Register";
import ServiceType from "./pages/servicesType/servicesType";
import Reserva from "./pages/Reserva/Reserva";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      {/* Futuro Footer */}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/serviceType/:name",
        element: <ServiceType />,
      },
      {
        path: "/reserva/:categoryId/:serviceId",
        element: <Reserva />,
      },
      {
        path: "/reserva",
        element: <Reserva />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
