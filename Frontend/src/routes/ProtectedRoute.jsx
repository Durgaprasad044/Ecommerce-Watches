import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/layout/PageWrapper";
import Spinner from "../components/common/Spinner";

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <PageWrapper className="flex justify-center items-center h-screen">
        <Spinner className="mt-20" />
      </PageWrapper>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}