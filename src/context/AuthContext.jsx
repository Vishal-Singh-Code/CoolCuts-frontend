import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import authService from "../services/authServices";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const restoreUser = async () => {
      const access = localStorage.getItem("access");

      if (!access) {
        setInitialLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me/");
        setUser(res.data);
      } catch (err) {
        console.error("Auth restore failed:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      } finally {
        setInitialLoading(false);
      }
    };

    restoreUser();
  }, []);

  const setSession = (payload) => {
    localStorage.setItem("access", payload.access);
    localStorage.setItem("refresh", payload.refresh);
  };

  const restoreMe = async () => {
    const me = await api.get("/auth/me/");
    setUser(me.data);
    return me;
  };


  const sendOtp = async (email) => {
    setOtpLoading(true);
    try {
      return await authService.sendOtp(email);
    } finally {
      setOtpLoading(false);
    }
  };


  const verifyOtpAndRegister = async (email, otp, password) => {
    setAuthLoading(true);
    try {
      const res = await authService.verifyOtpAndRegister(email, otp, password);
      setSession(res.data);
      await restoreMe();
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (identifier, password) => {
    setAuthLoading(true);
    try {
      const res = await authService.login(identifier, password);
      setSession(res.data);
      await restoreMe();
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setAuthLoading(true);
    try {
      const res = await authService.googleLogin(idToken);
      setSession(res.data);
      await restoreMe();
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  const requestForgotPasswordOtp = async (email) => {
    setOtpLoading(true);
    try {
      return await authService.requestForgotPasswordOtp(email);
    } finally {
      setOtpLoading(false);
    }
  };

  const resetForgotPassword = async (email, otp, password) => {
    setAuthLoading(true);
    try {
      return await authService.resetForgotPassword(email, otp, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
      navigate("/login");
    }
  };

 
  return (
    <AuthContext.Provider
      value={{
        user,
        loading: initialLoading || authLoading,
        authLoading,
        otpLoading,
        sendOtp,
        verifyOtpAndRegister,
        login,
        googleLogin,
        requestForgotPasswordOtp,
        resetForgotPassword,
        logout,
      }}
    >
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
