import "./App.css";
import "./styles/styles.css";
import "./styles/LoadingScreen.css";

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// components
import LoadingScreen from "./components/LoadingScreen";
import Logout from "./components/Logout";
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminRoute from "./components/protected/PrivateRoutes";


// pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Home from "./pages/user/Home";
import UserServices from "./pages/user/Services";
import BookAppointment from "./pages/user/BookAppointment";
import AppointmentHistory from "./pages/user/AppointmentHistory";
import Profile from "./pages/user/Profile";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/admin/Dashboard";
import Appointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/Services";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div>
      {isLoading && <LoadingScreen />}

      <div
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"
          }`}
      >
        <Routes>
          {/* PUBLIC / USER */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<UserServices />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/history" element={<AppointmentHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* ADMIN */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="services" element={<AdminServices />} />
            </Route>
          </Route>

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
