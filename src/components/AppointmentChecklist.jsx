const AppointmentChecklist = ({
  appointment,
  toggleChecklistItemStatus,
}) => {
  if (
    !appointment?.checklist ||
    !Array.isArray(appointment.checklist) ||
    appointment.checklist.length === 0
  ) {
    return (
      <p className="italic text-gray-500 mt-2">
        No checklist items assigned
      </p>
    );
  }

  const isCompleted = appointment.status === "done";

  return (
    <div className="mt-2">
      <p className="font-semibold">Checklist:</p>

      <ul className="grid grid-cols-2 gap-2 mt-2">
        {appointment.checklist.map((item) => (
          <li key={item.id} className="flex items-center py-1">
            <input
              type="checkbox"
              disabled={isCompleted}
              checked={item.done}
              onChange={() => toggleChecklistItemStatus(item.id)}
              className="mr-2"
            />

            <span
              className={
                item.done
                  ? "line-through text-gray-500"
                  : "text-gray-700"
              }
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentChecklist;
