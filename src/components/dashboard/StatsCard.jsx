const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
};

export default StatsCard;
