import React, { useEffect, useState } from "react";
import Select from "react-select";
import { 
  fetchMedicalRecords, 
  fetchMedicalRecordsByPatient, 
  addMedicalRecord, 
  updateMedicalRecord, 
  deleteMedicalRecord 
} from "../../api/medicalRecords";
import { fetchPhysicians } from "../../api/physicians";
import { fetchPatients } from "../../api/patients";
import { useAuth } from "../../login/AuthContext";
import Button from "../ui/Button";
import PatientSelect from "../ui/Forms/PatientSelect";

export default function MedicalRecordsManager() {
  const { user } = useAuth();
  const isPatient = user?.role === "Patient";
  const isPhysician = user?.role === "Physician";
  const isAdmin = user?.role === "Admin";

  // State for records, physician options, and a patient map for display
  const [records, setRecords] = useState([]);
  const [physicianOptions, setPhysicianOptions] = useState([]);
  const [patientMap, setPatientMap] = useState({});

  // Form state (using strings for IDs)
  const [formData, setFormData] = useState({
    patientId: isPatient ? String(user.patientId) : "",
    physicianId: isPhysician ? String(user.physicianId) : "",
    physicianName: "",
    recordType: "",
    details: "",
    recordDate: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // For patients, load only their own records.
    if (isPatient) {
      loadRecordsForPatient();
    } else {
      loadRecords();
    }
    // For non-patient users, load the full patient map.
    if (!isPatient) loadPatients();
    // For Admins, load the physician options.
    if (isAdmin|| isPatient) loadPhysicians();
  }, [isPatient, isAdmin]);

  async function loadRecords() {
    try {
      const data = await fetchMedicalRecords();
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    }
  }

  async function loadRecordsForPatient() {
    try {
      const data = await fetchMedicalRecordsByPatient(user.patientId);
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch patient records:", error);
    }
  }

  async function loadPhysicians() {
    try {
      const data = await fetchPhysicians();
      // Format options (convert IDs to strings)
      const options = data.map((phys) => ({
        value: String(phys.id),
        label: `Dr. ${phys.name}`,
      }));
      // Add an "Other" option
      options.push({ value: "other", label: "Other (Manual Entry)" });
      setPhysicianOptions(options);
    } catch (error) {
      console.error("Failed to fetch physicians:", error);
    }
  }

  async function loadPatients() {
    try {
      const data = await fetchPatients();
      const map = data.reduce((acc, p) => {
        acc[String(p.id)] = p.name;
        return acc;
      }, {});
      setPatientMap(map);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dto = {
      medicalRecordId: editingId || 0,
      patientId: isPatient ? Number(user.patientId) : parseInt(formData.patientId, 10),
      // For physicians, auto-assign from auth; for Admin/Patient, if a selection exists and is not "other", parse it.
      physicianId: isPhysician
        ? Number(user.physicianId)
        : formData.physicianId && formData.physicianId !== "other"
          ? parseInt(formData.physicianId, 10)
          : null,
      // If "other" is selected, use the manually entered physician name.
      physicianName: !isPhysician && formData.physicianId === "other" ? formData.physicianName : null,
      recordType: formData.recordType,
      details: formData.details,
      recordDate: formData.recordDate ? new Date(formData.recordDate).toISOString() : null,
    };

    try {
      if (editingId) {
        await updateMedicalRecord(editingId, dto);
      } else {
        await addMedicalRecord(dto);
      }
      resetForm();
      // Reload records based on role
      isPatient ? loadRecordsForPatient() : loadRecords();
    } catch (error) {
      console.error("Error saving medical record:", error);
    }
  }

  function handleEdit(record) {
    setEditingId(record.medicalRecordId);
    // Determine the physician selection value: if a numeric ID exists, use that; otherwise, use "other"
    const physValue = record.physicianId ? String(record.physicianId) : "other";
    setFormData({
      patientId: String(record.patientId),
      recordType: record.recordType,
      details: record.details,
      recordDate: record.recordDate ? record.recordDate.slice(0, 10) : "",
      physicianId: physValue,
      physicianName: physValue === "other" ? record.physicianName || "" : ""
    });
  }

  async function handleDelete(id) {
    try {
      await deleteMedicalRecord(id);
      isPatient ? loadRecordsForPatient() : loadRecords();
    } catch (error) {
      console.error("Error deleting medical record:", error);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      patientId: isPatient ? String(user.patientId) : "",
      physicianId: isPhysician ? String(user.physicianId) : "",
      physicianName: "",
      recordType: "",
      details: "",
      recordDate: ""
    });
  }

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Medical Record" : "Add Medical Record"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
        {/* Show PatientSelect only for non-patients */}
        {!isPatient && (
          <PatientSelect
            value={formData.patientId}
            onChange={(id) => setFormData({ ...formData, patientId: id })}
          />
        )}

        {/* Physician selection is available for Admins and Patients */}
        {(isAdmin || user.role.includes("Patient")) && (
          <>
            <Select
              options={[...physicianOptions]}
              placeholder="Select Physician"
              // If a manual entry was chosen, show "Other" with the physicianName
              value={
                formData.physicianId === "other"
                  ? { value: "other", label: formData.physicianName || "Other (Manual Entry)" }
                  : physicianOptions.find(opt => opt.value === formData.physicianId) || null
              }
              onChange={(selected) => {
                if (!selected) {
                  setFormData({ ...formData, physicianId: "", physicianName: "" });
                } else if (selected.value === "other") {
                  setFormData({ ...formData, physicianId: "other", physicianName: "" });
                } else {
                  setFormData({ ...formData, physicianId: selected.value, physicianName: null });
                }
              }}
              className="w-full"
              isClearable
            />

            {/* If "Other" is selected, show an input to manually enter the physician name */}
            {formData.physicianId === "other" && (
              <input
                type="text"
                placeholder="Enter Physician Name"
                value={formData.physicianName || ""}
                onChange={(e) => setFormData({ ...formData, physicianName: e.target.value })}
                className="w-full p-2 border rounded mt-2"
                required
              />
            )}
          </>
        )}

        <input
          type="text"
          placeholder="Record Type (e.g., Lab Report, X-Ray, Note)"
          value={formData.recordType}
          onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Details"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <label className="block text-gray-700 font-medium">
          Record Date (optional):
          <input
            type="date"
            value={formData.recordDate}
            onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <Button type="submit" fullWidth>
          {editingId ? "Update Record" : "Add Record"}
        </Button>
        {editingId && (
          <Button onClick={resetForm} fullWidth variant="secondary">
            Cancel Edit
          </Button>
        )}
      </form>

      {/* LIST OF RECORDS */}
      <div className="space-y-4 w-full">
        {records.length === 0 ? (
          <p className="text-gray-500 text-center">No medical records found.</p>
        ) : (
          records.map((record) => (
            <div
              key={record.medicalRecordId}
              className="p-4 border rounded flex justify-between items-start bg-white shadow-md"
            >
              <div className="space-y-1">
              {!isPatient && (
  <p>
    <strong>Patient:</strong>{" "}
    {record.patientName || `ID: ${record.patientId}`}
  </p>
)}
                <p>
                  <strong>Physician:</strong>{" "}
                  {record.physicianName
                    ? `${record.physicianName}`
                    : record.physicianId
                    ? `ID: ${record.physicianId}`
                    : "Not Assigned"}
                </p>
                <p>
                  <strong>Record Type:</strong> {record.recordType}
                </p>
                <p>
                  <strong>Details:</strong> {record.details}
                </p>
                {record.recordDate && (
                  <p>
                    <strong>Record Date:</strong>{" "}
                    {new Date(record.recordDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(record)} variant="warning">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(record.medicalRecordId)} variant="danger">
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}