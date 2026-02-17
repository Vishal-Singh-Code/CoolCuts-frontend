const UpcomingAppointments = ({ appointments }) => {
  const today = new Date().toISOString().split("T")[0];

  const upcoming = appointments
    .filter(a => a.appointment_date > today)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h2 className="text-lg font-semibold mb-4">
        Upcoming Appointments
      </h2>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming appointments.</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map(item => (
            <li
              key={item.id}
              className="flex justify-between items-center border-b pb-2 last:border-none"
            >
              <div>
                <p className="font-medium">{item.customer_name}</p>
                <p className="text-sm text-gray-500">
                  {item.selected_services.join(", ")}
                </p>
              </div>
              <span className="text-sm text-gray-600">
                {item.appointment_date}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingAppointments;
