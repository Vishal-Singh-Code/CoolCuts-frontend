import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Profile = () => {
  const { user, loading, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  /* ------------------ Init profile data ------------------ */
  useEffect(() => {
    if (!user) return;
    setName(user.name || user.first_name || user.username || "");
    setPhone(user.phone || "");
  }, [user]);

  /* ------------------ Fetch appointments ------------------ */
  useEffect(() => {
    if (!user) return;

    api
      .get("/api/appointments/")
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setAppointmentsLoading(false));
  }, [user]);

  /* ------------------ Appointment stats ------------------ */
  const stats = useMemo(() => {
    const pending = appointments.filter(a => a.status === "pending").length;
    const done = appointments.filter(a => a.status === "done").length;
    return {
      total: appointments.length,
      pending,
      done,
    };
  }, [appointments]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  /* ------------------ Save profile ------------------ */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveMessage("");

    if (!name.trim()) {
      setSaveError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      await api.patch("/auth/me/", {
        name: name.trim(),
        phone: phone.trim(),
      });
      await refreshUser();

      setSaveMessage("Profile saved successfully.");
      setIsEditing(false);
    } catch (error) {
      setSaveError(
        error.response?.data?.error || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ------------------ Cancel edit ------------------ */
  const handleCancel = () => {
    setName(user.name || user.first_name || user.username || "");
    setPhone(user.phone || "");
    setSaveError("");
    setSaveMessage("");
    setIsEditing(false);
  };

  /* ======================= UI ======================= */
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Card */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">My Profile</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account information
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-teal-600 hover:underline"
              >
                Edit profile
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border px-3 py-2
                    ${isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-teal-400"
                      : "bg-gray-50 border-gray-200 text-gray-700"}
                  `}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border px-3 py-2
                    ${isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-teal-400"
                      : "bg-gray-50 border-gray-200 text-gray-700"}
                  `}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Email
              </p>
              <p className="font-medium mt-1">{user?.email}</p>
            </div>

            {saveError && (
              <p className="text-sm bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                {saveError}
              </p>
            )}

            {saveMessage && (
              <p className="text-sm bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
                {saveMessage}
              </p>
            )}

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Appointment Summary */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold">Appointments</h2>

          {appointmentsLoading ? (
            <p className="text-sm text-gray-500 mt-3">
              Loading appointment summary...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-xs text-yellow-700 uppercase">Pending</p>
                <p className="text-2xl font-semibold text-yellow-800">
                  {stats.pending}
                </p>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-xs text-green-700 uppercase">Done</p>
                <p className="text-2xl font-semibold text-green-800">
                  {stats.done}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
