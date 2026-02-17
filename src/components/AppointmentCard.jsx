import AppointmentChecklist from "./AppointmentChecklist";

const AppointmentCard = ({
    appointment,
    toggleAppointmentStatus,
    toggleChecklistItemStatus,
}) => {
    const isDone = appointment.status?.toLowerCase() === "done";

    const capitalizeName = (name = "") =>
        name
            .trim()
            .split(" ")
            .filter(Boolean)
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    return (
        <li className="text-md sm:text-lg bg-gray-100 border border-gray-300 mb-4 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
            {/* Status Button */}
            <div className="absolute top-2 right-2">
                <button
                    className={`p-2 border border-gray-300 rounded-md ${isDone
                            ? "bg-green-300 hover:bg-green-400"
                            : "bg-yellow-300 hover:bg-yellow-400"
                        }`}
                    onClick={() => toggleAppointmentStatus(appointment.id)}
                >
                    {isDone ? "Done" : "Pending"}
                </button>
            </div>

            {/* Appointment Details */}
            <p className="font-semibold">
                Customer:{" "}
                <span className="text-gray-700">
                    {capitalizeName(appointment.customer_name)}
                </span>
            </p>

            <p className="font-semibold">
                Phone:{" "}
                <span className="text-gray-700">
                    {appointment.phone}
                </span>
            </p>

            <p className="font-semibold">
                Date:{" "}
                <span className="text-gray-700">
                    {formatDate(appointment.appointment_date)}
                </span>
            </p>

            <p className="font-semibold">
                Time:{" "}
                <span className="text-gray-700">
                    {appointment.appointment_time}
                </span>
            </p>

            {/* Checklist */}
            <AppointmentChecklist
                appointment={appointment}
                toggleChecklistItemStatus={toggleChecklistItemStatus}
            />
        </li>
    );
};

export default AppointmentCard;
