import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchPatients } from '../../../api/patients';

export default function PatientSelect({ value, onChange }) {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);

  // Format patient data for the Select component
  const patientOptions = patients.map((p) => ({
    value: String(p.id), // convert id to string for consistency
    label: `${p.name} (ID: ${p.id})`
  }));

  return (
    <Select
      options={patientOptions}
      placeholder="Select Patient"
      value={patientOptions.find(p => p.value === String(value)) || null}
      onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : '')}
      isSearchable
      className="w-full"
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: '#d1d5db', // Tailwind gray-300
        }),
      }}
    />
  );
}