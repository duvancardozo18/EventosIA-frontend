import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
// Elimina PrivateRoute de react-router-dom porque no existe

// Aquí se define el PrivateRoute provisional
const PrivateRoute = ({ element }) => {
    const isAuthenticated = true; // Simula autenticación temporalmente
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

import Login from "../pages/auth/Login";
import Homepage from "../pages/Homepage";
import VerifyAccount from "../pages/auth/VerifyAccount";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/forgotpassword/ResetPassword";
import ResetPasswordForm from "../pages/forgotpassword/ResetPasswordForm";
import Layout from "./layout";
import CardsView from "../components/screens/events/CardsView";
import GeneralEvent from "../components/screens/events/eventscreate/form/GeneralEvent";
import CreateEvent from "../components/screens/events/eventscreate/CreateEvent";
import LocationEvent from "../components/screens/events/eventscreate/form/LocationEvent";
import ParticipantsEvent from "../components/screens/events/eventscreate/form/ParticipantsEvent";
import FeedingEvent from "../components/screens/events/eventscreate/form/FeedingEvent";
import ResourcesEvent from "../components/screens/events/eventscreate/form/ResourcesEvent";
import EventForm from "../components/screens/events/eventscreate/form/Event"

function AppRouter() {
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
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="inicio" replace />,
                },
                {
                    path: "inicio",
                    element: <h1 className="title">Inicio</h1>,
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
                    path: "events/create-event", // Nueva ruta protegida
                    element: <PrivateRoute element={<CreateEvent />} />, // Usa el provisional
                    children: [
                        { index: true, element: <Navigate to="evento" replace /> },
                        { path: "evento", element: <EventForm /> },
                        { path: "tipoEvento", element: <GeneralEvent /> },
                        { path: "ubicacion", element: <LocationEvent /> },
                        { path: "participantes", element: <ParticipantsEvent /> },
                        { path: "alimentacion", element: <FeedingEvent /> },
                        { path: "recursos", element: <ResourcesEvent /> }
                    ]
                }
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default AppRouter;