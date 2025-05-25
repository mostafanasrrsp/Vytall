// src/components/ui/dashboards/PhysicianDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUserInjured, 
  FaStethoscope, 
  FaPrescription,
  FaChartLine,
  FaFileMedical,
  FaClock,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaTrophy,
  FaHospital,
  FaNotesMedical,
  FaUserMd,
  FaClipboardList,
  FaHistory,
  FaVial,
  FaVideo,
  FaComments,
  FaPhone,
  FaAmbulance
} from 'react-icons/fa';
import { useAuth } from '../../../login/AuthContext';
import * as physiciansApi from '../../../api/physicians';
console.log('physiciansApi:', physiciansApi);
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Import management components
import AppointmentsManager from '../../appointments/AppointmentsManager';
import PrescriptionsManager from '../../prescriptions/PrescriptionsManager';
import DiagnosesManager from '../../Diagnosis/DiagnosesManager';
import MedicalRecordsManager from '../../medicalRecords/MedicalRecordsManager';
import PatientProfile from '../../Patients/PatientProfile';
import PhysicianPatientList from '../../Physicians/PhysicianPatientList';

// Import analytics components
import PatientAnalytics from '../../Analytics/PatientAnalytics';
import AppointmentAnalytics from '../../Analytics/AppointmentAnalytics';
import PatientAgeDistributionChart from '../../Analytics/PatientAgeDistributionChart';
import DiagnosisDistributionChart from '../../Analytics/DiagnosisDistributionChart';

// Import API functions
import { fetchPatients } from '../../../api/patients';
import { fetchAppointments } from '../../../api/appointments';
import { fetchPrescriptions } from '../../../api/prescriptions';
import { fetchDiagnoses } from '../../../api/diagnoses';
import { fetchMedicalRecords } from '../../../api/medicalRecords';

// Import specialization dashboards
import CardiologyDashboard from '../../specializations/CardiologyDashboard';
import DermatologyDashboard from '../../specializations/DermatologyDashboard';
import EmergencyMedicineDashboard from '../../specializations/EmergencyMedicineDashboard';
import InternalMedicineDashboard from '../../specializations/InternalMedicineDashboard';
import NeurologyDashboard from '../../specializations/NeurologyDashboard';
import ObGynDashboard from '../../specializations/ObGynDashboard';
import OrthopedicsDashboard from '../../specializations/OrthopedicsDashboard';
import PediatricsDashboard from '../../specializations/PediatricsDashboard';
import PsychiatryDashboard from '../../specializations/PsychiatryDashboard';
import GeneralPracticeDashboard from '../../specializations/GeneralPracticeDashboard';

// Import VideoConsultation component
import VideoConsultation from '../../telemedicine/VideoConsultation';
import SecureMessaging from '../../telemedicine/SecureMessaging';

// Import EmergencyContacts component
import EmergencyContacts from '../../EmergencyServices/EmergencyContacts';

// Import TelemedicineDashboard component
import TelemedicineDashboard from '../../telemedicine/TelemedicineDashboard';

// Specialization dashboard mapping
const specializationDashboards = {
  'Cardiology': CardiologyDashboard,
  'Dermatology': DermatologyDashboard,
  'Emergency Medicine': EmergencyMedicineDashboard,
  'Internal Medicine': InternalMedicineDashboard,
  'Neurology': NeurologyDashboard,
  'Obstetrics and Gynecology': ObGynDashboard,
  'Orthopedics': OrthopedicsDashboard,
  'Pediatrics': PediatricsDashboard,
  'Psychiatry': PsychiatryDashboard,
  'General Practitioner': GeneralPracticeDashboard
};

// Update QuickActionButton to use proper navigation
function QuickActionButton({ icon, label, onClick, color = 'blue', to }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={icon}
      onClick={handleClick}
      className={`text-${color}-600 border-${color}-200 hover:bg-${color}-50`}
      sx={{ m: 0.5 }}
    >
      {label}
    </Button>
  );
}

// Reuse existing StatCard and AlertCard components
function StatCard({ title, value, icon, trend, trendValue, color, link }) {
  const CardContent = (
    <div className={`p-6 rounded-lg shadow-sm ${color} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex flex-col items-start min-h-[3.5rem] justify-center">
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
            {trend ? (
              <div className="flex items-center text-sm mt-1">
                {trend === 'up' ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {trendValue}% from last month
                </span>
              </div>
            ) : (
              <div className="opacity-0 mt-1 text-sm">placeholder</div>
            )}
          </div>
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

const TelemedicineCard = ({ title, icon, onClick, color = 'primary' }) => (
  <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={onClick}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton color={color} size="large">
          {icon}
        </IconButton>
        <Typography variant="h6">{title}</Typography>
      </Box>
    </CardContent>
  </Card>
);

// Update the container styles
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '100%',
  margin: '0 auto',
  marginBottom: theme.spacing(8),
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

export default function PhysicianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [physicianInfo, setPhysicianInfo] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    activePrescriptions: 0,
    pendingDiagnoses: 0,
    totalAppointments: 0,
    facilityPatients: 0
  });
  const [alerts, setAlerts] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);
  const [chronicConditions, setChronicConditions] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showVideoConsultation, setShowVideoConsultation] = useState(false);
  const [showSecureMessaging, setShowSecureMessaging] = useState(false);
  const [showEmergencyServices, setShowEmergencyServices] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.physicianId) {
        setError('No physician ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [
          physicianData,
          patients,
          appointments,
          prescriptions,
          diagnoses,
          medicalRecords
        ] = await Promise.all([
          physiciansApi.fetchPhysicianById(user.physicianId),
          fetchPatients(),
          fetchAppointments(),
          fetchPrescriptions(user.physicianId),
          fetchDiagnoses(),
          fetchMedicalRecords()
        ]);

        setPhysicianInfo(physicianData);
        
        // Set initial specialization
        if (physicianData.specialization) {
          setSelectedSpecialization(physicianData.specialization);
        }

        // Calculate today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayAppointments = appointments.filter(app => {
          const appDate = new Date(app.appointmentTime);
          return appDate >= today && appDate < tomorrow;
        });

        // Calculate active prescriptions
        const activePrescriptions = prescriptions.filter(prescription => {
          const endDate = new Date(prescription.endDate);
          return endDate >= today && prescription.status === "Active";
        });

        // Calculate pending diagnoses
        const pendingDiagnoses = diagnoses.filter(diagnosis => 
          diagnosis.status === "Pending" || diagnosis.status === "In Review"
        );

        // Set stats
        setStats({
          totalPatients: patients.length,
          todayAppointments: todayAppointments.length,
          activePrescriptions: activePrescriptions.length,
          pendingDiagnoses: pendingDiagnoses.length,
          totalAppointments: appointments.length,
          facilityPatients: patients.filter(p => p.facilityId === physicianData.facilityId).length
        });

        // Set alerts
        const newAlerts = [];
        if (pendingDiagnoses.length > 0) {
          newAlerts.push({
            title: 'Pending Diagnoses',
            message: `${pendingDiagnoses.length} diagnoses need your review`,
            type: 'warning',
            icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          });
        }
        if (todayAppointments.length > 5) {
          newAlerts.push({
            title: 'Busy Schedule',
            message: `You have ${todayAppointments.length} appointments today`,
            type: 'warning',
            icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          });
        }
        setAlerts(newAlerts);

        // Set recent visits (last 5 appointments)
        setRecentVisits(appointments
          .filter(app => app.status === 'Completed')
          .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime))
          .slice(0, 5)
          .map(app => ({
            id: app.appointmentId,
            patient: app.patientName,
            date: new Date(app.appointmentTime).toLocaleDateString(),
            reason: app.reason
          }))
        );

        // Set chronic conditions (from medical records)
        const conditions = medicalRecords
          .filter(record => record.type === 'Chronic Condition')
          .map(record => ({
            id: record.recordId,
            condition: record.diagnosis,
            patient: record.patientName,
            lastUpdated: new Date(record.updatedAt).toLocaleDateString()
          }));
        setChronicConditions(conditions);

        // Set lab results (from medical records)
        const labs = medicalRecords
          .filter(record => record.type === 'Lab Result')
          .map(record => ({
            id: record.recordId,
            test: record.testName,
            patient: record.patientName,
            result: record.result,
            date: new Date(record.date).toLocaleDateString()
          }));
        setLabResults(labs);

        // Set upcoming appointments
        setUpcomingAppointments(appointments
          .filter(app => app.status === 'Scheduled')
          .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime))
          .slice(0, 10)
          .map(app => ({
            id: app.appointmentId,
            patientName: app.patientName,
            time: app.appointmentTime,
            reason: app.reason,
            type: app.type === 'Follow-up' ? 'Follow-up' : 'New Patient'
          }))
        );

      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.physicianId]);

  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleStartVideoConsultation = (patient) => {
    setSelectedPatient(patient);
    setShowVideoConsultation(true);
  };

  const handleStartSecureMessaging = (patient) => {
    setSelectedPatient(patient);
    setShowSecureMessaging(true);
  };

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

  // Get the appropriate specialization dashboard component
  const SpecializationDashboard = selectedSpecialization 
    ? specializationDashboards[selectedSpecialization] 
    : GeneralPracticeDashboard;

  return (
    <DashboardContainer>
      {/* Welcome Section */}
      <WelcomeSection>
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, Dr. {physicianInfo?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {physicianInfo?.facility ? `at ${physicianInfo.facility}` : ''}
          </Typography>
        </div>
        
        {/* Specialization Selector */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Specialization</InputLabel>
          <Select
            value={selectedSpecialization || ''}
            onChange={handleSpecializationChange}
            label="Specialization"
          >
            {Object.keys(specializationDashboards).map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </WelcomeSection>

      {/* Quick Actions */}
      <SectionContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <div className="flex flex-wrap gap-2">
          <QuickActionButton 
            icon={<FaCalendarAlt />} 
            label="Schedule Appointment" 
            to="/appointments"
          />
          <QuickActionButton 
            icon={<FaPrescription />} 
            label="Prescriptions" 
            to="/prescriptions"
          />
          <QuickActionButton 
            icon={<FaStethoscope />} 
            label="Diagnoses" 
            to="/manage-diagnoses"
          />
          <QuickActionButton 
            icon={<FaFileMedical />} 
            label="Medical Records" 
            to="/medical-records"
          />
          <QuickActionButton 
            icon={<FaUserInjured />} 
            label="Patient List" 
            to="/manage-patients"
          />
          <QuickActionButton 
            icon={<FaVial />} 
            label="Lab Results" 
            to="/medical-records"
          />
          <QuickActionButton 
            icon={<FaUserMd />} 
            label="Provider Directory" 
            to="/providers"
          />
        </div>
      </SectionContainer>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <SectionContainer>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <AlertCard key={index} {...alert} />
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Quick Stats Section */}
      <SectionContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Overview
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<FaUserInjured className="w-6 h-6 text-blue-600" />}
            color="bg-blue-50"
            link="/manage-patients"
          />
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={<FaCalendarAlt className="w-6 h-6 text-green-600" />}
            color="bg-green-50"
            link="/dashboard/todays-appointments"
          />
          <StatCard
            title="Active Prescriptions"
            value={stats.activePrescriptions}
            icon={<FaPrescription className="w-6 h-6 text-purple-600" />}
            color="bg-purple-50"
            link="/dashboard/active-prescriptions"
          />
          <StatCard
            title="Pending Diagnoses"
            value={stats.pendingDiagnoses}
            icon={<FaStethoscope className="w-6 h-6 text-red-600" />}
            color="bg-red-50"
            link="/dashboard/pending-diagnoses"
          />
        </div>
      </SectionContainer>

      {/* Specialization Dashboard */}
      <SectionContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Specialization Dashboard
        </Typography>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SpecializationDashboard />
        </div>
      </SectionContainer>

      {/* Recent Activity and Analytics */}
      <SectionContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Recent Activity & Analytics
        </Typography>
        <Grid container spacing={3}>
          {/* Recent Visits */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Visits
                </Typography>
                <List>
                  {recentVisits.map((visit) => (
                    <React.Fragment key={visit.id}>
                      <ListItem>
                        <ListItemText
                          primary={visit.patient}
                          secondary={`${visit.date} - ${visit.reason}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Chronic Conditions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Chronic Conditions
                </Typography>
                <List>
                  {chronicConditions.map((condition) => (
                    <React.Fragment key={condition.id}>
                      <ListItem>
                        <ListItemText
                          primary={condition.condition}
                          secondary={`${condition.patient} - Last updated: ${condition.lastUpdated}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Patient Analytics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Demographics
                </Typography>
                <div className="h-100">
                  <PatientAgeDistributionChart />
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Diagnosis Analytics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Diagnosis Distribution
                </Typography>
                <div className="h-100">
                  <DiagnosisDistributionChart />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Additional Stats Section */}
      <SectionContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Additional Statistics
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<FaCalendarAlt className="w-6 h-6 text-indigo-600" />}
            color="bg-indigo-50"
            link="/appointments"
          />
          <StatCard
            title="Facility Patients"
            value={stats.facilityPatients}
            icon={<FaHospital className="w-6 h-6 text-pink-600" />}
            color="bg-pink-50"
            link="/manage-patients"
          />
          <StatCard
            title="Medical Records"
            value="View"
            icon={<FaNotesMedical className="w-6 h-6 text-teal-600" />}
            color="bg-teal-50"
            link="/medical-records"
          />
        </div>
      </SectionContainer>

      {/* Telemedicine Section */}
      <SectionContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Telemedicine Services
        </Typography>
        <div className="bg-white rounded-lg shadow-sm">
          <TelemedicineDashboard />
        </div>
      </SectionContainer>

      {/* Upcoming Appointments */}
      <SectionContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Upcoming Appointments
        </Typography>
        <Grid container spacing={3}>
          {upcomingAppointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      {appointment.patientName}
                    </Typography>
                    <Chip
                      label={appointment.type}
                      color={appointment.type === 'Follow-up' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    <FaClock style={{ marginRight: 8 }} />
                    {new Date(appointment.time).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {appointment.reason}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FaVideo />}
                      onClick={() => handleStartVideoConsultation(appointment)}
                    >
                      Start Video Call
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FaComments />}
                      onClick={() => handleStartSecureMessaging(appointment)}
                    >
                      Message
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>

      {/* Telemedicine Dialogs */}
      <Dialog
        open={showVideoConsultation}
        onClose={() => {
          setShowVideoConsultation(false);
          if (selectedPatient) {
            navigate('/telemedicine/video', {
              state: {
                patientId: selectedPatient.id,
                patientName: selectedPatient.patientName,
                appointmentId: selectedPatient.id,
                type: 'consultation'
              }
            });
          }
        }}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          Video Consultation {selectedPatient && `with ${selectedPatient.patientName}`}
        </DialogTitle>
        <DialogContent>
          <VideoConsultation patient={selectedPatient} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSecureMessaging}
        onClose={() => {
          setShowSecureMessaging(false);
          if (selectedPatient) {
            navigate('/telemedicine/messaging', {
              state: {
                patientId: selectedPatient.id,
                patientName: selectedPatient.patientName,
                appointmentId: selectedPatient.id,
                type: 'message'
              }
            });
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Secure Messaging {selectedPatient && `with ${selectedPatient.patientName}`}
        </DialogTitle>
        <DialogContent>
          <SecureMessaging patient={selectedPatient} />
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
    </DashboardContainer>
  );
}