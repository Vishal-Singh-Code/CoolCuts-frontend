import api from "./api";

export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const payload = error?.response?.data;
  if (!payload) {
    return fallback;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  if (Array.isArray(payload.error) && payload.error.length > 0) {
    return String(payload.error[0]);
  }

  const firstKey = Object.keys(payload)[0];
  const firstValue = payload[firstKey];
  if (typeof firstValue === "string" && firstValue.trim()) {
    return firstValue;
  }
  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return String(firstValue[0]);
  }

  return fallback;
};

const authService = {
  
  sendOtp: (email) =>
    api.post("/auth/send-otp/", { email }),

  verifyOtpAndRegister: (email, otp, password) =>
    api.post("/auth/verify-otp-and-register/", {
      email,
      otp,
      password,
    }),

  login: (identifier, password) =>
    api.post("/auth/login/", {
      email: identifier,
      password,
    }),

  googleLogin: (idToken) =>
    api.post("/auth/google/", {
      id_token: idToken,
    }),

  requestForgotPasswordOtp: (email) =>
    api.post("/auth/forgot-password/send-otp/", { email }),

  resetForgotPassword: (email, otp, password) =>
    api.post("/auth/forgot-password/reset/", {
      email,
      otp,
      password,
    }),
};

export default authService;
