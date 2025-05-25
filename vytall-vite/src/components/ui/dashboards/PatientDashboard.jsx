import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaPrescription, 
  FaFileMedical, 
  FaHeartbeat,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaUserMd,
  FaPills,
  FaChartLine,
  FaTrophy,
  FaClock,
  FaVideo,
  FaComments,
  FaAmbulance
} from 'react-icons/fa';
import AppointmentsContainer from '../../Appointments/AppointmentsContainer';
import PrescriptionReminder from '../../Prescriptions/PrescriptionReminder';
import MedicalRecordsSummary from '../../medicalRecords/MedicalRecordsSummary';
import TransactionCard from '../../wallet/TransactionCard';
import MedicationAdherence from '../../Gamification/MedicationAdherence';
import { Tabs, Tab, Box, Typography, Paper, CircularProgress, Grid, Card, CardContent, Button, IconButton, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../../../login/AuthContext';
import { fetchPatientById } from '../../../api/patients';
import { fetchAppointmentsForPatient } from '../../../api/appointments';
import { fetchPatientPrescriptions } from '../../../api/prescriptions';
import { fetchMedicalRecordsByPatient } from '../../../api/medicalRecords';
import { fetchMyVitals } from '../../../api/vitals';
import PatientAnalytics from '../../Analytics/PatientAnalytics';
import MedicationAnalytics from '../../Analytics/MedicationAnalytics';
import VideoConsultation from '../../telemedicine/VideoConsultation';
import SecureMessaging from '../../telemedicine/SecureMessaging';
import EmergencyContacts from '../../EmergencyServices/EmergencyContacts';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Reuse StatCard and AlertCard components
function StatCard({ title, value, icon, trend, trendValue, color, link }) {
  const CardContent = (
    <div className={`p-6 rounded-lg shadow-sm ${color} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              {trend === 'up' ? (
                <FaArrowUp className="text-green-500 mr-1" />
              ) : (
                <FaArrowDown className="text-red-500 mr-1" />
              )}
              <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {trendValue}% from last month
              </span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-white/50">
          {icon}
        </div>
      </div>
    </div>
  );

  return link ? (
    <Link to={link} className="block">
      {CardContent}
    </Link>
  ) : CardContent;
}

function AlertCard({ title, message, type, icon }) {
  const bgColor = type === 'warning' ? 'bg-yellow-50' : 'bg-red-50';
  const textColor = type === 'warning' ? 'text-yellow-800' : 'text-red-800';
  const borderColor = type === 'warning' ? 'border-yellow-200' : 'border-red-200';

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Upcoming Appointment Card Component
function UpcomingAppointmentCard({ appointment }) {
  const appointmentTime = new Date(appointment.appointmentTime);
  const formattedTime = appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = appointmentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Dr. {appointment.physicianName}</h3>
          <p className="text-sm text-gray-600">{appointment.reason}</p>
          <p className="text-xs text-gray-500 mt-1">{appointment.location}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formattedTime}</p>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

// Active Prescription Card Component
function ActivePrescriptionCard({ prescription }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{prescription.medication}</h3>
          <p className="text-sm text-gray-600">{prescription.dosage}</p>
          <p className="text-xs text-gray-500 mt-1">Prescribed by Dr. {prescription.prescribingPhysician}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Next Dose: {prescription.nextDoseTime}</p>
          <p className="text-xs text-gray-500 mt-1">Refills: {prescription.remainingRefills}</p>
        </div>
      </div>
    </div>
  );
}

const TelemedicineCard = ({ title, icon, onClick, color = 'primary', description }) => (
  <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={onClick}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <IconButton color={color} size="large">
          {icon}
        </IconButton>
        <Typography variant="h6">{title}</Typography>
      </Box>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function PatientDashboard() {
  const [adherenceRefreshTrigger, setAdherenceRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const patientId = user?.patientId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    medicalRecords: 0,
    recentVitals: 0,
    pendingRefills: 0,
    totalAppointments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [activePrescriptions, setActivePrescriptions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  const [showVideoConsultation, setShowVideoConsultation] = useState(false);
  const [showSecureMessaging, setShowSecureMessaging] = useState(false);
  const [showEmergencyServices, setShowEmergencyServices] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    async function loadPatientInfo() {
      if (!patientId) {
        setError('No patient ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPatientById(patientId);
        setPatientInfo(data);
      } catch (error) {
        setError('Failed to load patient information');
      } finally {
        setLoading(false);
      }
    }
    loadPatientInfo();
  }, [patientId]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          appointments,
          prescriptions,
          medicalRecords,
          vitals
        ] = await Promise.all([
          fetchAppointmentsForPatient(patientId),
          fetchPatientPrescriptions(patientId),
          fetchMedicalRecordsByPatient(patientId),
          fetchMyVitals()
        ]);

        // Get upcoming appointments (next 3)
        const today = new Date();
        const upcoming = appointments
          .filter(app => new Date(app.appointmentTime) > today)
          .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime))
          .slice(0, 3);

        // Get active prescriptions
        const active = prescriptions
          .filter(prescription => prescription.status === "Active")
          .sort((a, b) => new Date(a.nextDoseTime) - new Date(b.nextDoseTime))
          .slice(0, 3);

        // Calculate pending refills
        const pendingRefills = prescriptions.filter(prescription => 
          prescription.status === "Active" && prescription.remainingRefills <= 1
        );

        // Get recent vitals (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentVitals = vitals.filter(vital => 
          new Date(vital.recordedAt) >= thirtyDaysAgo
        );

        setStats({
          upcomingAppointments: upcoming.length,
          activePrescriptions: active.length,
          medicalRecords: medicalRecords.length,
          recentVitals: recentVitals.length,
          pendingRefills: pendingRefills.length,
          totalAppointments: appointments.length,
        });

        setUpcomingAppointments(upcoming);
        setActivePrescriptions(active);

        // Set alerts based on data
        const newAlerts = [];
        if (pendingRefills.length > 0) {
          newAlerts.push({
            title: 'Prescription Refills Needed',
            message: `${pendingRefills.length} prescriptions need refills soon`,
            type: 'warning',
            icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
          });
        }
        if (upcoming.length > 0) {
          const nextAppointment = new Date(upcoming[0].appointmentTime);
          const daysUntil = Math.ceil((nextAppointment - today) / (1000 * 60 * 60 * 24));
          if (daysUntil <= 2) {
            newAlerts.push({
              title: 'Upcoming Appointment',
              message: `You have an appointment with Dr. ${upcoming[0].physicianName} in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
              type: 'warning',
              icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
            });
          }
        }
        setAlerts(newAlerts);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    }

    loadDashboardData();
  }, [patientId]);

  const handleDoseTaken = () => {
    setAdherenceRefreshTrigger(prev => prev + 1);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleStartVideoConsultation = (provider) => {
    setSelectedProvider(provider);
    setShowVideoConsultation(true);
  };

  const handleStartSecureMessaging = (provider) => {
    setSelectedProvider(provider);
    setShowSecureMessaging(true);
  };

  if (!patientId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          No patient ID provided
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="p-6 space-y-8 mb-16">
      <h1 className="text-3xl font-bold mb-4">Welcome, Patient</h1>

      {/* Patient Info Card */}
      {patientInfo && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {patientInfo.name}
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 2,
            mb: 3 
          }}>
            <Typography variant="body1">
              <strong>Email:</strong> {patientInfo.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {patientInfo.phoneNumber}
            </Typography>
            {patientInfo.lastVisit && (
              <Typography variant="body1">
                <strong>Last Visit:</strong> {new Date(patientInfo.lastVisit).toLocaleDateString()}
              </Typography>
            )}
            {/* Additional static info */}
            <Typography variant="body1">
              <strong>Blood Type:</strong> O+
            </Typography>
            <Typography variant="body1">
              <strong>Date of Birth:</strong> 1990-05-15
            </Typography>
            <Typography variant="body1">
              <strong>Allergies:</strong> Penicillin, Peanuts
            </Typography>
            <Typography variant="body1">
              <strong>Primary Physician:</strong> Dr. Emily Rodriguez
            </Typography>
            <Typography variant="body1">
              <strong>Insurance:</strong> Blue Cross Blue Shield
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <AlertCard key={index} {...alert} />
          ))}
        </div>
      )}

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={<FaCalendarAlt className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
          link="/appointments"
        />
        <StatCard
          title="Active Prescriptions"
          value={stats.activePrescriptions}
          icon={<FaPrescription className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
          link="/prescriptions"
        />
        <StatCard
          title="Recent Vitals"
          value={stats.recentVitals}
          icon={<FaHeartbeat className="w-6 h-6 text-red-600" />}
          color="bg-red-50"
          link="/vitals"
        />
        <StatCard
          title="Medical Records"
          value={stats.medicalRecords}
          icon={<FaFileMedical className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
          link="/medical-records"
        />
      </div>

      {/* Appointments and Prescriptions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppointmentsContainer />
        <PrescriptionReminder />
      </div>

      {/* Medication Adherence Section (remove outer title, keep only internal) */}
      <Box sx={{ p: 0 }}>
        <MedicationAdherence />
      </Box>

      {/* Telemedicine Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, textAlign: 'left' }}>
        Telemedicine Services
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TelemedicineCard
            title="Video Consultations"
            icon={<FaVideo />}
            onClick={() => setShowVideoConsultation(true)}
            color="primary"
            description="Connect with your healthcare provider through secure video calls"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TelemedicineCard
            title="Secure Messaging"
            icon={<FaComments />}
            onClick={() => setShowSecureMessaging(true)}
            color="secondary"
            description="Send secure messages to your healthcare team"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TelemedicineCard
            title="Emergency Services"
            icon={<FaAmbulance />}
            onClick={() => setShowEmergencyServices(true)}
            color="error"
            description="Quick access to emergency contacts and services"
          />
        </Grid>
      </Grid>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<FaCalendarAlt className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-50"
          link="/appointments"
        />
        <StatCard
          title="Pending Refills"
          value={stats.pendingRefills}
          icon={<FaPills className="w-6 h-6 text-pink-600" />}
          color="bg-pink-50"
          link="/prescriptions"
        />
        <StatCard
          title="Health Trends"
          value="View"
          icon={<FaChartLine className="w-6 h-6 text-teal-600" />}
          color="bg-teal-50"
          link="/health-trends"
        />
      </div>

      {/* Telemedicine Dialogs */}
      <Dialog
        open={showVideoConsultation}
        onClose={() => setShowVideoConsultation(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          Video Consultation {selectedProvider && `with Dr. ${selectedProvider.physicianName}`}
        </DialogTitle>
        <DialogContent>
          <VideoConsultation />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSecureMessaging}
        onClose={() => setShowSecureMessaging(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Secure Messaging {selectedProvider && `with Dr. ${selectedProvider.physicianName}`}
        </DialogTitle>
        <DialogContent>
          <SecureMessaging />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEmergencyServices}
        onClose={() => setShowEmergencyServices(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Emergency Services</DialogTitle>
        <DialogContent>
          <EmergencyContacts />
        </DialogContent>
      </Dialog>
    </div>
  );
}