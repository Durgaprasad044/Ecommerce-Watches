import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleRoute({ role }) {

  // ⭐ get role from localStorage (your current system)
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/auth/login" replace />;
  }

  if (userRole !== role) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}