import { APPOINTMENT_STATUS } from './appointmentStatusService';
import { sendUpcomingAppointmentReminders, sendUpcomingMedicationReminders } from '../api/notifications';

// Check if browser supports notifications
const isNotificationSupported = 'Notification' in window;

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported) {
    console.warn('Notifications are not supported in this browser');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Send notification
export const sendNotification = (title, options = {}) => {
  if (!isNotificationSupported || Notification.permission !== 'granted') {
    console.warn('Notifications are not supported or permission not granted');
    return;
  }

  try {
    new Notification(title, {
      icon: '/assets/Vytall_logo.png',
      ...options
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Handle appointment status change notifications
export const handleAppointmentStatusChange = (appointment, previousStatus) => {
  const messages = {
    [APPOINTMENT_STATUS.IN_PROGRESS]: {
      title: 'Appointment Starting',
      body: `Your appointment with ${appointment.physicianName} is starting now.`
    },
    [APPOINTMENT_STATUS.COMPLETED]: {
      title: 'Appointment Completed',
      body: `Your appointment with ${appointment.physicianName} has been completed.`
    },
    [APPOINTMENT_STATUS.MISSED]: {
      title: 'Missed Appointment',
      body: `You missed your appointment with ${appointment.physicianName}.`
    }
  };

  const notification = messages[appointment.status];
  if (notification) {
    sendNotification(notification.title, {
      body: notification.body,
      tag: `appointment-${appointment.appointmentId}`,
      data: { appointmentId: appointment.appointmentId }
    });
  }
};

// Check for upcoming appointments and send reminders
export const checkUpcomingAppointments = (appointments) => {
  const now = new Date();
  appointments.forEach(appointment => {
    const appTime = new Date(appointment.appointmentTime);
    const timeDiff = appTime - now;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Send reminder 24 hours before
    if (minutesDiff === 24 * 60) {
      sendNotification('Appointment Reminder', {
        body: `You have an appointment with ${appointment.physicianName} tomorrow at ${appTime.toLocaleTimeString()}.`,
        tag: `appointment-reminder-24h-${appointment.appointmentId}`
      });
    }

    // Send reminder 1 hour before
    if (minutesDiff === 60) {
      sendNotification('Upcoming Appointment', {
        body: `You have an appointment with ${appointment.physicianName} in 1 hour.`,
        tag: `appointment-reminder-1h-${appointment.appointmentId}`
      });
    }

    // Send reminder 15 minutes before
    if (minutesDiff === 15) {
      sendNotification('Appointment Soon', {
        body: `Your appointment with ${appointment.physicianName} starts in 15 minutes.`,
        tag: `appointment-reminder-15m-${appointment.appointmentId}`
      });
    }
  });
};

// Start monitoring appointments for notifications
export const startNotificationMonitoring = (appointments = []) => {
  // Request permission when starting monitoring
  requestNotificationPermission();

  // Check for upcoming appointments every minute
  const intervalId = setInterval(() => {
    checkUpcomingAppointments(appointments);
  }, 60000);

  // Return cleanup function
  return () => clearInterval(intervalId);
};

// Fetch and display backend appointment reminders
export async function fetchAndNotifyAppointmentReminders() {
  try {
    const res = await sendUpcomingAppointmentReminders();
    if (res.notifications && Array.isArray(res.notifications)) {
      res.notifications.forEach(msg => {
        sendNotification('Appointment Reminder', { body: msg });
      });
    }
  } catch (error) {
    console.error('Error fetching appointment reminders:', error);
  }
}

// Fetch and display backend medication reminders
export async function fetchAndNotifyMedicationReminders() {
  try {
    const res = await sendUpcomingMedicationReminders();
    if (res.notifications && Array.isArray(res.notifications)) {
      res.notifications.forEach(msg => {
        sendNotification('Medication Reminder', { body: msg });
      });
    }
  } catch (error) {
    console.error('Error fetching medication reminders:', error);
  }
} 