import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import api from "../../services/api";
import { Scissors, Calendar, Clock } from "lucide-react";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    api
      .get("/api/appointments/")
      .then((res) => setAppointments(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (time) =>
    new Date(`1970-01-01T${time}`).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "done":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-gray-500">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        Something went wrong. Please try again.
      </div>
    );
  }

  return (
    <main className="px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-center">
        Appointment History
      </h1>
      <p className="text-sm text-gray-500 text-center mt-1">
        Your past and upcoming appointments
      </p>

      {appointments.length === 0 && (
        <p className="text-center mt-12 text-gray-500">
          You don't have any appointments yet.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="bg-teal-600 text-white p-2 rounded-lg">
                  <Scissors size={18} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {appointment.selected_services.join(", ")}
                  </h3>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(appointment.appointment_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(appointment.appointment_time)}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full capitalize ${getStatusStyle(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setIsModalOpen(true);
                }}
                className="text-sm font-medium text-teal-600 hover:underline"
              >
                View details {"->"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Appointment Details
            </h2>

            <div className="text-sm space-y-2">
              <p>
                <strong>Service:</strong>{" "}
                {selectedAppointment.service_name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {formatDate(selectedAppointment.appointment_date)}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {formatTime(selectedAppointment.appointment_time)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">
                  {selectedAppointment.status}
                </span>
              </p>
              <p>
                <strong>Price:</strong> Rs {selectedAppointment.price}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AppointmentHistory;
