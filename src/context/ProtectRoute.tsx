import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hook/useAuth";
import LoadingPage from "@/view/layout/PageMessages/LoadingPage";



const ProtectedRoute = () => {
    
    const { isLoading, isAuthenticated } = useAuth();

    // Si todavía está cargando, mostramos un indicador de carga
    if (isLoading) {
        return <LoadingPage />;
    }

    // Si no hay usuario autenticado, redirigimos al login
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
        // Si hay un usuario autenticado y la ruta es /login, redirigimos a la ruta guardada
    }

    return <Outlet></Outlet>;
};

export default ProtectedRoute;