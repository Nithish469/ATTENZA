
import { useEffect, useState } from "react";

import {
  CalendarDays,
  Plus,
  Trash2,
  RefreshCw,
  CalendarCheck,
  CalendarPlus,
  Info,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import API from "../../services/api";

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const fetchHolidays = async () => {
    try {
      setLoading(true);

      const response = await API.get("/holidays");

      setHolidays(response.data.holidays || []);
    } catch (error) {
      console.error("Holiday fetch error:", error);

      setMessage(
        error.response?.data?.message || "Failed to load holidays"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const addHoliday = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!date || !name.trim()) {
      setMessage("Please enter the holiday date and name.");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post("/holidays", {
        date,
        name: name.trim(),
        description: description.trim(),
      });

      setMessage(
        response.data.message || "Holiday added successfully"
      );
      setMessageType("success");

      setDate("");
      setName("");
      setDescription("");

      await fetchHolidays();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add holiday"
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) {
      return;
    }

    setMessage("");

    try {
      setDeletingId(id);

      const response = await API.delete(`/holidays/${id}`);

      setMessage(
        response.data.message || "Holiday deleted successfully"
      );
      setMessageType("success");

      await fetchHolidays();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete holiday"
      );
      setMessageType("error");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "--";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sortedHolidays = [...holidays].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const upcomingCount = holidays.filter(
    (holiday) => new Date(holiday.date) >= new Date(new Date().toDateString())
  ).length;

  return (
    <div className="hol-page">

      {/* PAGE HEADER */}
      <header className="hol-page-header">
        <div>
          <span className="hol-eyebrow">
            WORKPLACE CALENDAR
          </span>

          <h1>Holiday Management</h1>

          <p>
            Manage company holidays and maintain your annual holiday calendar.
          </p>
        </div>

        <button
          type="button"
          className="hol-refresh-btn"
          onClick={fetchHolidays}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "hol-spinning" : ""}
          />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {/* SUMMARY CARDS */}
      <section className="hol-summary-grid">

        <div className="hol-summary-card">
          <div className="hol-summary-top">
            <span>Total Holidays</span>
            <div className="hol-summary-icon total">
              <CalendarDays size={21} />
            </div>
          </div>

          <h2>{holidays.length}</h2>
          <p>Configured company holidays</p>
        </div>

        <div className="hol-summary-card">
          <div className="hol-summary-top">
            <span>Upcoming Holidays</span>
            <div className="hol-summary-icon upcoming">
              <CalendarCheck size={21} />
            </div>
          </div>

          <h2>{upcomingCount}</h2>
          <p>Today and future holidays</p>
        </div>

        <div className="hol-summary-card">
          <div className="hol-summary-top">
            <span>Weekly Off</span>
            <div className="hol-summary-icon weekly">
              <CalendarPlus size={21} />
            </div>
          </div>

          <h2>Sunday</h2>
          <p>Intended automatic weekly off</p>
        </div>
      </section>

      {/* MESSAGE */}
      {message && (
        <div
          className={`hol-message ${messageType}`}
          role="status"
        >
          {messageType === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ADD HOLIDAY CARD */}
      <section className="hol-form-card">

        <div className="hol-card-heading">
          <div className="hol-heading-icon">
            <CalendarPlus size={22} />
          </div>

          <div>
            <span className="hol-section-label">
              HOLIDAY CONFIGURATION
            </span>

            <h2>Add Company Holiday</h2>

            <p>
              Add a holiday to the company attendance calendar.
            </p>
          </div>
        </div>

        <form className="hol-form" onSubmit={addHoliday}>

          <div className="hol-form-grid">

            <div className="hol-form-field">
              <label htmlFor="holiday-date">
                Holiday Date <span>*</span>
              </label>

              <input
                id="holiday-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>

            <div className="hol-form-field">
              <label htmlFor="holiday-name">
                Holiday Name <span>*</span>
              </label>

              <input
                id="holiday-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Pongal"
                maxLength={100}
                required
              />
            </div>

            <div className="hol-form-field hol-description-field">
              <label htmlFor="holiday-description">
                Description
              </label>

              <textarea
                id="holiday-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter an optional holiday description..."
                rows={3}
              />
            </div>

          </div>

          <div className="hol-form-actions">
            <button
              type="submit"
              className="hol-add-btn"
              disabled={submitting}
            >
              <Plus size={18} />
              {submitting ? "Adding Holiday..." : "Add Holiday"}
            </button>
          </div>
        </form>
      </section>

      {/* HOLIDAY LIST CARD */}
      <section className="hol-table-card">

        <div className="hol-table-heading">
          <div>
            <span className="hol-section-label">
              COMPANY CALENDAR
            </span>

            <h2>Company Holidays</h2>

            <p>
              View and manage configured company holidays.
            </p>
          </div>

          <div className="hol-record-count">
            <CalendarDays size={16} />
            {holidays.length} Holidays
          </div>
        </div>

        <div className="hol-table-wrapper">
          <table className="hol-data-table">
            <thead>
              <tr>
                <th>HOLIDAY DATE</th>
                <th>HOLIDAY NAME</th>
                <th>DESCRIPTION</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading && holidays.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="hol-empty-state">
                      <div className="hol-loading-spinner" />
                      <strong>Loading holidays...</strong>
                    </div>
                  </td>
                </tr>
              ) : sortedHolidays.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="hol-empty-state">
                      <CalendarDays size={32} />
                      <strong>No holidays added yet</strong>
                      <span>
                        Add your first company holiday using the form above.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedHolidays.map((holiday) => (
                  <tr key={holiday.id}>
                    <td>
                      <div className="hol-date-cell">
                        <CalendarDays size={16} />
                        <strong>{formatDate(holiday.date)}</strong>
                      </div>
                    </td>

                    <td>
                      <strong className="hol-name">
                        {holiday.name}
                      </strong>
                    </td>

                    <td>
                      <span className="hol-description">
                        {holiday.description || "--"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="hol-delete-btn"
                        onClick={() => deleteHoliday(holiday.id)}
                        disabled={deletingId === holiday.id}
                        aria-label={`Delete ${holiday.name}`}
                        title="Delete holiday"
                      >
                        <Trash2 size={15} />
                        {deletingId === holiday.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="hol-table-footer">
          Showing {holidays.length} configured holidays
        </div>
      </section>

      {/* INFORMATION NOTE */}
      <div className="hol-info-note">
        <Info size={19} />

        <div>
          <strong>Weekly Off Information</strong>

          <p>
            Sundays are intended to be automatic weekly offs. Attendance
            calculations still need to be updated separately to exclude
            Sundays and configured holidays.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="hol-page-footer">
        <ShieldCheck size={16} />
        ATTENZA – Holiday Management
      </div>

    </div>
  );
}

export default Holidays;
