import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "../../components/ui/PasswordInput";
import { getApiErrorMessage } from "../../services/authServices";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

const Register = () => {
  const { sendOtp, verifyOtpAndRegister, googleLogin, otpLoading, authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInfo, setOtpInfo] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    setOtpInfo("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await sendOtp(email);
      setOtpSent(true);
      const expiresIn = res?.data?.otp_expires_in;
      if (expiresIn) {
        setOtpInfo(`OTP sent. It expires in ${Math.floor(expiresIn / 60)} minutes.`);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send OTP. Please try again."));
    }
  };

  const handleGoogleLogin = async (idToken) => {
    setError("");
    try {
      const res = await googleLogin(idToken);
      const isStaff = Boolean(res.data?.user?.is_staff);
      navigate(isStaff ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Google sign up failed"));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await verifyOtpAndRegister(email, otp, password);
      const isStaff = Boolean(res.data?.user?.is_staff);
      navigate(isStaff ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid OTP or registration failed."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/95 border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/80 p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-600 text-sm mt-1">Verify your email to get started</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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

          <PasswordInput
            label="Password"
            value={password}
            disabled={otpSent}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />

          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            disabled={otpSent}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />

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

              {otpInfo && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-xl">
                  {otpInfo}
                </div>
              )}

              <button type="submit" disabled={authLoading} className="btn-primary">
                {authLoading ? "Verifying..." : "Verify and Register"}
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

          {!otpSent && (
            <button type="button" onClick={handleSendOtp} disabled={otpLoading} className="btn-primary">
              {otpLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}
        </form>

        {!otpSent && (
          <>
            <div className="my-5 flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">or</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="flex justify-center">
              <GoogleSignInButton
                disabled={authLoading || otpLoading}
                onSuccess={handleGoogleLogin}
                onError={(msg) => setError(msg)}
              />
            </div>
          </>
        )}

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-teal-700 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
