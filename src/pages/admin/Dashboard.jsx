import StatsCard from "../../components/dashboard/StatsCard";
import TodayAppointments from "../../components/dashboard/TodayAppointments";
import UpcomingAppointments from "../../components/dashboard/UpcomingAppointments";
import { useAdminAppointments } from "../../hooks/useAdminAppointments";

const Dashboard = () => {
  const { appointments, loading } = useAdminAppointments();

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (a) => a.appointment_date === today
  );

  const pending = appointments.filter((a) => a.status === "pending");
  const completed = appointments.filter((a) => a.status === "done");

  const revenue = completed.reduce(
    (sum, a) => sum + (a.price || 0),
    0
  );

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Appointments" value={todayAppointments.length} />
        <StatsCard title="Pending Appointments" value={pending.length} />
        <StatsCard title="Completed Appointments" value={completed.length} />
        <StatsCard title="Revenue (Rs)" value={revenue} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayAppointments appointments={todayAppointments} />
        <UpcomingAppointments appointments={appointments} />
      </div>
    </div>
  );
};

export default Dashboard;
