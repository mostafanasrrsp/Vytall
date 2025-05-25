import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Box, Typography, Paper, CircularProgress } from '@mui/material';
import MedicalRecordsManager from '../medicalRecords/MedicalRecordsManager';
import PrescriptionsManager from '../prescriptions/PrescriptionsManager';
import DiagnosesManager from '../Diagnosis/DiagnosesManager';
import AppointmentsManager from '../appointments/AppointmentsManager';
import { useAuth } from '../../login/AuthContext';
import { fetchPatientById } from '../../api/patients';
import PatientSatisfactionSurveyForm from './PatientSatisfactionSurveyForm';
import PatientSatisfactionSurveyList from './PatientSatisfactionSurveyList';

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

function PatientProfile() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const patientId = searchParams.get('id') || user?.patientId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

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
        console.error('Error fetching patient info:', error);
        setError('Failed to load patient information');
      } finally {
        setLoading(false);
      }
    }

    loadPatientInfo();
  }, [patientId]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
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
    <Box sx={{ width: '100%', p: 3, maxWidth: '100%', overflow: 'hidden' }}>
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
          </Box>
          {/* Patient Satisfaction Survey Form and List */}
          <PatientSatisfactionSurveyForm patientId={patientId} />
          <PatientSatisfactionSurveyList patientId={patientId} />
        </Paper>
      )}

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="patient profile tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Medical Records" />
          <Tab label="Prescriptions" />
          <Tab label="Diagnoses" />
          <Tab label="Appointments" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <MedicalRecordsManager patientId={patientId} />
      </TabPanel>
      
      <TabPanel value={currentTab} index={1}>
        <PrescriptionsManager patientId={patientId} />
      </TabPanel>
      
      <TabPanel value={currentTab} index={2}>
        <DiagnosesManager patientId={patientId} />
      </TabPanel>
      
      <TabPanel value={currentTab} index={3}>
        <AppointmentsManager patientId={patientId} />
      </TabPanel>
    </Box>
  );
}

export default PatientProfile; 