import axios from 'axios';

export async function sendUpcomingAppointmentReminders() {
  const res = await axios.post('/api/notifications/send-upcoming-appointment-reminders');
  return res.data;
}

export async function sendUpcomingMedicationReminders() {
  const res = await axios.post('/api/notifications/send-upcoming-medication-reminders');
  return res.data;
} 