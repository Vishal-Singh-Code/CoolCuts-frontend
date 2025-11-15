import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import api from "../services/api";
import { Scissors } from "lucide-react"; // optional icon (install: npm i lucide-react)

const History = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        const response = await api.get(`/api/user/appointments/`, {
          params: { user_id: user.id },
        });

        const sorted = Array.isArray(response.data)
          ? response.data.sort((a, b) => new Date(b.booking_time) - new Date(a.booking_time))
          : [];

        setAppointments(sorted);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-UK", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-teal-100 text-teal-700",
      cancelled: "bg-red-100 text-red-600",
      completed: "bg-green-100 text-green-600"
    };
    return colors[status] || "bg-gray-200 text-gray-600";
  };

  const getServiceNames = (checklist) =>
    checklist?.map(item => item?.text?.name).join(", ") || "Service";

  if (loading)
    return <div className="text-center mt-20 text-lg font-medium">⏳ Loading your appointments...</div>;

  if (error)
    return <p className="text-center text-red-500 p-10">Something went wrong: {error.message}</p>;

  return (
    <div className="mt-8 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
          Appointment History
        </h1>

        <p className="text-center text-gray-600 mt-1 mb-10 text-sm sm:text-base">
          Track your previous bookings and revisit your favourite services anytime.
        </p>


        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="text-center text-gray-500 text-lg mt-10">
            No appointments found. <br /> Book your first grooming session!
          </div>
        )}

        {/* Timeline List */}
        {appointments.length > 0 && (
          <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">

            {appointments.map((appointment) => (
              <div key={appointment.id} className="relative pl-6">

                {/* Dot */}
                <span className="absolute left-[-11px] top-3 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-md" />

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-[2px]">

                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">

                    {/* Icon + Info */}
                    <div className="flex gap-4 items-start">
                      <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
                        <Scissors size={22} />
                      </div>

                      <div>
                        <p
                          title={getServiceNames(appointment.checklist)}
                          className="text-md sm:text-lg font-semibold text-gray-900 leading-tight truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px] sm:max-w-none sm:whitespace-normal"
                        >
                          {getServiceNames(appointment.checklist)}
                        </p>



                        <p className="text-gray-500 text-sm">
                          {formatDateTime(appointment.booking_time)}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t my-4"></div>

                  {/* Action Buttons */}
                  <div className="flex justify-start gap-3">
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="px-5 py-2 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
                    >
                      View Details
                    </button>

                    {appointment.status === "pending" && (
                      <button className="px-5 py-2 rounded-full border border-red-400 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                        Cancel
                      </button>
                    )}

                    {appointment.status === "completed" && (
                      <button className="px-5 py-2 rounded-full border border-gray-400 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition">
                        Repeat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAppointment && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="space-y-4 text-[15px]">

            <div className="flex justify-between text-gray-800">
              <strong>Service(s):</strong>
              <span>{getServiceNames(selectedAppointment.checklist)}</span>
            </div>

            <div className="flex justify-between text-gray-800">
              <strong>Date & Time:</strong>
              <span>{formatDateTime(selectedAppointment.booking_time)}</span>
            </div>

            <div className="flex justify-between text-gray-800">
              <strong>Status:</strong>
              <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(selectedAppointment.status)}`}>
                {selectedAppointment.status}
              </span>
            </div>

            <hr />

            <div>
              <strong>Included Services:</strong>
              <ul className="list-disc pl-5 mt-1 text-gray-700">
                {selectedAppointment.checklist.map((item, i) => (
                  <li key={i}>{item?.text?.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>

  );
};

export default History;
