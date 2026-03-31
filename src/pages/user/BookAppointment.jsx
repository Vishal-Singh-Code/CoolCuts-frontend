import "../../styles/styles.css";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import BookingModal from "../../components/BookingModal";

const getBookingErrorMessage = (err) => {
  const payload = err?.response?.data;
  if (!payload) return "Booking failed";
  if (typeof payload === "string" && payload.trim()) return payload;
  if (typeof payload.detail === "string" && payload.detail.trim()) return payload.detail;
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  if (Array.isArray(payload.non_field_errors) && payload.non_field_errors.length > 0) {
    return String(payload.non_field_errors[0]);
  }
  if (Array.isArray(payload.services) && payload.services.length > 0) {
    return String(payload.services[0]);
  }
  const firstKey = Object.keys(payload)[0];
  const firstValue = payload[firstKey];
  if (typeof firstValue === "string" && firstValue.trim()) return firstValue;
  if (Array.isArray(firstValue) && firstValue.length > 0) return String(firstValue[0]);
  return "Booking failed";
};

const BookAppointment = () => {
  const navigate = useNavigate();

  const [appointmentData, setAppointmentData] = useState({
    appointment_date: "",
    appointment_time: "",
    services: [],
  });

  const [services, setServices] = useState([]);
  const [serviceSearch, setServiceSearch] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.get("/api/services/")
      .then((res) => setServices(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!appointmentData.appointment_date) return;

    setLoadingSlots(true);
    api.get(
      `/api/appointments/available-slots/?date=${appointmentData.appointment_date}`
    )
      .then((res) => setAvailableSlots(res.data))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [appointmentData.appointment_date]);

  const addService = (id) => {
    setAppointmentData((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services
        : [...prev.services, id],
    }));
  };

  const removeService = (id) => {
    setAppointmentData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== id),
    }));
  };

  const selectedServices = useMemo(() => {
    const set = new Set(appointmentData.services);
    return services.filter((s) => set.has(s.id));
  }, [appointmentData.services, services]);

  const searchableServices = useMemo(() => {
    const set = new Set(appointmentData.services);
    const q = serviceSearch.toLowerCase().trim();

    return services
      .filter((s) => !set.has(s.id))
      .filter((s) => s.name.toLowerCase().includes(q));
  }, [appointmentData.services, serviceSearch, services]);

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price, 0),
    [selectedServices]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await api.post("/api/appointments/book/", appointmentData);

      const res = await api.get(
        `/api/appointments/available-slots/?date=${appointmentData.appointment_date}`
      );
      setAvailableSlots(res.data);

      setIsModalOpen(true);
    } catch (err) {
      setError(getBookingErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate("/");
        }}
        message={`Appointment booked on ${appointmentData.appointment_date} at ${appointmentData.appointment_time}`}
      />

      <main className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="surface-card p-5 sm:p-8 space-y-6 rounded-2xl"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Book Appointment
              </h2>
              <p className="text-sm text-gray-500">
                Choose date, time and services
              </p>
            </div>

            {error && (
              <p className="text-sm bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                {error}
              </p>
            )}

            <section className="space-y-3">
              <h3 className="font-semibold">1. Date & Time</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  min={minDate}
                  value={appointmentData.appointment_date}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      appointment_date: e.target.value,
                    })
                  }
                  className="input"
                />

                <select
                  value={appointmentData.appointment_time}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      appointment_time: e.target.value,
                    }))
                  }
                  className="input"
                  disabled={!appointmentData.appointment_date || loadingSlots}
                >
                  <option value="">
                    {loadingSlots ? "Loading slots..." : "Select time"}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {appointmentData.appointment_time && (
                <p className="text-xs text-green-700">
                  Selected slot: {appointmentData.appointment_time}
                </p>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold">2. Services</h3>

              <input
                type="text"
                placeholder="Search services..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="input"
              />

              {selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => removeService(s.id)}
                      className="px-3 py-1.5 rounded-full text-sm bg-[var(--brand-soft)] text-[var(--brand-strong)] font-medium"
                    >
                      {s.name} - Rs {s.price} x
                    </button>
                  ))}
                </div>
              )}

              <div className="border border-gray-300 rounded-xl max-h-56 overflow-y-auto">
                {searchableServices.length === 0 ? (
                  <p className="text-sm text-center p-4 text-gray-500">
                    No services found
                  </p>
                ) : (
                  searchableServices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => addService(s.id)}
                      className="w-full px-4 py-3 flex justify-between hover:bg-gray-50 text-left"
                    >
                      <span>{s.name}</span>
                      <span className="font-semibold">
                        Rs {s.price}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold">3. Review</h3>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-1 text-sm">
                <p>Date: <strong>{appointmentData.appointment_date || "-"}</strong></p>
                <p>Time: <strong>{appointmentData.appointment_time || "-"}</strong></p>
                <p>Services: <strong>{selectedServices.length}</strong></p>
                <p className="text-lg font-bold mt-2">
                  Total: Rs {totalPrice}
                </p>
              </div>
            </section>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={
                submitting ||
                !appointmentData.appointment_date ||
                !appointmentData.appointment_time ||
                appointmentData.services.length === 0
              }
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default BookAppointment;
