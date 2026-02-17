import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PasswordInput from "../../components/ui/PasswordInput";
import { getApiErrorMessage } from "../../services/authServices";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

const Login = () => {
  const { login, googleLogin, authLoading } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(identifier, password);
      const isStaff = Boolean(res.data?.user?.is_staff);

      if (isStaff) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid email or password"));
    }
  };

  const handleGoogleLogin = async (idToken) => {
    setError("");
    try {
      const res = await googleLogin(idToken);
      const isStaff = Boolean(res.data?.user?.is_staff);
      navigate(isStaff ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Google login failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/95 border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/80 p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-600 text-sm mt-1">Log in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              required
              className="input"
            />
          </div>

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />

          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-sm font-medium text-slate-700 hover:text-teal-700 transition">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={authLoading} className="btn-primary">
            {authLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">or</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="flex justify-center">
          <GoogleSignInButton
            disabled={authLoading}
            onSuccess={handleGoogleLogin}
            onError={(msg) => setError(msg)}
          />
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Do not have an account?{" "}
          <Link to="/register" className="font-semibold text-slate-900 hover:text-teal-700 transition">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
