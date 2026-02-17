import { NavLink, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "../../context/AuthContext";

const getDesktopClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-semibold transition ${
    isActive ? "bg-[var(--brand-soft)] text-[var(--brand-strong)]" : "text-[var(--ink-mid)] hover:bg-[var(--surface-hover)]"
  }`;

const getMobileClass = ({ isActive }) =>
  `block px-4 py-3 text-sm font-medium border-b border-[var(--line)] ${
    isActive ? "text-[var(--brand-strong)] bg-[var(--brand-soft)]" : "text-[var(--ink-mid)]"
  }`;

const NavLinksUser = ({ mobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={mobile ? "flex flex-col" : "flex items-center gap-1"}>
      <NavLink to="/services" className={mobile ? getMobileClass : getDesktopClass}>
        Services
      </NavLink>
      <NavLink to="/book-appointment" className={mobile ? getMobileClass : getDesktopClass}>
        Book
      </NavLink>
      <NavLink to="/history" className={mobile ? getMobileClass : getDesktopClass}>
        My Appointments
      </NavLink>

      {!mobile && <ProfileMenu />}

      {mobile && (
        <>
          <NavLink to="/profile" className={getMobileClass}>
            My Profile
          </NavLink>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="block px-4 py-3 text-sm font-medium text-left border-b border-[var(--line)] text-red-600"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default NavLinksUser;
