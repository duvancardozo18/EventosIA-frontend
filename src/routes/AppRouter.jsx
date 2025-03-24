import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
  } from "react-router-dom";
  import { AuthProvider } from "../config/AuthProvider";
  import PrivateRoute from "../config/PrivateRoute";
  
  import Layout from "./layout";
  import CardsView from "../components/screens/events/CardsView";
  import GeneralEvent from "../components/screens/events/eventscreate/form/GeneralEvent";
  import CreateEvent from "../components/screens/events/eventscreate/CreateEvent";
  import LocationEvent from "../components/screens/events/eventscreate/form/LocationEvent";
  import ParticipantsEvent from "../components/screens/events/eventscreate/form/ParticipantsEvent";
  import FeedingEvent from "../components/screens/events/eventscreate/form/FeedingEvent";
  import ResourcesEvent from "../components/screens/events/eventscreate/form/ResourcesEvent";
  import EventForm from "../components/screens/events/eventscreate/form/Event";

  //Paginas
  import Login from "../pages/auth/Login";
  import Homepage from "../pages/Homepage";
  import VerifyAccount from "../pages/auth/VerifyAccount";
  import Register from "../pages/auth/Register";
  import ResetPassword from "../pages/forgotpassword/ResetPassword";
  import ResetPasswordForm from "../pages/forgotpassword/ResetPasswordForm";

  //Paginas Dashboard
  import HomeDashboard from "../pages/dashboard/home";
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
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
      path: "/verify-account",
      element: <VerifyAccount />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/reset-password-form",
      element: <ResetPasswordForm />,
    },
    {
      path: "/dashboard",
      element: <PrivateRoute element={<Layout />} />,
      children: [
        {
          index: true,
          element: <Navigate to="inicio" replace />,
        },
        {
          path: "inicio",
          element: <HomeDashboard />,
        },
        {
          path: "events",
          element: <CardsView />,
        },
        {
          path: "reports",
          element: <h1 className="title">Reportes</h1>,
        },
        {
          path: "help",
          element: <h1 className="title">Ayuda</h1>,
        },
        {
          path: "events/create-event",
          element: <PrivateRoute element={<CreateEvent />} />,
          children: [
            { index: true, element: <Navigate to="evento" replace /> },
            { path: "evento", element: <EventForm /> },
            { path: "tipoEvento", element: <GeneralEvent /> },
            { path: "ubicacion", element: <LocationEvent /> },
            { path: "participantes", element: <ParticipantsEvent /> },
            { path: "alimentacion", element: <FeedingEvent /> },
            { path: "recursos", element: <ResourcesEvent /> },
          ],
        },
      ],
    },
  ]);
  
  function AppRouter() {
    return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    );
  }
  
  export default AppRouter;
  