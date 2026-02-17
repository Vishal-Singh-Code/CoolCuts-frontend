import AdminSidebar from "../sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--bg-1) 72%, white 28%) 0%, var(--bg-0) 100%)",
      }}
    >
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* Content wrapper */}
      <main
        className="min-h-screen transition-[padding] duration-300"
        style={{
          paddingLeft: collapsed ? "4rem" : "16rem", // 64px / 256px
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
