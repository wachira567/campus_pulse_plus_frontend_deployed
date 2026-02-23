import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomeFeed from "./pages/HomeFeed";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./components/posts/PostDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import PostManager from "./pages/PostManager";
import CategoryManager from "./pages/CategoryManager";
import SystemSettings from "./pages/SystemSettings";
import UserManagement from "./pages/UserManagement";
import StreetwiseReports from "./pages/StreetwiseReports";
import Streetwise from "./pages/Streetwise";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";

// User Navbar
function UserNavbar() {
  const { user } = React.useContext(AuthContext);
  if (!user) return null;
  return <Navbar />;
}

// Protected Route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== "admin")
    return <Navigate to="/home" replace />;

  return children;
}

// Public route (login/signup)
function PublicRoute({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <p className="p-4">Loading...</p>;
  if (user)
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/home"}
        replace
      />
    );
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <UserNavbar />
        <Toaster />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Student */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomeFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly={true}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute adminOnly={true}>
                <PostManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute adminOnly={true}>
                <CategoryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly={true}>
                <SystemSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/streetwise-reports"
            element={
              <ProtectedRoute adminOnly={true}>
                <StreetwiseReports />
              </ProtectedRoute>
            }
          />

          {/* Streetwise */}
          <Route
            path="/streetwise"
            element={
              <ProtectedRoute>
                <Streetwise />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
