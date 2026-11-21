
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";

import EmployeeScan from "./pages/attendance/EmployeeScan";
import CheckIn from "./pages/attendance/CheckIn";

import Dashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import Attendance from "./pages/admin/Attendance";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Holidays from "./pages/admin/Holidays";

import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";

import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import MyAttendance from "./pages/employee/MyAttendance";

import PublicHome from "./pages/public/PublicHome";

import "./App.css";

// Get employee information
function getEmployeeInfo() {
  try {
    return JSON.parse(
      sessionStorage.getItem("employeeUser") || "null"
    );
  } catch {
    return null;
  }
}

// Get initial page from URL
function getInitialView() {
  const path = window.location.pathname;

  // Public routes
  if (path === "/") return "home";

  if (path === "/employee/login") {
    return "employee-login";
  }

  if (path === "/admin/login") {
    return "admin-login";
  }

  if (path === "/check-in") {
    return "check-in";
  }

  // Admin dashboard
  if (path === "/admin/dashboard") {
    return sessionStorage.getItem("adminToken")
      ? "admin"
      : "admin-login";
  }

  // Employee dashboard
  if (path === "/employee/dashboard") {
    return (
      sessionStorage.getItem("employeeToken") &&
      getEmployeeInfo()
    )
      ? "employee"
      : "employee-login";
  }

  return "home";
}

// Admin application
function AdminApp({ onLogout }) {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;

      case "employees":
        return <Employees />;

      case "attendance":
        return <Attendance />;

      case "holidays":
        return <Holidays />;

      case "reports":
        return <Reports />;

      case "settings":
        return <Settings />;

      case "employee-scan":
        return <EmployeeScan />;

      case "employee-attendance":
        return <EmployeeAttendance />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={onLogout}
      />

      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  const [view, setView] = useState(getInitialView);
  const [employee, setEmployee] = useState(getEmployeeInfo);

  // Navigate between pages
  const navigate = (path, nextView, replace = false) => {
    if (replace) {
      window.history.replaceState({}, "", path);
    } else {
      window.history.pushState({}, "", path);
    }

    setView(nextView);
  };

  // Admin return to public homepage
  const goAdminHome = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");

    window.history.replaceState({}, "", "/");
    setView("home");
  };

  // Employee return to employee login page
  const goEmployeeLogin = () => {
    sessionStorage.removeItem("employeeToken");
    sessionStorage.removeItem("employeeUser");

    setEmployee(null);

    window.history.replaceState(
      {},
      "",
      "/employee/login"
    );

    setView("employee-login");
  };

  // Admin logout
  const handleAdminLogout = () => {
    goAdminHome();
  };

  // Employee login success
  const handleEmployeeLogin = (employeeInfo) => {
    setEmployee(employeeInfo);

    navigate(
      "/employee/dashboard",
      "employee",
      true
    );
  };

  // Employee logout
  const handleEmployeeLogout = () => {
    goEmployeeLogin();
  };

  // Browser back and forward support
  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
      setEmployee(getEmployeeInfo());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  // QR check-in page
  if (view === "check-in") {
    return <CheckIn />;
  }

  // Admin dashboard
  if (view === "admin") {
    if (!sessionStorage.getItem("adminToken")) {
      return (
        <AdminLogin
          onLogin={() =>
            navigate(
              "/admin/dashboard",
              "admin",
              true
            )
          }
          onBack={goAdminHome}
        />
      );
    }

    return (
      <AdminApp
        onLogout={handleAdminLogout}
      />
    );
  }

  // Admin login
  if (view === "admin-login") {
    return (
      <AdminLogin
        onLogin={() =>
          navigate(
            "/admin/dashboard",
            "admin",
            true
          )
        }
        onBack={goAdminHome}
      />
    );
  }

  // Employee login
  if (view === "employee-login") {
    return (
      <EmployeeLogin
        onLogin={handleEmployeeLogin}
        onBack={goEmployeeLogin}
      />
    );
  }

  // Employee dashboard
  if (view === "employee") {
    if (
      !sessionStorage.getItem("employeeToken") ||
      !employee
    ) {
      return (
        <EmployeeLogin
          onLogin={handleEmployeeLogin}
          onBack={goEmployeeLogin}
        />
      );
    }

    return (
      <MyAttendance
        employee={employee}
        onLogout={handleEmployeeLogout}
      />
    );
  }

  // Public homepage
  return (
    <PublicHome
      onAdminLogin={() =>
        navigate(
          "/admin/login",
          "admin-login"
        )
      }
      onEmployeeLogin={() =>
        navigate(
          "/employee/login",
          "employee-login"
        )
      }
    />
  );
}

export default App;
