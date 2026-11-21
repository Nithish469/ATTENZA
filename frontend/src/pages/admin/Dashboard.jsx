
import { useEffect, useState } from "react";

import {
  Users,
  ClipboardCheck,
  Clock,
  Search,
  RefreshCw,
  UserRound,
  CalendarDays,
  CheckCircle2,
  UserX,
} from "lucide-react";

import API from "../../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await API.get("/attendance/dashboard");

      setDashboard(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const employees = dashboard?.employees || [];

  const filteredEmployees = employees.filter((employee) =>
    `${employee.employeeId || ""} ${employee.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalEmployees = employees.length;

  const presentCount = employees.filter(
    (employee) => employee.status === "Present"
  ).length;

  const completedCount = employees.filter(
    (employee) => employee.status === "Completed"
  ).length;

  const absentCount = employees.filter(
    (employee) => employee.status === "Absent"
  ).length;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formatTime = (time) => {
    if (!time) return "--";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch ((status || "Absent").toLowerCase()) {
      case "present":
        return "present";

      case "completed":
        return "completed";

      case "absent":
        return "absent";

      default:
        return "absent";
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="att-dashboard-loading">
        <div className="att-loading-spinner" />
        <p>Loading attendance dashboard...</p>
      </div>
    );
  }

  return (
    <div className="att-dashboard">

      {/* Dashboard Header */}
      <header className="att-dashboard-header">
        <div className="att-header-content">
          <span className="att-dashboard-eyebrow">
            ADMINISTRATION OVERVIEW
          </span>

          <h1>Welcome to ATTENZA</h1>

          <p>
            Monitor employee attendance and manage your workforce
            efficiently.
          </p>

          <div className="att-dashboard-date">
            <CalendarDays size={16} />
            <span>{today}</span>
          </div>
        </div>

        <button
          type="button"
          className="att-refresh-button"
          onClick={fetchDashboard}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "att-refresh-spinning" : ""}
          />
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </header>

      {/* Statistics */}
      <section className="att-stats-grid">

        <div className="att-stat-card">
          <div className="att-stat-top">
            <span>Total Employees</span>
            <div className="att-stat-icon employees-icon">
              <Users size={21} />
            </div>
          </div>

          <h2>{totalEmployees}</h2>
          <p>Registered employees</p>
        </div>

        <div className="att-stat-card">
          <div className="att-stat-top">
            <span>Present Today</span>
            <div className="att-stat-icon present-icon">
              <ClipboardCheck size={21} />
            </div>
          </div>

          <h2>{presentCount}</h2>
          <p>Currently present</p>
        </div>

        <div className="att-stat-card">
          <div className="att-stat-top">
            <span>Completed</span>
            <div className="att-stat-icon completed-icon">
              <CheckCircle2 size={21} />
            </div>
          </div>

          <h2>{completedCount}</h2>
          <p>Attendance completed</p>
        </div>

        <div className="att-stat-card">
          <div className="att-stat-top">
            <span>Absent</span>
            <div className="att-stat-icon absent-icon">
              <UserX size={21} />
            </div>
          </div>

          <h2>{absentCount}</h2>
          <p>Not checked in today</p>
        </div>

      </section>

      {/* Attendance Table */}
      <section className="att-table-card">

        <div className="att-table-heading">
          <div>
            <span className="att-table-eyebrow">
              DAILY RECORDS
            </span>

            <h2>Today's Attendance</h2>

            <p>
              View and monitor employee check-in and check-out records.
            </p>
          </div>

          <div className="att-table-count">
            <Users size={16} />
            {filteredEmployees.length} Employees
          </div>
        </div>

        {/* Search */}
        <div className="att-table-toolbar">
          <div className="att-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="att-table-wrapper">
          <table className="att-data-table">
            <thead>
              <tr>
                <th>EMPLOYEE ID</th>
                <th>EMPLOYEE</th>
                <th>STATUS</th>
                <th>CHECK IN</th>
                <th>CHECK OUT</th>
                <th>WORKING HOURS</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.employeeId}>
                    <td>
                      <strong className="att-employee-id">
                        {employee.employeeId}
                      </strong>
                    </td>

                    <td>
                      <div className="att-employee-cell">
                        <div className="att-employee-avatar">
                          {employee.name?.charAt(0).toUpperCase() || (
                            <UserRound size={17} />
                          )}
                        </div>

                        <span>{employee.name || "Unknown Employee"}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`att-status-badge ${getStatusClass(
                          employee.status
                        )}`}
                      >
                        <span className="att-status-dot" />
                        {employee.status || "Absent"}
                      </span>
                    </td>

                    <td>
                      <span className="att-time-value">
                        {formatTime(employee.entryTime)}
                      </span>
                    </td>

                    <td>
                      <span className="att-time-value">
                        {formatTime(employee.exitTime)}
                      </span>
                    </td>

                    <td>
                      <strong className="att-working-hours">
                        {employee.totalHours || "0h 0m"}
                      </strong>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="att-empty-state">
                      <Users size={30} />
                      <strong>No employees found</strong>
                      <span>
                        Try another employee name or ID.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="att-table-footer">
          Showing {filteredEmployees.length} of {totalEmployees} employees
        </div>

      </section>

      {/* Footer note */}
      <div className="att-dashboard-footer">
        <ShieldCheckIcon />
        <span>
          ATTENZA – Secure Employee Attendance Management System
        </span>
      </div>

    </div>
  );
}

function ShieldCheckIcon() {
  return <CheckCircle2 size={16} />;
}

export default Dashboard;
