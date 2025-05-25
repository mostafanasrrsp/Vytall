import React, { useEffect, useState } from "react";
import { fetchDiagnoses, addDiagnosis, updateDiagnosis, deleteDiagnosis } from "../../api/diagnoses";
import { useAuth } from "../../login/AuthContext";
import Button from "../ui/Button";
import PatientSelect from "../ui/Forms/PatientSelect";
import AppointmentSelect from "../ui/Forms/AppointmentSelect";
import PhysicianSelect from "../ui/Forms/PhysicianSelect"; // ✅ New import for Admins

export default function DiagnosisManager({ patientId }) {
  const { user } = useAuth();
  const isPhysician = user?.role === "Physician";
  const isAdmin = user?.role === "Admin";

  const [diagnoses, setDiagnoses] = useState([]);
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    appointmentId: "",
    details: "",
    physicianId: isPhysician ? user.physicianId : "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadDiagnoses();
  }, [patientId]);

  const loadDiagnoses = async () => {
    try {
      const data = await fetchDiagnoses();
      // Filter by patientId if provided
      const filteredData = patientId 
        ? data.filter(d => d.patientId === parseInt(patientId))
        : data;
      setDiagnoses(filteredData);
    } catch (error) {
      console.error("Failed to fetch diagnoses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      patientId: parseInt(patientId || formData.patientId, 10),
      appointmentId: formData.appointmentId ? parseInt(formData.appointmentId, 10) : null,
      details: formData.details,
      physicianId: isPhysician ? user.physicianId : parseInt(formData.physicianId, 10),
    };

    try {
      if (editingId) {
        await updateDiagnosis(editingId, dto);
      } else {
        await addDiagnosis(dto);
      }
      resetForm();
      loadDiagnoses();
    } catch (error) {
      console.error("Failed to save diagnosis:", error);
    }
  };

  const handleEdit = (diagnosis) => {
    setFormData({
      patientId: diagnosis.patientId,
      appointmentId: diagnosis.appointmentId || "",
      details: diagnosis.details,
      physicianId: diagnosis.physicianId,
    });
    setEditingId(diagnosis.diagnosisId);
  };

  const handleDelete = async (id) => {
    await deleteDiagnosis(id);
    loadDiagnoses();
  };

  const resetForm = () => {
    setFormData({
      patientId: patientId || "",
      appointmentId: "",
      details: "",
      physicianId: isPhysician ? user.physicianId : "",
    });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Diagnosis" : "Add Diagnosis"}</h2>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {!patientId && (
            <PatientSelect
              value={formData.patientId}
              onChange={(id) => setFormData({ ...formData, patientId: id })}
            />
          )}
          {isAdmin && (
            <PhysicianSelect
              value={formData.physicianId}
              onChange={(id) => setFormData({ ...formData, physicianId: id })}
            />
          )}
          <AppointmentSelect
            value={formData.appointmentId}
            onChange={(id) => setFormData({ ...formData, appointmentId: id })}
            patientId={patientId || formData.patientId}
          />

          <textarea
            placeholder="Diagnosis Details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />

          <Button type="submit" fullWidth>
            {editingId ? "Update Diagnosis" : "Add Diagnosis"}
          </Button>

          {editingId && (
            <Button onClick={resetForm} fullWidth variant="secondary">
              Cancel Edit
            </Button>
          )}
        </form>
        {/* LIST */}
        <div className="space-y-4 w-full">
          {diagnoses.map((diagnosis) => (
            <div
              key={diagnosis.diagnosisId}
              className="p-4 border rounded flex justify-between items-start bg-white shadow-md"
            >
              <div className="space-y-1">
                <p>
                  <strong>Patient:</strong> {diagnosis.patient}
                </p>
                <p>
                  <strong>Physician:</strong> Dr. {diagnosis.physician}
                </p>
                <p>
                  <strong>Appointment ID:</strong> {diagnosis.appointmentId || "N/A"}
                </p>
                <p>
                  <strong>Details:</strong> {diagnosis.details}
                </p>
                <p>
                  <strong>Diagnosed On:</strong> {new Date(diagnosis.diagnosedOn).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(diagnosis)} variant="warning">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(diagnosis.diagnosisId)} variant="danger">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}