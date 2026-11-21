
import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  X,
  UserPlus,
  Pencil,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import API from "../../services/api";

const STATUS_OPTIONS = [
  "ACTIVE",
  "LEAVE (ML)",
  "RESIGNED",
  "TERMINATED",
];

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    pin: "",
    status: "ACTIVE",
  });

  const [editForm, setEditForm] = useState({
    employeeId: "",
    name: "",
    pin: "",
    status: "ACTIVE",
  });

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await API.get("/employees");

      setEmployees(response.data.employees || response.data);
    } catch (error) {
      console.error("Employees error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ADD EMPLOYEE
  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (
      !form.employeeId.trim() ||
      !form.name.trim() ||
      !form.pin
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!/^\d{4}$/.test(form.pin)) {
      alert("PIN must be exactly 4 digits");
      return;
    }

    try {
      await API.post("/employees", {
        employeeId: form.employeeId.trim(),
        name: form.name.trim(),
        pin: form.pin,
        status: form.status,
      });

      alert("Employee added successfully");

      setForm({
        employeeId: "",
        name: "",
        pin: "",
        status: "ACTIVE",
      });

      setShowAddEmployee(false);
      await fetchEmployees();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add employee"
      );
    }
  };

  // OPEN EDIT FORM
  const openEditEmployee = (employee) => {
    setEditingEmployee(employee);

    setEditForm({
      employeeId: employee.employeeId || "",
      name: employee.name || "",
      pin: "",
      status: STATUS_OPTIONS.includes(employee.status)
        ? employee.status
        : "ACTIVE",
    });
  };

  // UPDATE EMPLOYEE
  const handleEditEmployee = async (e) => {
    e.preventDefault();

    if (
      !editForm.employeeId.trim() ||
      !editForm.name.trim()
    ) {
      alert("Employee ID and name are required");
      return;
    }

    if (
      editForm.pin &&
      !/^\d{4}$/.test(editForm.pin)
    ) {
      alert("PIN must be exactly 4 digits");
      return;
    }

    try {
      await API.put(
        `/employees/${editingEmployee.id}`,
        {
          employeeId: editForm.employeeId.trim(),
          name: editForm.name.trim(),
          pin: editForm.pin,
          status: editForm.status,
        }
      );

      alert("Employee updated successfully");
      setEditingEmployee(null);
      await fetchEmployees();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update employee"
      );
    }
  };

  // STATUS DROPDOWN
  const renderStatusSelect = (value, onChange) => (
    <select
      className="emp-form-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );

  // SEARCH
  const filteredEmployees = employees.filter((employee) =>
    `${employee.employeeId || ""} ${employee.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // COUNTS
  const activeCount = employees.filter(
    (employee) =>
      (employee.status || "ACTIVE") === "ACTIVE" &&
      employee.isActive !== false
  ).length;

  const leaveCount = employees.filter(
    (employee) => employee.status === "LEAVE (ML)"
  ).length;

  const inactiveCount = employees.filter(
    (employee) =>
      ["RESIGNED", "TERMINATED"].includes(employee.status) ||
      employee.isActive === false
  ).length;

  const getEmployeeStatus = (employee) => {
    if (STATUS_OPTIONS.includes(employee.status)) {
      return employee.status;
    }

    return employee.isActive === false
      ? "TERMINATED"
      : "ACTIVE";
  };

  return (
    <div className="emp-page">

      {/* PAGE HEADER */}
      <header className="emp-page-header">
        <div>
          <span className="emp-eyebrow">
            WORKFORCE MANAGEMENT
          </span>

          <h1>Employees</h1>

          <p>
            Manage employee profiles and account information.
          </p>
        </div>

        <div className="emp-header-actions">
          <button
            type="button"
            className="emp-refresh-btn"
            onClick={fetchEmployees}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "emp-spinning" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            className="emp-add-btn"
            onClick={() => setShowAddEmployee(true)}
          >
            <Plus size={19} />
            Add Employee
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="emp-summary-grid">

        <div className="emp-summary-card">
          <div className="emp-summary-top">
            <span>Total Employees</span>
            <div className="emp-summary-icon total">
              <Users size={21} />
            </div>
          </div>
          <h2>{employees.length}</h2>
          <p>Registered employee accounts</p>
        </div>

        <div className="emp-summary-card">
          <div className="emp-summary-top">
            <span>Active Employees</span>
            <div className="emp-summary-icon active">
              <UserCheck size={21} />
            </div>
          </div>
          <h2>{activeCount}</h2>
          <p>Currently active accounts</p>
        </div>

        <div className="emp-summary-card">
          <div className="emp-summary-top">
            <span>On Leave</span>
            <div className="emp-summary-icon leave">
              <CalendarDays size={21} />
            </div>
          </div>
          <h2>{leaveCount}</h2>
          <p>Employees marked on leave</p>
        </div>

        <div className="emp-summary-card">
          <div className="emp-summary-top">
            <span>Inactive</span>
            <div className="emp-summary-icon inactive">
              <UserX size={21} />
            </div>
          </div>
          <h2>{inactiveCount}</h2>
          <p>Resigned or terminated</p>
        </div>

      </section>

      {/* EMPLOYEE TABLE CARD */}
      <section className="emp-table-card">

        <div className="emp-table-header">
          <div>
            <span className="emp-section-label">
              EMPLOYEE DIRECTORY
            </span>

            <h2>All Employees</h2>

            <p>
              {employees.length} employees registered in ATTENZA
            </p>
          </div>

          <div className="emp-record-count">
            <Users size={16} />
            {filteredEmployees.length} Records
          </div>
        </div>

        {/* SEARCH */}
        <div className="emp-toolbar">
          <div className="emp-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="emp-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="emp-table-wrapper">
          {loading ? (
            <div className="emp-empty-state">
              <div className="emp-loading-spinner" />
              <strong>Loading employees...</strong>
            </div>
          ) : (
            <table className="emp-data-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>EMPLOYEE ID</th>
                  <th>STATUS</th>
                  <th>DATE JOINED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="emp-empty-state">
                        <Users size={32} />
                        <strong>No employees found</strong>
                        <span>
                          Try another name or employee ID.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => {
                    const status = getEmployeeStatus(employee);

                    return (
                      <tr key={employee.id}>
                        <td>
                          <div className="emp-name-cell">
                            <div className="emp-avatar">
                              {employee.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="emp-name-details">
                              <strong>{employee.name}</strong>
                              <span>Employee</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <strong className="emp-id">
                            {employee.employeeId}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`emp-status-badge ${status
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[()]/g, "")}`}
                          >
                            <span className="emp-status-dot" />
                            {status}
                          </span>
                        </td>

                        <td>
                          <span className="emp-date">
                            {employee.createdAt
                              ? new Date(
                                  employee.createdAt
                                ).toLocaleDateString("en-IN")
                              : "--"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="emp-edit-btn"
                            onClick={() =>
                              openEditEmployee(employee)
                            }
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="emp-table-footer">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>

      </section>

      {/* ADD EMPLOYEE MODAL */}
      {showAddEmployee && (
        <div
          className="emp-modal-overlay"
          onClick={() => setShowAddEmployee(false)}
        >
          <div
            className="emp-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-modal-header">
              <div>
                <span className="emp-section-label">
                  NEW ACCOUNT
                </span>
                <h2>Add Employee</h2>
                <p>Create a new employee account.</p>
              </div>

              <button
                type="button"
                className="emp-modal-close"
                onClick={() => setShowAddEmployee(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="emp-form"
              onSubmit={handleAddEmployee}
            >
              <div className="emp-form-icon">
                <UserPlus size={25} />
              </div>

              <label>Employee ID</label>
              <input
                className="emp-form-control"
                type="text"
                placeholder="Example: AIOT2609"
                value={form.employeeId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    employeeId: e.target.value.toUpperCase(),
                  })
                }
                required
              />

              <label>Employee Name</label>
              <input
                className="emp-form-control"
                type="text"
                placeholder="Enter employee name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
              />

              <label>PIN</label>
              <input
                className="emp-form-control"
                type="password"
                inputMode="numeric"
                placeholder="Enter 4 digit PIN"
                maxLength={4}
                value={form.pin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pin: e.target.value.replace(/\D/g, ""),
                  })
                }
                required
              />

              <label>Employee Status</label>
              {renderStatusSelect(form.status, (status) =>
                setForm({ ...form, status })
              )}

              <button
                type="submit"
                className="emp-submit-btn"
              >
                <UserPlus size={18} />
                Create Employee
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {editingEmployee && (
        <div
          className="emp-modal-overlay"
          onClick={() => setEditingEmployee(null)}
        >
          <div
            className="emp-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-modal-header">
              <div>
                <span className="emp-section-label">
                  UPDATE ACCOUNT
                </span>
                <h2>Edit Employee</h2>
                <p>Update employee information.</p>
              </div>

              <button
                type="button"
                className="emp-modal-close"
                onClick={() => setEditingEmployee(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="emp-form"
              onSubmit={handleEditEmployee}
            >
              <div className="emp-form-icon">
                <Pencil size={25} />
              </div>

              <label>Employee ID</label>
              <input
                className="emp-form-control"
                type="text"
                placeholder="Enter employee ID"
                value={editForm.employeeId}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    employeeId: e.target.value.toUpperCase(),
                  })
                }
                required
              />

              <label>Employee Name</label>
              <input
                className="emp-form-control"
                type="text"
                placeholder="Enter employee name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
                required
              />

              <label>New PIN</label>
              <input
                className="emp-form-control"
                type="password"
                inputMode="numeric"
                placeholder="Leave blank to keep current PIN"
                maxLength={4}
                value={editForm.pin}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    pin: e.target.value.replace(/\D/g, ""),
                  })
                }
              />

              <label>Employee Status</label>
              {renderStatusSelect(editForm.status, (status) =>
                setEditForm({ ...editForm, status })
              )}

              <button
                type="submit"
                className="emp-submit-btn"
              >
                <Pencil size={17} />
                Save Changes
              </button>

              <button
                type="button"
                className="emp-cancel-btn"
                onClick={() => setEditingEmployee(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="emp-page-footer">
        <ShieldCheck size={16} />
        ATTENZA – Employee Management
      </div>

    </div>
  );
}

export default Employees;
