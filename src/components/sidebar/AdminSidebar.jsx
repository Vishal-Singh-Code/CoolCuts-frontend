import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Palette } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

import {
  LayoutDashboard,
  Scissors,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";

const AdminSidebar = ({ collapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { cycleTheme } = useTheme();


  return (
    <aside
      className="fixed top-0 left-0 h-screen z-40 transition-[width] duration-300"
      style={{
        width: collapsed ? "4rem" : "16rem",
        background:
          "linear-gradient(165deg, color-mix(in srgb, var(--brand-strong) 34%, #0f172a 66%) 0%, #0f172a 62%)",
      }}
    >
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onToggle}
            className="text-white/80 hover:text-white"
          >
            <Menu size={20} />
          </button>

          {!collapsed && (
            <h2 className="text-white font-semibold tracking-tight">
              Admin Panel
            </h2>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-1">
          <NavItem to="/admin" icon={<LayoutDashboard />} label="Dashboard" collapsed={collapsed} end />
          <NavItem to="/admin/appointments" icon={<Scissors />} label="Appointments" collapsed={collapsed} />
          <NavItem to="/admin/services" icon={<Settings />} label="Services" collapsed={collapsed} />
        </nav>

        {/* Footer */}
        <div className="px-2 pb-4 space-y-3">
          {/* ThemeToggle should NOT resize */}
          {/* <ThemeToggle compact /> */}
          <div className="flex justify-center">
            {collapsed ? (
              <button
                onClick={cycleTheme}
                title="Change theme"
                aria-label="Change theme"
                className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition"
              >
                <Palette size={18} />
              </button>
            ) : (
              <ThemeToggle compact/>
            )}
          </div>




          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg
                       text-sm text-rose-200 hover:bg-rose-500/15"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label, collapsed, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
       ${
         isActive
           ? "bg-white/10 text-white"
           : "text-white/80 hover:bg-white/10 hover:text-white"
       }`
    }
  >
    {icon}
    {!collapsed && label}
  </NavLink>
);


export default AdminSidebar;
