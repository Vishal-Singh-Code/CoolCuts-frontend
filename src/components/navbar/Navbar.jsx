import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Icons";
import { useAuth } from "../../context/AuthContext";
import NavLinksPublic from "./NavLinksPublic";
import NavLinksUser from "./NavLinksUser";
import NavLinksAdmin from "./NavLinksAdmin";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_staff);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        borderColor: "var(--line)",
        background: "color-mix(in srgb, var(--surface) 85%, transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--ink-strong)" }}>
            CoolCuts
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {!user && <NavLinksPublic />}
          {user && !isAdmin && <NavLinksUser />}
          {isAdmin && <NavLinksAdmin />}
          <ThemeToggle />
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg border w-10 h-10 transition"
          style={{ borderColor: "var(--line)", color: "var(--ink-mid)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <span className="text-xl leading-none">x</span>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: "var(--line)",
            background: "color-mix(in srgb, var(--surface) 92%, transparent)",
          }}
        >
          <div className="px-4 py-3">
            <ThemeToggle compact />
          </div>
          {!user && <NavLinksPublic mobile />}
          {user && !isAdmin && <NavLinksUser mobile />}
          {isAdmin && <NavLinksAdmin mobile />}
        </div>
      )}
    </header>
  );
};

export default Navbar;
