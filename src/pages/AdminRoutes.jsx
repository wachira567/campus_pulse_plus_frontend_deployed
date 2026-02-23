import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export function ProtectedRoute({ children, adminOnly = false }) {
 const { user, loading } = useContext(AuthContext);
 if (loading) return <p>Loading...</p>;
 if (!user) return <Navigate to="/" replace />;
 if (adminOnly && user.role !== "admin")
   return <Navigate to="/home" replace />;
 return children;
}
