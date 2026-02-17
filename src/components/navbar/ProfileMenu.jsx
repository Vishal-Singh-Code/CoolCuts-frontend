import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Profile menu"
        className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-mid)] hover:bg-[var(--surface-hover)] transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2.5 text-sm text-[var(--ink-mid)] hover:bg-[var(--surface-hover)]"
          >
            My Profile
          </button>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
