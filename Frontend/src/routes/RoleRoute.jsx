import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RoleRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" />;

  if (user.role !== role) return <Navigate to="/home" />;

  return children;
}