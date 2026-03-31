import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Filters from "../../components/Filters";
import AppointmentCard from "../../components/AppointmentCard";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState({ search: "", sort: "", status: "" });
  const [actionError, setActionError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user) {
          const response = await api.get(`/api/appointments/`);
          setAppointments(response.data);
          setFilteredAppointments(response.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);


  const applyFilters = useCallback(() => {
    let filtered = [...appointments];

    if (filter.search) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.customer_name
            .toLowerCase()
            .includes(filter.search.toLowerCase()) ||
          appointment.appointment_date.includes(filter.search)
      );
    }

    if (filter.sort === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
      );
    } else if (filter.sort === "newest") {
      filtered.sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
      );
    } else if (filter.sort === "az") {
      filtered.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
    } else if (filter.sort === "za") {
      filtered.sort((a, b) => b.customer_name.localeCompare(a.customer_name));
    }

    if (filter.status) {
      filtered = filtered.filter(
        (appointment) => appointment.status === filter.status
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, filter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setFilter({ search: "", sort: "", status: "" });
  };

  const toggleChecklistItemStatus = async (itemId) => {
    try {
      setActionError("");
      const response = await api.patch(`/api/checklist-items/${itemId}/toggle/`);
      const updatedDone = response.data?.done;

      setAppointments(prev =>
        prev.map(app => ({
          ...app,
          checklist: (app.checklist || []).map(item =>
            item.id === itemId
              ? { ...item, done: typeof updatedDone === "boolean" ? updatedDone : !item.done }
              : item
          ),
        }))
      );
    } catch (error) {
      const message =
        error.response?.status === 403
          ? "Checklist updates are allowed for admin staff only."
          : "Checklist update failed. Please try again.";
      setActionError(message);
    }
  };

  const toggleAppointmentStatus = async (appointmentId) => {
    try {
      const appointment = appointments.find(app => app.id === appointmentId);
      if (!appointment) return;

      const response = await api.patch(`/api/appointments/${appointmentId}/`, {
        status: appointment.status === "pending" ? "done" : "pending",
      });

      setAppointments(prev =>
        prev.map(app => app.id === appointmentId ? response.data : app)
      );
    } catch (error) {
      setActionError(
        error.response?.data?.error || "Appointment status update failed. Please try again."
      );
    }
  };

  if (!user) {
    return (
      <p className="text-center mt-4">Please log in to view appointments.</p>
    );
  }

  return (
    <div className="container mx-auto pt-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="sm:text-3xl text-2xl font-bold mb-2">Appointments</h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
          View, edit, and manage all scheduled appointments.
        </p>
      </div>

      {actionError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {actionError}
        </p>
      )}

      <Filters
        filter={filter}
        setFilter={setFilter}
        resetFilters={resetFilters}
      />

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            toggleAppointmentStatus={toggleAppointmentStatus}
            toggleChecklistItemStatus={toggleChecklistItemStatus}
          />
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
