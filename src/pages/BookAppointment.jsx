import "../styles/styles.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import api from "../services/api"; // Make sure you're using this
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";

const API_URL = import.meta.env.VITE_API_URL;

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [appointmentData, setAppointmentData] = useState({
    user: user ? user.id : "",
    phone:"",
    appointment_date: "",
    appointment_time: "",
    checklist: [],
  });

  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services/`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      ["00", "30"].forEach((min) => {
        const t = new Date(`2000-01-01T${hour}:${min}`);
        slots.push(
          t.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleChecklistChange = (service) => {
    setAppointmentData((prev) => {
      const exists = prev.checklist.some((s) => s.text.id === service.id);
      return {
        ...prev,
        checklist: exists
          ? prev.checklist.filter((s) => s.text.id !== service.id)
          : [...prev.checklist, { text: service }],
      };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentData.appointment_date || !appointmentData.appointment_time) {
      setError("Date and Time are required.");
      return;
    }

    if (appointmentData.checklist.length === 0) {
      setError("Please select at least one service.");
      return;
    }

    try {
      await api.post(`/api/appointments/`, appointmentData);

      setError("");
      setIsModalOpen(true);
      setAppointmentData({
        user: user ? user.id : "",
        phone:"",
        appointment_date: "",
        appointment_time: "",
        checklist: [],
      });

    } catch (error) {
      console.error("Booking Error:", error);
      setError("This time slot is already booked or you're not logged in.");
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
        message="Your appointment has been successfully booked!"
      />

      {/* Header */}
      <ul style={{ backgroundColor: '#121212' }} className="flex items-center justify-between bg-gray-800 p-3">
        <li>
          <button
            className="text-white text-xl flex items-center"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              className="fill-current"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M14.41 7.41L13 6l-6 6 6 6 1.41-1.41L9.83 12z" />
            </svg>
          </button>
        </li>
        <li>
          <Link to="/" className="text-white text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z"></path>
            </svg>

          </Link>
        </li>
      </ul>

      {/* Main area */}
      <main className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-6"
        >
          <div className="text-center mb-6">

            <h2 className="text-3xl font-bold text-gray-900 flex justify-center items-center gap-2 m-2">
              Book Appointment
            </h2>
            <p className="text-sm text-gray-600 ">
              schedule your visit by picking a date, time, and services.
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-300 p-2 rounded">
              {error}
            </p>
          )}
          {/*Phone Input*/}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Contact No.</label>
            <input 
              type="text"
              value={appointmentData.phone}
              onChange={(e) =>{
                setAppointmentData({ ...appointmentData, phone: e.target.value})
              }}
                className="w-full border rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-teal-400"

               />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Date</label>
            <input
              type="date"
              min={minDate}
              value={appointmentData.appointment_date}
              onChange={(e) =>
                setAppointmentData({ ...appointmentData, appointment_date: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Time</label>
            <select
              value={appointmentData.appointment_time}
              onChange={(e) =>
                setAppointmentData({ ...appointmentData, appointment_time: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-400"
            >
              <option value="">Choose a time slot</option>
              {timeSlots.map((slot, idx) => (
                <option key={idx} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Services */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Services</label>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => {
                const selected = appointmentData.checklist.some((s) => s.text.id === service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleChecklistChange(service)}
                    className={`cursor-pointer border rounded-lg p-3 text-center transition 
                    ${selected ? "bg-teal-100 border-teal-400" : "hover:bg-gray-100"}`}
                  >
                    {service.name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium"
          >
            Confirm Booking
          </button>
        </form>
      </main>
    </>
  );
};

export default BookAppointment;
