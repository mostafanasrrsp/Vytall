import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  LinearProgress
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Favorite as VitalsIcon,
  Medication as PrescriptionIcon,
  Timeline as TrendsIcon,
  Image as ImagingIcon,
  Warning as AlertIcon
} from '@mui/icons-material';

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <Grid item xs={6} sm={4} md={2}>
    <Button
      variant="outlined"
      fullWidth
      startIcon={<Icon />}
      onClick={onClick}
      sx={{ height: '100%', flexDirection: 'column', py: 2 }}
    >
      {label}
    </Button>
  </Grid>
);

const VitalTrendCard = ({ title, value, unit, trend, color }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ color }}>
        {value} {unit}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2" color={trend > 0 ? 'error.main' : 'success.main'}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={Math.abs(trend)} 
          color={trend > 0 ? 'error' : 'success'}
          sx={{ ml: 1, flexGrow: 1 }}
        />
      </Box>
    </CardContent>
  </Card>
);

const CardiologyDashboard = () => {
  // Mock data - in real app, this would come from API
  const recentECGs = [
    { id: 1, patient: 'John Doe', date: '2024-03-20', result: 'Normal Sinus Rhythm' },
    { id: 2, patient: 'Jane Smith', date: '2024-03-19', result: 'Atrial Fibrillation' },
    { id: 3, patient: 'Mike Johnson', date: '2024-03-18', result: 'ST Elevation' },
  ];

  const pendingImaging = [
    { patient: 'Sarah Wilson', type: 'Echocardiogram', date: '2024-03-21' },
    { patient: 'Robert Brown', type: 'Stress Test', date: '2024-03-22' },
    { patient: 'Emily Davis', type: 'Cardiac MRI', date: '2024-03-23' },
  ];

  const criticalAlerts = [
    { patient: 'Jane Smith', alert: 'BP: 180/110 mmHg', severity: 'high' },
    { patient: 'Mike Johnson', alert: 'Heart Rate: 45 bpm', severity: 'medium' },
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={VitalsIcon} label="Vitals" onClick={() => {}} />
      <QuickActionButton icon={TrendsIcon} label="Trends" onClick={() => {}} />
      <QuickActionButton icon={ImagingIcon} label="Imaging" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Medications" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Critical Alerts */}
      <Grid item xs={12}>
        <Card sx={{ bgcolor: 'error.light' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="error.dark">
              Critical Alerts
            </Typography>
            <List>
              {criticalAlerts.map((alert, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={alert.patient}
                      secondary={alert.alert}
                      primaryTypographyProps={{ color: 'error.dark' }}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Vital Trends */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Key Metrics
        </Typography>
        <VitalTrendCard 
          title="Average Blood Pressure"
          value="135/85"
          unit="mmHg"
          trend={5}
          color="error.main"
        />
        <VitalTrendCard 
          title="Average Heart Rate"
          value="72"
          unit="bpm"
          trend={-3}
          color="success.main"
        />
        <VitalTrendCard 
          title="Cholesterol (LDL)"
          value="110"
          unit="mg/dL"
          trend={-8}
          color="success.main"
        />
      </Grid>

      {/* Recent ECGs */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent ECGs
            </Typography>
            <List>
              {recentECGs.map((ecg) => (
                <React.Fragment key={ecg.id}>
                  <ListItem>
                    <ListItemText
                      primary={ecg.patient}
                      secondary={`${ecg.date} - ${ecg.result}`}
                    />
                    <Button variant="outlined" size="small">
                      View
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Imaging */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Imaging Studies
            </Typography>
            <List>
              {pendingImaging.map((imaging, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${imaging.patient} - ${imaging.type}`}
                      secondary={`Scheduled: ${imaging.date}`}
                    />
                    <Button variant="outlined" size="small">
                      Details
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const sidebarContent = (
    <Box>
      <Typography variant="h6" gutterBottom>
        Today's Schedule
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="9:00 AM - Cardiac Consultation"
            secondary="John Doe"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - Stress Test Review"
            secondary="Sarah Wilson"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - Post-Op Follow-up"
            secondary="Robert Brown"
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Quick Stats
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Patients with Hypertension"
            secondary="45% of total patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Average Wait Time"
            secondary="15 minutes"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Cardiology Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default CardiologyDashboard; 