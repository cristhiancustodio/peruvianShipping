import ProtectedRoute from "@/context/ProtectRoute";
import Page404 from "@/view/layout/PageMessages/Page404";
import { LoginForm } from "@/view/Login/Login";

import { createBrowserRouter } from "react-router";
import NotAuthenticated from "@/context/NotAuthenticated";
import Layout from "@/view/layout/Layout";
import Home from "@/view/Home";

export const router = createBrowserRouter([
    {
        path: "/auth",
        element: <NotAuthenticated />,
        children: [
            {
                path: "login",
                element: <LoginForm />,
            }
        ]
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [{
            element: <Layout></Layout>,
            children: [
                {
                    index: true,
                    element: <Home></Home>
                },

            ]
        }]

    },

    {
        path: "*",
        element: <Page404></Page404>
    }
], {
    basename: import.meta.env.VITE_base_url
});
