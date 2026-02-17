import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "../../components/ui/PasswordInput";
import { getApiErrorMessage } from "../../services/authServices";

const ForgotPassword = () => {
  const { requestForgotPasswordOtp, resetForgotPassword, otpLoading, authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    setInfo("");

    try {
      const res = await requestForgotPasswordOtp(email);
      setOtpSent(true);
      const expiresIn = res?.data?.otp_expires_in;
      if (expiresIn) {
        setInfo(`OTP sent. It expires in ${Math.floor(expiresIn / 60)} minutes.`);
      } else {
        setInfo("If your account is eligible, OTP has been sent.");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send OTP. Please try again."));
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await resetForgotPassword(email, otp, password);
      setInfo(res?.data?.message || "Password reset successful.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to reset password. Please try again."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/95 border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/80 p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Forgot password</h1>
          <p className="text-slate-600 text-sm mt-1">Reset your password with OTP</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {info && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-xl mb-4">
            {info}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              value={email}
              disabled={otpSent}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input"
            />
          </div>

          {!otpSent && (
            <button type="button" onClick={handleSendOtp} disabled={otpLoading} className="btn-primary">
              {otpLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {otpSent && (
            <>
              <div>
                <label className="label">Enter OTP</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit OTP"
                  required
                  maxLength={6}
                  className="input tracking-widest text-center"
                />
              </div>

              <PasswordInput
                label="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />

              <PasswordInput
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />

              <button type="submit" disabled={authLoading} className="btn-primary">
                {authLoading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full py-3 rounded-2xl border border-slate-300 text-slate-700 font-medium hover:border-slate-400 transition"
              >
                {otpLoading ? "Resending..." : "Resend OTP"}
              </button>
            </>
          )}
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-teal-700 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
