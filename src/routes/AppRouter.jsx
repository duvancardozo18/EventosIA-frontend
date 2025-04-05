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
import CardsView from "../screens/events/CardsView";
import Event from "../screens/events/createEvent/tabs/Event";
import TypeEvent from "../screens/events/createEvent/tabs/TypeEvent";
import LocationEvent from "../screens/events/createEvent/tabs/LocationEvent";
import CreateEvent from "../screens/events/createEvent/CreateEvent";

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
                        { path: "evento", element: <Event /> },
                        { path: "tipoEvento", element: <TypeEvent /> },
                        { path: "ubicacion", element: <LocationEvent /> }
                    ]
                }
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default AppRouter;