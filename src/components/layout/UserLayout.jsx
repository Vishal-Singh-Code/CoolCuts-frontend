import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] app-enter">
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
