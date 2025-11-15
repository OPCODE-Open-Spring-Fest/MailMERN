import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ClipLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <ClipLoader size={50} color="#06b6d4" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;

