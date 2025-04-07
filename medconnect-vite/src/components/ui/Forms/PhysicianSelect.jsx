import React, { useEffect, useState } from "react";
import Select from "react-select";
import { fetchPhysicians } from "../../../api/physicians";

export default function PhysicianSelect({ value, onChange }) {
  const [physicians, setPhysicians] = useState([]);

  // Fetch all physicians
  useEffect(() => {
    fetchPhysicians()
      .then((data) => {
        const formattedOptions = data.map((p) => ({
          value: String(p.id), // Convert to string for consistency
          label: `Dr. ${p.name}`, // Assuming these fields exist
        }));
        setPhysicians(formattedOptions);
      })
      .catch((error) => console.error("Failed to fetch physicians:", error));
  }, []);

  return (
    <Select
      options={physicians}
      placeholder="Select Physician"
      value={physicians.find((p) => p.value === String(value)) || null}
      onChange={(selected) => onChange(selected ? selected.value : "")}
      isClearable
      className="w-full"
    />
  );
}