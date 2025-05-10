import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
  } from "react-router-dom";
  import { AuthProvider } from "../config/AuthProvider";
  import PrivateRoute from "../config/PrivateRoute";
  
  import Layout from "./layout";

  //Paginas
  import Login from "../pages/auth/Login";
  import Homepage from "../pages/Homepage";
  import VerifyAccount from "../pages/auth/VerifyAccount"
  import VerificationSuccess from "../pages/auth/VerificationSuccess"
  import VerificationRedirect from "../pages/auth/VerificationRedirect"
  import Register from "../pages/auth/Register";
  import ResetPassword from "../pages/forgotpassword/ResetPassword";
  import ResetPasswordForm from "../pages/forgotpassword/ResetPasswordForm";
  //import ParticipantsEvent from "../components/screens/events/eventscreate/form/ParticipantsEvent";
  //import FeedingEvent from "../components/screens/events/eventscreate/form/FeedingEvent";

  import CardsView from "../screens/events/CardsView";
  import Event from "../screens/events/createEvent/tabs/Event";
  import TypeEvent from "../screens/events/createEvent/tabs/TypeEvent";
  import LocationEvent from "../screens/events/createEvent/tabs/LocationEvent";
  import CreateEvent from "../screens/events/createEvent/CreateEvent";


  //Paginas Dashboard
  import HomeDashboard from "../pages/dashboard/home";
  import Reports from "../pages/dashboard/Reports";
  import NotificationsPage from "../pages/notifications/NotificationsPage";
  import EventDetail from "../pages/events/EventDetail";
  import EventBilling from "../pages/billing/EventBilling";
  
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
      path: "/verify-email/:token",
      element: <VerifyAccount />,
    },
    {
      path: "/verification-success",
      element: <VerificationSuccess />,
    },
    {
      path: "/verification-redirect",
      element: <VerificationRedirect />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/reset-password-form/:token",
      element: <ResetPasswordForm />,
    },
    {
      path: "/notifications",
      element: <PrivateRoute element={<NotificationsPage />} />,
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
          element: <PrivateRoute element={<Reports />} />,
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
            { path: "evento", element: <Event /> },
            { path: "tipoEvento", element: <TypeEvent /> },
            { path: "ubicacion", element: <LocationEvent /> },
            //{ path: "participantes", element: <ParticipantsEvent /> },
            //{ path: "alimentacion", element: <FeedingEvent /> },
            //{ path: "recursos", element: <ResourcesEvent /> },
          ],

        },
        {
          path: "events/detail-events/:id",
          element: <PrivateRoute element={<EventDetail />} />,

        },
        {
          
          path: "events/billing-event/:id",
          element: <PrivateRoute element={<EventBilling />} />,

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
  