const TodayAppointments = ({ appointments }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h2 className="text-lg font-semibold mb-4">
        Today's Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-sm text-gray-500">No appointments today.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Service</th>
              <th className="text-left py-2">Time</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.id} className="border-b last:border-none">
                <td className="py-2">{appt.customer_name}</td>
                <td>{appt.selected_services.join(", ")}</td>
                <td>{appt.appointment_time}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      appt.status === "done"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodayAppointments;
