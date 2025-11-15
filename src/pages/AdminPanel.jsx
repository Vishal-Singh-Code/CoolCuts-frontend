import { useEffect, useState } from "react";
import apiService from "../services/apiService";

const { getServices, createService, updateService, deleteService } = apiService;

const AdminPanel = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services", error);
      }
    };
    fetchServices();
  }, []);

  const handleCreateService = () => {
    createService(newService)
      .then((response) => {
        setServices([...services, response.data]);
        setNewService({ name: "", price: "" });
      })
      .catch((error) => console.error("Create failed", error));
  };

  const handleUpdateService = () => {
    updateService(editingService.id, editingService)
      .then((response) => {
        setServices(
          services.map((service) =>
            service.id === editingService.id ? response.data : service
          )
        );
        setEditingService(null);
      })
      .catch((error) => console.error("Update failed", error));
  };

  const handleDeleteService = (id) => {
    deleteService(id)
      .then(() => {
        setServices(services.filter((service) => service.id !== id));
      })
      .catch((error) => console.error("Delete failed", error));
  };

  return (
    <div className="container mx-auto max-w-6xl mt-8 px-4">

      <div className="mb-8 text-center">
        <h2 className="sm:text-3xl text-2xl font-bold mb-2">Manage Services</h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
Keep service listings up to date. Create new services, modify pricing, or delete outdated entries.</p>
      </div>

      {/* Add or Edit Service Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          {editingService ? "Edit Service" : "Add New Service"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Service Name"
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-teal-400 outline-none"
            value={editingService ? editingService.name : newService.name}
            onChange={(e) =>
              editingService
                ? setEditingService({ ...editingService, name: e.target.value })
                : setNewService({ ...newService, name: e.target.value })
            }
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-teal-400 outline-none"
            value={editingService ? editingService.price : newService.price}
            onChange={(e) =>
              editingService
                ? setEditingService({ ...editingService, price: e.target.value })
                : setNewService({ ...newService, price: e.target.value })
            }
          />

          {editingService ? (
            <div className="flex gap-2">
              <button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2 font-medium shadow-md transition"
                onClick={handleUpdateService}
              >
                Update
              </button>
              <button
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-3 py-2 font-medium shadow-md transition"
                onClick={() => setEditingService(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-3 py-2 font-semibold shadow-md transition"
              onClick={handleCreateService}
            >
              Add Service
            </button>
          )}
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-100">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{service.name}</td>
                <td className="py-3 px-4">₹{service.price}</td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => setEditingService(service)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow-md text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-md text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
