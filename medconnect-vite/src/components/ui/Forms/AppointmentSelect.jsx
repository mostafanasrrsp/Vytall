import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const API_BASE_URL = "https://localhost:5227/api";

export default function AppointmentSelect({ value, onChange }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/appointments/available-for-diagnosis`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => {
        console.log("API Response:", response.data); // 🔍 Debugging
        const formattedAppointments = response.data.map((a) => ({
          value: a.id,
          label: `${a.appointmentTime} - ${a.patientName} (${a.physicianName})`,
        }));
        setAppointments(formattedAppointments);
      })
      .catch((error) => console.error("Failed to fetch appointments:", error));
  }, []);

  return (
    <Select
      options={appointments}
      value={appointments.find((a) => a.value === value) || null}
      onChange={(selected) => onChange(selected ? selected.value : "")}
      placeholder="Select Appointment"
      isClearable
      isLoading={appointments.length === 0} // 🔄 Show loading indicator
    />
  );
}