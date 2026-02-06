import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OwnerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!user || user.role !== "rOwner") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OwnerRoute;
