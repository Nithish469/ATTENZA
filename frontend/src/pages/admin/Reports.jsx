
import { useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  Users,
  Clock,
  CheckCircle,
  FileDown,
  CalendarDays,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import API from "../../services/api";

// ==========================================
// DATE HELPERS
// ==========================================

const dateKey = (value) => {
  if (!value) return "";

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}/.test(value)
  ) {
    return value.slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return `${values.year}-${values.month}-${values.day}`;
};

const getCurrentMonthKey = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return `${values.year}-${values.month}`;
};

const getTodayKey = () => dateKey(new Date());

const monthKey = (value) => value.slice(0, 7);

const formatDate = (value) => {
  const key = dateKey(value);

  if (!key) return "--";

  const [year, month, day] = key.split("-");

  return `${day}/${month}/${year}`;
};

const formatTime = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

const formatMinutes = (value) => {
  const minutes = Math.max(0, Number(value) || 0);

  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

// ==========================================
// REPORTS COMPONENT
// ==========================================

function Reports() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonthKey
  );

  const [loading, setLoading] = useState(true);

  // ========================================
  // FETCH DATA
  // ========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        employeesResponse,
        attendanceResponse,
        holidaysResponse,
      ] = await Promise.all([
        API.get("/employees"),
        API.get("/attendance"),
        API.get("/holidays"),
      ]);

      const employeeData =
        employeesResponse.data?.employees ??
        employeesResponse.data;

      const attendanceData =
        attendanceResponse.data?.attendance ??
        attendanceResponse.data;

      const holidayData =
        holidaysResponse.data?.holidays ??
        holidaysResponse.data;

      setEmployees(
        Array.isArray(employeeData) ? employeeData : []
      );

      setAttendance(
        Array.isArray(attendanceData) ? attendanceData : []
      );

      setHolidays(
        Array.isArray(holidayData) ? holidayData : []
      );
    } catch (error) {
      console.error("Reports error:", error);

      alert(
        "Reports load aagala. Admin login, API routes, and server check pannunga."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ========================================
  // EMPLOYEE DETAILS
  // ========================================

  const employeeForRecord = (record) => {
    const nestedEmployee = record.employee;

    return employees.find((employee) => {
      if (
        nestedEmployee?.id &&
        employee.id === nestedEmployee.id
      ) {
        return true;
      }

      if (
        nestedEmployee?.employeeId &&
        employee.employeeId === nestedEmployee.employeeId
      ) {
        return true;
      }

      if (
        record.employeeId &&
        (
          employee.id === record.employeeId ||
          employee.employeeId === record.employeeId
        )
      ) {
        return true;
      }

      return false;
    });
  };

  const employeeBusinessId = (record) =>
    employeeForRecord(record)?.employeeId ??
    record.employee?.employeeId ??
    record.employeeId ??
    "";

  const employeeName = (record) =>
    employeeForRecord(record)?.name ??
    record.employee?.name ??
    record.name ??
    "--";

  const getEmployeeId = (record) =>
    employeeBusinessId(record);

  // ========================================
  // WORKING MINUTES
  // ========================================

  const getMinutes = (record) => {
    const value = Number(record.totalMinutes);

    if (
      record.totalMinutes !== null &&
      record.totalMinutes !== undefined &&
      Number.isFinite(value)
    ) {
      return Math.max(0, value);
    }

    if (record.entryTime && record.exitTime) {
      const start = new Date(record.entryTime).getTime();
      const end = new Date(record.exitTime).getTime();

      if (
        Number.isFinite(start) &&
        Number.isFinite(end) &&
        end >= start
      ) {
        return Math.floor((end - start) / 60000);
      }
    }

    return 0;
  };

  const getRecordStatus = (record) => {
    if (record.entryTime && record.exitTime) {
      return "Completed";
    }

    if (record.entryTime) {
      return "Present";
    }

    return "Absent";
  };

  // ========================================
  // FILTER ATTENDANCE
  // ========================================

  const filteredAttendance = attendance
    .filter((record) => {
      const id = employeeBusinessId(record).toLowerCase();
      const name = employeeName(record).toLowerCase();
      const query = search.trim().toLowerCase();

      if (
        selectedEmployee &&
        employeeBusinessId(record) !== selectedEmployee &&
        employeeForRecord(record)?.id !== selectedEmployee
      ) {
        return false;
      }

      if (
        query &&
        !id.includes(query) &&
        !name.includes(query)
      ) {
        return false;
      }

      if (
        selectedMonth &&
        monthKey(dateKey(record.attendanceDate)) !== selectedMonth
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) =>
      dateKey(b.attendanceDate).localeCompare(
        dateKey(a.attendanceDate)
      )
    );

  // ========================================
  // MONTH DETAILS
  // ========================================

  const getMonth = () => {
    const chosen = selectedMonth || getCurrentMonthKey();

    const [year, month] = chosen.split("-").map(Number);

    return {
      chosen,
      year,
      month,
      totalDays: new Date(year, month, 0).getDate(),
    };
  };

  const getSelectedMonthHolidayCount = () => {
    const chosen = selectedMonth || getCurrentMonthKey();

    return new Set(
      holidays
        .map((holiday) => dateKey(holiday.date))
        .filter(
          (date) => date && date.startsWith(`${chosen}-`)
        )
    ).size;
  };

  // ========================================
  // MONTHLY EMPLOYEE SUMMARY
  // ========================================

  const buildSummary = (employeeList) => {
    const { year, month, totalDays, chosen } = getMonth();

    const todayKey = getTodayKey();

    const firstDayKey = `${chosen}-01`;

    const lastDayKey =
      `${chosen}-${String(totalDays).padStart(2, "0")}`;

    let elapsedDays = 0;

    if (todayKey > lastDayKey) {
      elapsedDays = totalDays;
    } else if (todayKey >= firstDayKey) {
      elapsedDays = Number(todayKey.slice(8, 10));
    }

    const holidayDates = new Set(
      holidays
        .map((holiday) => dateKey(holiday.date))
        .filter(
          (date) => date && date.startsWith(`${chosen}-`)
        )
    );

    const nonWorkingDates = new Set();

    for (let day = 1; day <= elapsedDays; day++) {
      const key =
        `${chosen}-${String(day).padStart(2, "0")}`;

      const weekday =
        new Date(`${key}T00:00:00Z`).getUTCDay();

      if (weekday === 0 || holidayDates.has(key)) {
        nonWorkingDates.add(key);
      }
    }

    const companyLeave = nonWorkingDates.size;

    const workingDays = Math.max(
      0,
      elapsedDays - companyLeave
    );

    return employeeList.map((employee) => {
      const matchesEmployee = (record) => {
        const matched = employeeForRecord(record);

        return (
          matched?.id === employee.id ||
          matched?.employeeId === employee.employeeId ||
          record.employee?.id === employee.id ||
          record.employee?.employeeId === employee.employeeId ||
          record.employeeId === employee.id ||
          record.employeeId === employee.employeeId
        );
      };

      const employeeAttendance = attendance.filter((record) => {
        const recordDate = dateKey(record.attendanceDate);

        return (
          matchesEmployee(record) &&
          monthKey(recordDate) === chosen &&
          recordDate <= todayKey
        );
      });

      const presentDates = new Set();

      employeeAttendance.forEach((record) => {
        const recordDate = dateKey(record.attendanceDate);

        if (
          record.entryTime &&
          !nonWorkingDates.has(recordDate)
        ) {
          presentDates.add(recordDate);
        }
      });

      const present = Math.min(
        presentDates.size,
        workingDays
      );

      const absent = Math.max(
        0,
        workingDays - present
      );

      const totalWorkingMinutes =
        employeeAttendance.reduce(
          (sum, record) => sum + getMinutes(record),
          0
        );

      const percent =
        workingDays > 0
          ? (present / workingDays) * 100
          : 0;

      return {
        name: employee.name || "--",
        employeeId: employee.employeeId || "--",
        present,
        absent,
        companyLeave,
        workingDays,
        totalDays,
        totalWorkingMinutes,
        percent,
        status:
          employee.status ||
          (employee.isActive === false ? "INACTIVE" : "ACTIVE"),
      };
    });
  };

  // ========================================
  // PDF EXPORT
  // ========================================

  const exportPDF = (employeeOnly = false) => {
    if (employeeOnly && !selectedEmployee) {
      alert(
        "Please select an employee from the Employee dropdown first."
      );
      return;
    }

    let eligibleEmployees = employees;

    if (employeeOnly) {
      eligibleEmployees = employees.filter(
        (employee) =>
          employee.employeeId === selectedEmployee ||
          employee.id === selectedEmployee
      );
    } else if (search.trim()) {
      const query = search.trim().toLowerCase();

      eligibleEmployees = employees.filter(
        (employee) =>
          String(employee.employeeId || "")
            .toLowerCase()
            .includes(query) ||
          String(employee.name || "")
            .toLowerCase()
            .includes(query)
      );
    }

    const rows = buildSummary(eligibleEmployees);

    if (!rows.length) {
      alert("Export panna employee data edhuvum illa.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const { chosen } = getMonth();

    doc.setFontSize(18);
    doc.text("ATTENZA Attendance", 14, 16);

    doc.setFontSize(13);

    doc.text(
      employeeOnly
        ? "Individual Employee Monthly Summary"
        : "All Employees Monthly Summary",
      14,
      25
    );

    doc.setFontSize(9);

    doc.text(
      `Month: ${chosen} | Weekly holiday: Sunday`,
      14,
      32
    );

    doc.text(
      `Company holidays this month: ${getSelectedMonthHolidayCount()}`,
      14,
      37
    );

    doc.text(
      "Counts include only elapsed dates through today for the current month.",
      14,
      42
    );

    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })}`,
      14,
      47
    );

    const reportTotalMinutes = rows.reduce(
      (sum, row) => sum + row.totalWorkingMinutes,
      0
    );

    doc.setFontSize(10);

    doc.text(
      `Total Working Time (all listed employees): ${formatMinutes(
        reportTotalMinutes
      )}`,
      14,
      53
    );

    autoTable(doc, {
      startY: 59,

      head: [[
        "Name",
        "Employee ID",
        "Present",
        "Absent",
        "Company Leave",
        "Working Days",
        "Total Days",
        "Total Working Time",
        "Attendance %",
        "Status",
      ]],

      body: rows.map((row) => [
        row.name,
        row.employeeId,
        row.present,
        row.absent,
        row.companyLeave,
        row.workingDays,
        row.totalDays,
        formatMinutes(row.totalWorkingMinutes),
        `${row.percent.toFixed(1)}%`,
        row.status,
      ]),

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },

      headStyles: {
        fillColor: [15, 61, 46],
        textColor: 255,
      },

      alternateRowStyles: {
        fillColor: [245, 248, 252],
      },

      margin: {
        left: 14,
        right: 14,
        bottom: 16,
      },

      didDrawPage: () => {
        const page = doc.internal.getNumberOfPages();

        doc.setFontSize(8);

        doc.text(
          `ATTENZA Attendance | Page ${page}`,
          14,
          doc.internal.pageSize.getHeight() - 8
        );
      },
    });

    const safeName = employeeOnly
      ? (rows[0].employeeId || "employee").replace(
          /[^a-z0-9_-]/gi,
          "_"
        )
      : "all_employees";

    doc.save(
      `ATTENZA_Summary_${safeName}_${chosen}.pdf`
    );
  };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSelectedEmployee("");
    setSearch("");
    setSelectedMonth(getCurrentMonthKey());
  };

  // ========================================
  // SUMMARY STATISTICS
  // ========================================

  const completedRecords = filteredAttendance.filter(
    (record) => record.entryTime && record.exitTime
  );

  const totalMinutes = completedRecords.reduce(
    (sum, record) => sum + getMinutes(record),
    0
  );

  const averageMinutes = completedRecords.length
    ? Math.floor(totalMinutes / completedRecords.length)
    : 0;

  // ========================================
  // UI
  // ========================================

  return (
    <div className="rep-page">

      {/* HEADER */}

      <header className="rep-page-header">
        <div>
          <span className="rep-eyebrow">
            ANALYTICS & REPORTING
          </span>

          <h1>Attendance Reports</h1>

          <p>
            Monitor employee attendance and generate monthly reports.
          </p>
        </div>

        <button
          type="button"
          className="rep-refresh-btn"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "rep-spinning" : ""}
          />

          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </header>

      {/* FILTERS */}

      <section className="rep-filter-card">

        <div className="rep-filter-heading">
          <div>
            <span className="rep-section-label">
              REPORT CONTROLS
            </span>

            <h2>Filter Attendance</h2>

            <p>
              Choose an employee, month or search by name and ID.
            </p>
          </div>

          <CalendarDays size={23} />
        </div>

        <div className="rep-filter-grid">

          <div className="rep-filter-field">
            <label htmlFor="rep-employee">
              Employee
            </label>

            <select
              id="rep-employee"
              value={selectedEmployee}
              onChange={(event) =>
                setSelectedEmployee(event.target.value)
              }
            >
              <option value="">All Employees</option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.employeeId}
                >
                  {employee.employeeId} - {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rep-filter-field">
            <label htmlFor="rep-month">
              Report Month
            </label>

            <input
              id="rep-month"
              type="month"
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(event.target.value)
              }
            />
          </div>

          <div className="rep-filter-field rep-search-field">
            <label htmlFor="rep-search">
              Search Employee
            </label>

            <div className="rep-search-box">
              <Search size={17} />

              <input
                id="rep-search"
                type="text"
                placeholder="Search employee name or ID..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          <button
            type="button"
            className="rep-clear-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>
      </section>

      {/* PDF EXPORT */}

      <section className="rep-export-bar">

        <div>
          <span className="rep-section-label">
            DOWNLOAD REPORTS
          </span>

          <h2>Export Attendance</h2>

          <p>
            Generate PDF reports for the selected month.
          </p>
        </div>

        <div className="rep-export-actions">

          <button
            type="button"
            className="rep-export-btn secondary"
            onClick={() => exportPDF(false)}
            disabled={loading}
          >
            <FileDown size={17} />
            Export All PDF
          </button>

          <button
            type="button"
            className="rep-export-btn primary"
            onClick={() => exportPDF(true)}
            disabled={loading || !selectedEmployee}
          >
            <FileDown size={17} />
            Employee PDF
          </button>

        </div>
      </section>

      {/* SUMMARY CARDS */}

      <section className="rep-stats-grid">

        <div className="rep-stat-card">
          <div className="rep-stat-top">
            <span>Attendance Records</span>

            <div className="rep-stat-icon total">
              <Users size={21} />
            </div>
          </div>

          <h2>{filteredAttendance.length}</h2>

          <p>Records matching filters</p>
        </div>

        <div className="rep-stat-card">
          <div className="rep-stat-top">
            <span>Completed Days</span>

            <div className="rep-stat-icon completed">
              <CheckCircle size={21} />
            </div>
          </div>

          <h2>{completedRecords.length}</h2>

          <p>Check-in and check-out completed</p>
        </div>

        <div className="rep-stat-card">
          <div className="rep-stat-top">
            <span>Total Working Time</span>

            <div className="rep-stat-icon working">
              <Clock size={21} />
            </div>
          </div>

          <h2>{formatMinutes(totalMinutes)}</h2>

          <p>Combined completed records</p>
        </div>

        <div className="rep-stat-card">
          <div className="rep-stat-top">
            <span>Average Working Time</span>

            <div className="rep-stat-icon average">
              <Clock size={21} />
            </div>
          </div>

          <h2>{formatMinutes(averageMinutes)}</h2>

          <p>Per completed record</p>
        </div>

        <div className="rep-stat-card">
          <div className="rep-stat-top">
            <span>Company Holidays</span>

            <div className="rep-stat-icon holidays">
              <CalendarDays size={21} />
            </div>
          </div>

          <h2>{getSelectedMonthHolidayCount()}</h2>

          <p>Configured holidays this month</p>
        </div>

      </section>

      {/* ATTENDANCE TABLE */}

      <section className="rep-table-card">

        <div className="rep-table-heading">
          <div>
            <span className="rep-section-label">
              ATTENDANCE HISTORY
            </span>

            <h2>Attendance Report</h2>

            <p>
              Detailed employee check-in and check-out records.
            </p>
          </div>

          <div className="rep-record-count">
            <Users size={16} />
            {filteredAttendance.length} Records
          </div>
        </div>

        {loading ? (
          <div className="rep-empty-state">
            <div className="rep-spinner" />

            <strong>
              Loading attendance reports...
            </strong>
          </div>
        ) : (
          <div className="rep-table-wrapper">

            <table className="rep-data-table">

              <thead>
                <tr>
                  <th>EMPLOYEE ID</th>
                  <th>EMPLOYEE</th>
                  <th>DATE</th>
                  <th>CHECK IN</th>
                  <th>CHECK OUT</th>
                  <th>WORKING HOURS</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, index) => {
                    const status = getRecordStatus(record);

                    return (
                      <tr
                        key={
                          record.id ??
                          `${getEmployeeId(record)}-${index}`
                        }
                      >

                        <td>
                          <strong className="rep-employee-id">
                            {employeeBusinessId(record) || "--"}
                          </strong>
                        </td>

                        <td>
                          <div className="rep-employee-cell">

                            <div className="rep-avatar">
                              {employeeName(record)
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {employeeName(record)}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {formatDate(record.attendanceDate)}
                        </td>

                        <td>
                          {formatTime(record.entryTime)}
                        </td>

                        <td>
                          {formatTime(record.exitTime)}
                        </td>

                        <td>
                          <strong className="rep-working-time">
                            {formatMinutes(getMinutes(record))}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`rep-status ${status.toLowerCase()}`}
                          >
                            <span className="rep-status-dot" />
                            {status}
                          </span>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="rep-empty-state">
                        <CalendarDays size={32} />

                        <strong>
                          No attendance records found
                        </strong>

                        <span>
                          Try changing the month or clearing your filters.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        )}

        <div className="rep-table-footer">
          Showing {filteredAttendance.length} attendance records
        </div>

      </section>

      {/* REPORT INFORMATION */}

      <div className="rep-info-note">
        <CalendarDays size={19} />

        <div>
          <strong>Report Calculation Information</strong>

          <p>
            Monthly summaries count only elapsed dates. Sundays and
            configured company holidays are excluded from working days.
            Future dates are not included in current-month absence
            calculations.
          </p>
        </div>
      </div>

      {/* FOOTER */}

      <div className="rep-page-footer">
        <CheckCircle size={15} />
        ATTENZA – Attendance Reporting System
      </div>

    </div>
  );
}

export default Reports;
