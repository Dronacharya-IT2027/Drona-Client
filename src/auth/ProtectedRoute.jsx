import React, { useContext, useEffect } from "react";
import AuthContext from "./authContext"; // default import
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    console.log("[ProtectedRoute] state:", { loading, user });
  }, [loading, user]);

  if (loading) {
    // AuthProvider shows Loader globally, so this will rarely show.
    return null;
  }

  if (!user) {
    console.log("ProtectedRoute: no user, redirecting to signup");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: user authenticated:", user);
  return children;
};

export default ProtectedRoute;
