import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;