import { useEffect, useState } from "react";
import api from "../services/api";

export const useAdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/appointments/")
      .then(res => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { appointments, loading };
};
