import useAuth from "@/hook/useAuth";
import LoadingPage from "@/view/layout/PageMessages/LoadingPage";
import { Navigate, Outlet } from "react-router";



export default function NotAuthenticated() {
    
    const { isLoading, isAuthenticated } = useAuth();
    if (isLoading) {
        return <LoadingPage />;
    }
    if (isAuthenticated === true) {
        return <Navigate to="/"></Navigate>
    }
    return <Outlet></Outlet>;
}