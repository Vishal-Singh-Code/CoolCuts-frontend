import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const getDesktopClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-semibold transition ${
    isActive ? "bg-[var(--brand-soft)] text-[var(--brand-strong)]" : "text-[var(--ink-mid)] hover:bg-[var(--surface-hover)]"
  }`;

const getMobileClass = ({ isActive }) =>
  `block px-4 py-3 text-sm font-medium border-b border-[var(--line)] ${
    isActive ? "text-[var(--brand-strong)] bg-[var(--brand-soft)]" : "text-[var(--ink-mid)]"
  }`;

const NavLinksAdmin = ({ mobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={mobile ? "flex flex-col" : "flex items-center gap-1"}>
      <NavLink to="/admin" className={mobile ? getMobileClass : getDesktopClass}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/appointments" className={mobile ? getMobileClass : getDesktopClass}>
        Appointments
      </NavLink>
      <NavLink to="/admin/services" className={mobile ? getMobileClass : getDesktopClass}>
        Services
      </NavLink>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className={
          mobile
            ? "block px-4 py-3 text-sm font-medium text-left border-b border-[var(--line)] text-red-600"
            : "px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
        }
      >
        Logout
      </button>
    </nav>
  );
};

export default NavLinksAdmin;
