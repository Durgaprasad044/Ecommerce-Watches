import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ children, role }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth/login" />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/home" />;
  }

  return children;
}