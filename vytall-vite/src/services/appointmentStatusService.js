import { updateAppointment } from '../api/appointments';

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  MISSED: 'Missed'
};

export const getAppointmentStatus = (appointmentTime) => {
  const now = new Date();
  const appTime = new Date(appointmentTime);
  const timeDiff = appTime - now;
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));

  if (minutesDiff < -30) return APPOINTMENT_STATUS.COMPLETED;
  if (minutesDiff < 0) return APPOINTMENT_STATUS.IN_PROGRESS;
  return APPOINTMENT_STATUS.SCHEDULED;
};

export const updateAppointmentStatus = async (appointment) => {
  const currentStatus = getAppointmentStatus(appointment.appointmentTime);
  
  // Only update if the status has changed
  if (currentStatus !== appointment.status) {
    try {
      const updatedAppointment = {
        ...appointment,
        status: currentStatus
      };
      
      await updateAppointment(appointment.appointmentId, updatedAppointment);
      return updatedAppointment;
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      throw error;
    }
  }
  
  return appointment;
};

export const startAppointmentStatusMonitoring = (appointments = [], onStatusChange) => {
  // Check and update status every minute
  const intervalId = setInterval(async () => {
    try {
      for (const appointment of appointments) {
        const updatedAppointment = await updateAppointmentStatus(appointment);
        if (updatedAppointment.status !== appointment.status) {
          onStatusChange?.(updatedAppointment);
        }
      }
    } catch (error) {
      console.error('Error in appointment status monitoring:', error);
    }
  }, 60000); // Check every minute

  // Return cleanup function
  return () => clearInterval(intervalId);
};

export const checkMissedAppointments = (appointments) => {
  const now = new Date();
  return appointments.map(appointment => {
    const appTime = new Date(appointment.appointmentTime);
    const timeDiff = now - appTime;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // If appointment is more than 30 minutes past and still in Scheduled status
    if (minutesDiff > 30 && appointment.status === APPOINTMENT_STATUS.SCHEDULED) {
      return {
        ...appointment,
        status: APPOINTMENT_STATUS.MISSED
      };
    }
    return appointment;
  });
}; 