import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Component Imports
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import MembersPage from "./components/MembersPage";
import NewLoanPage from "./components/NewLoanPage";
import LoanDetails from "./components/LoanDetails";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./ProtectedRoute"; // We assume this component redirects to /login if no token

/**
 * Main application layout for authenticated users.
 * Renders the Navbar and the main content area.
 * The <Outlet /> renders the specific page (e.g., Dashboard).
 */
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

/**
 * Layout for authentication pages (Login, Register).
 * Wraps content in the 'auth-page-wrapper' for centering,
 * as defined in the new styles.css.
 */
const AuthLayout = () => {
  return (
    <div className="auth-page-wrapper">
      <Outlet />
    </div>
  );
};

export default function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public routes (Login, Register) use the AuthLayout.
          These are accessible to everyone.
        */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes (Dashboard, etc.) use the MainLayout.
          The <ProtectedRoute> component wraps <MainLayout />.
          - If logged in: it renders MainLayout (which shows Navbar + Page).
          - If not logged in: it redirects to "/login".
        */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/new-loan" element={<NewLoanPage />} />
          <Route path="/loans/:id" element={<LoanDetails />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Default route:
          Redirect to /dashboard. The ProtectedRoute will automatically
          handle redirecting to /login if the user isn't authenticated.
        */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Fallback route:
          Redirect any unknown paths to the dashboard.
        */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}




