import React, { useEffect, useState } from "react";
import { fetchPrescriptionReminders, handleMarkAsTaken } from "../../api/prescriptions";
import { useAuth } from "../../login/AuthContext";

export default function PrescriptionReminder() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (user?.patientId) {
      fetchPrescriptionReminders(user.patientId)
        .then((data) => setReminders(data))
        .catch((err) => console.error("Error loading reminders:", err));
    }
  }, [user]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-2">Prescription Reminder</h2>

      {reminders.length === 0 ? (
        <p>No active prescriptions.</p>
      ) : (
        reminders.map((rx) => {
          const nextDoseTime = rx.nextDoseTime
            ? new Date(rx.nextDoseTime).toLocaleString()
            : "N/A";

          const dosesRemaining = rx.totalDoses - rx.dosesTaken;
          const dailyProgress = (rx.dosesTaken / rx.totalDoses) * 100;

          return (
            <div key={rx.prescriptionId} className="mb-4">
              <h3 className="text-xl font-semibold text-[#1d5b91]">
                {rx.medication}
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Next Dose:</span> {nextDoseTime}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Doses Taken:</span> {rx.dosesTaken} / {rx.totalDoses}
              </p>

              {/* Next Dose Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-[#0284c7] h-2.5 rounded-full"
                    style={{ width: `${dailyProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Prescription Progress */}
              <div className="mb-4">
                <p className="text-gray-800">
                  <span className="font-semibold">Prescription Validity:</span>{" "}
                  {dosesRemaining} doses remaining
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-[#2978b5] text-white rounded-full hover:bg-[#1d5b91] transition"
                  onClick={() => handleMarkAsTaken(rx.prescriptionId, user.patientId, setReminders)}
                >
                  Mark as Taken
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}