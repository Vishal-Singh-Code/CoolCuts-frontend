import { NavLink } from "react-router-dom";

const getDesktopClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-semibold transition ${
    isActive ? "bg-[var(--brand-soft)] text-[var(--brand-strong)]" : "text-[var(--ink-mid)] hover:bg-[var(--surface-hover)]"
  }`;

const getMobileClass = ({ isActive }) =>
  `block px-4 py-3 text-sm font-medium border-b border-[var(--line)] ${
    isActive ? "text-[var(--brand-strong)] bg-[var(--brand-soft)]" : "text-[var(--ink-mid)]"
  }`;

const NavLinksPublic = ({ mobile }) => (
  <nav className={mobile ? "flex flex-col" : "flex items-center gap-1"}>
    <NavLink to="/services" className={mobile ? getMobileClass : getDesktopClass}>
      Services
    </NavLink>
    <NavLink to="/book-appointment" className={mobile ? getMobileClass : getDesktopClass}>
      Book
    </NavLink>
    <NavLink to="/login" className={mobile ? getMobileClass : getDesktopClass}>
      Login
    </NavLink>
  </nav>
);

export default NavLinksPublic;
