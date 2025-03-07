import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Homepage from "../pages/Homepage";
import VerifyAccount from "../pages/auth/VerifyAccount";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/forgotpassword/ResetPassword";
import ResetPasswordForm from "../pages/forgotpassword/ResetPasswordForm";
import Layout from "./layout";

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
            path: "/eventDashboard",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: (
                        <Navigate
                            to="inicio"
                            replace
                        />
                    ),
                },
                {
                    path: "inicio",
                    element: <h1 className="title">Inicio</h1>,
                },
                {
                    path: "events",
                    element: <h1 className="title">Eventos</h1>,
                },
                {
                    path: "reports",
                    element: <h1 className="title">Reportes</h1>,
                },
                {
                    path: "help",
                    element: <h1 className="title">Ayuda</h1>,
                },
            ],
        },
    ]);
    return <RouterProvider router={router} />;
}

export default AppRouter;
