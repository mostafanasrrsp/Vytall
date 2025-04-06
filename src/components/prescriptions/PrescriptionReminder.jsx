import React, { useEffect, useState } from "react";
import { fetchPrescriptionReminders, handleMarkAsTaken } from "../../api/prescriptions";
import { useAuth } from "../../login/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaPills, FaClock, FaCheckCircle, FaBell, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function PrescriptionReminder({ onDoseTaken }) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (user?.patientId) {
      setLoading(true);
      fetchPrescriptionReminders(user.patientId)
        .then((data) => {
          setReminders(data);
          setError(null);
          checkNotificationPermission();
        })
        .catch((err) => {
          console.error("Error loading reminders:", err);
          setError("Failed to load prescriptions");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const scheduleNotification = (medication, doseTime) => {
    if (!notificationsEnabled) return;
    
    const timeUntilDose = new Date(doseTime) - new Date();
    if (timeUntilDose > 0) {
      setTimeout(() => {
        new Notification('Medication Reminder', {
          body: `Time to take your ${medication}`,
          icon: '/favicon.ico'
        });
      }, timeUntilDose);
    }
  };

  const handleTakeDose = async (prescriptionId) => {
    try {
      await handleMarkAsTaken(prescriptionId, user.patientId, setReminders);
      onDoseTaken?.(); // Call the callback if provided
    } catch (error) {
      console.error('Error marking dose as taken:', error);
    }
  };

  const getTimeStatus = (nextDoseTime, canTakeDose, timeUntilNextDose) => {
    if (!nextDoseTime) return "scheduled";
    if (canTakeDose) return "ready";
    
    const diffMinutes = timeUntilNextDose;
    
    if (diffMinutes < 0) return "overdue";
    if (diffMinutes < 60) return "soon";
    if (diffMinutes < 24 * 60) return "upcoming";
    return "scheduled";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "overdue": return "text-red-500";
      case "ready": return "text-[#1e5631]";
      case "soon": return "text-orange-500";
      case "upcoming": return "text-[#1d5b91]";
      default: return "text-gray-500";
    }
  };

  const formatTimeUntilNext = (minutes) => {
    if (minutes < 0) return "Overdue";
    if (minutes < 60) return `${Math.round(minutes)} minutes`;
    if (minutes < 24 * 60) return `${Math.round(minutes / 60)} hours`;
    return `${Math.round(minutes / (24 * 60))} days`;
  };

  const convertUTCToLocal = (utcDateString) => {
    if (!utcDateString) return null;
    const date = new Date(utcDateString);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaPills className="mr-2 text-[#1d5b91]" />
          Prescription Reminder
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaPills className="mr-2 text-[#1d5b91]" />
          Prescription Reminder
        </h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FaPills className="mr-2 text-[#1d5b91]" />
          Prescription Reminder
        </h2>
        <button
          onClick={checkNotificationPermission}
          className={`flex items-center px-3 py-1 rounded-full text-sm ${
            notificationsEnabled 
              ? 'bg-[#1e5631]/10 text-[#1e5631]' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <FaBell className="mr-1" />
          {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
        </button>
      </div>

      {reminders.length === 0 ? (
        <p className="text-gray-500 italic">No active prescriptions.</p>
      ) : (
        <div className="space-y-4">
          {reminders.map((rx) => {
            const nextDoseTime = rx.nextDoseTime
              ? convertUTCToLocal(rx.nextDoseTime)
              : null;
            const timeStatus = getTimeStatus(rx.nextDoseTime, rx.canTakeDose, rx.timeUntilNextDose);
            const statusColor = getStatusColor(timeStatus);
            const dosesRemaining = rx.totalDoses - rx.dosesTaken;
            const progress = (rx.dosesTaken / rx.totalDoses) * 100;
            const isExpanded = expandedId === rx.prescriptionId;

            // Schedule notification for next dose using local time
            if (nextDoseTime && notificationsEnabled) {
              scheduleNotification(rx.medication, nextDoseTime);
            }

            return (
              <motion.div
                key={rx.prescriptionId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Progress Circle */}
                  <div className="w-16 h-16 flex-shrink-0">
                    <CircularProgressbar
                      value={progress}
                      text={`${rx.dosesTaken}/${rx.totalDoses}`}
                      styles={buildStyles({
                        textSize: '1rem',
                        pathColor: timeStatus === 'overdue' ? '#ef4444' : '#1e5631',
                        textColor: '#1d5b91',
                        trailColor: '#e5e7eb',
                      })}
                    />
                  </div>

                  {/* Medication Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1d5b91] flex items-center">
                      {rx.medication}
                      {timeStatus === "ready" && (
                        <FaBell className="ml-2 text-[#1e5631]" />
                      )}
                      {timeStatus === "soon" && (
                        <FaBell className="ml-2 text-orange-500 animate-pulse" />
                      )}
                    </h3>
                    <div className="flex items-center mt-1">
                      <FaClock className={`mr-2 ${statusColor}`} />
                      <p className={`${statusColor}`}>
                        {rx.canTakeDose 
                          ? "Ready to take"
                          : `Next: ${formatTimeUntilNext(rx.timeUntilNextDose)} (${nextDoseTime?.toLocaleTimeString()})`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Take Dose Button */}
                  <button
                    className={`px-4 py-2 rounded-full flex items-center transition-colors ${
                      rx.canTakeDose
                        ? "bg-[#1e5631] text-white hover:bg-[#1e5631]/90"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (rx.canTakeDose) {
                        handleTakeDose(rx.prescriptionId);
                      }
                    }}
                    disabled={!rx.canTakeDose}
                  >
                    <FaCheckCircle className="mr-2" />
                    Take Dose
                  </button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <FaPills className="mr-2 text-[#1d5b91]" />
                          <div>
                            <p className="text-gray-600">Dosage</p>
                            <p className="font-medium">{rx.dosage}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-[#1d5b91]" />
                          <div>
                            <p className="text-gray-600">Frequency</p>
                            <p className="font-medium">{rx.frequency}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-[#1d5b91]" />
                          <div>
                            <p className="text-gray-600">Start Date</p>
                            <p className="font-medium">
                              {new Date(rx.issuedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaChartLine className="mr-2 text-[#1d5b91]" />
                          <div>
                            <p className="text-gray-600">Adherence Rate</p>
                            <p className="font-medium">
                              {Math.round((rx.dosesTaken / rx.totalDoses) * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>
                      {rx.missedDoses > 0 && (
                        <div className="mt-4 p-3 bg-orange-100 text-orange-700 rounded-lg">
                          <p className="font-medium">
                            {rx.missedDoses} missed {rx.missedDoses === 1 ? "dose" : "doses"}
                          </p>
                          <p className="text-sm">
                            Try to take your medication as prescribed to maintain effectiveness.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : rx.prescriptionId)}
                  className="w-full mt-2 text-center text-gray-500 hover:text-[#1d5b91]"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}