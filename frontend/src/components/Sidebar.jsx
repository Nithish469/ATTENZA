
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "employees",
    label: "Employees",
    icon: Users,
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
  },
  {
    id: "holidays",
    label: "Holidays",
    icon: CalendarDays,
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

function Sidebar({ page, setPage, onLogout }) {
  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    if (typeof onLogout === "function") {
      onLogout();
    } else {
      console.error("Logout function is not connected.");
    }
  };

  return (
    <aside className="attenza-sidebar">

      {/* Brand */}
      <div className="attenza-sidebar-brand">
        <div className="attenza-brand-icon">
          A
        </div>

        <div className="attenza-brand-content">
          <h2>ATTENZA</h2>
          <span>Attendance Management</span>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="attenza-admin-profile">
        <div className="attenza-admin-avatar">
          <ShieldCheck size={20} />
        </div>

        <div className="attenza-admin-info">
          <strong>Administrator</strong>
          <span>Management Portal</span>
        </div>

        <span className="attenza-online-dot" />
      </div>

      {/* Navigation */}
      <div className="attenza-menu-heading">
        MAIN MENU
      </div>

      <nav className="attenza-sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`attenza-menu-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => setPage(item.id)}
              aria-current={
                isActive ? "page" : undefined
              }
            >
              <Icon size={19} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Bottom */}
      <div className="attenza-sidebar-bottom">

        <div className="attenza-sidebar-footer-note">
          <ShieldCheck size={17} />
          <span>Secure Attendance System</span>
        </div>

        <button
          type="button"
          className="attenza-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

        <div className="attenza-sidebar-version">
          ATTENZA © 2026
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;
