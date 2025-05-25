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
  LinearProgress,
  Chip,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Favorite as VitalsIcon,
  Medication as PrescriptionIcon,
  Timeline as TimelineIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TrendingUp as TrendIcon,
  LocalHospital as TriageIcon,
  AccessTime as WaitIcon,
  PriorityHigh as PriorityIcon,
  CheckCircle as DischargeIcon,
  Person as PatientIcon
} from '@mui/icons-material';

const QuickActionButton = ({ icon: Icon, label, onClick, badge }) => (
  <Grid item xs={6} sm={4} md={2}>
    <Button
      variant="outlined"
      fullWidth
      startIcon={
        badge ? (
          <Badge badgeContent={badge} color="error">
            <Icon />
          </Badge>
        ) : <Icon />
      }
      onClick={onClick}
      sx={{ height: '100%', flexDirection: 'column', py: 2 }}
    >
      {label}
    </Button>
  </Grid>
);

const TriageCard = ({ patient, priority, chiefComplaint, vitals, waitTime, status, location }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: priority === 'Red' ? 'error.main' : 
                      priority === 'Orange' ? 'warning.main' : 
                      priority === 'Yellow' ? 'info.main' : 'success.main',
              mr: 2 
            }}
          >
            <TriageIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {patient}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {chiefComplaint}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={priority} 
            color={priority === 'Red' ? 'error' : 
                   priority === 'Orange' ? 'warning' : 
                   priority === 'Yellow' ? 'info' : 'success'}
            size="small"
          />
          <Chip 
            label={status} 
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {vitals.map((vital, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Typography variant="body2" color="text.secondary">
              {vital.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mr: 1,
                  color: vital.status === 'Critical' ? 'error.main' : 
                         vital.status === 'Warning' ? 'warning.main' : 
                         'text.primary'
                }}
              >
                {vital.value}
              </Typography>
              {vital.trend && (
                <TrendIcon 
                  sx={{ 
                    color: vital.trend > 0 ? 'error.main' : 'success.main',
                    transform: vital.trend > 0 ? 'rotate(0deg)' : 'rotate(180deg)'
                  }} 
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Location: {location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Wait Time: {waitTime}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
          >
            Update Status
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<DischargeIcon />}
          >
            Discharge
          </Button>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AlertCard = ({ patient, type, priority, message, timestamp, status }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: priority === 'High' ? 'error.main' : 
                      priority === 'Medium' ? 'warning.main' : 'info.main',
              mr: 2 
            }}
          >
            <PriorityIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {patient}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {type} - {timestamp}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={status} 
          color={status === 'Active' ? 'error' : 'success'}
          size="small"
        />
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {message}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
        >
          Acknowledge
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const WaitTimeCard = ({ priority, count, averageWait, longestWait }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: priority === 'Red' ? 'error.main' : 
                    priority === 'Orange' ? 'warning.main' : 
                    priority === 'Yellow' ? 'info.main' : 'success.main',
            mr: 2 
          }}
        >
          <WaitIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1">
            {priority} Priority
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {count} patients waiting
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Average Wait
          </Typography>
          <Typography variant="h6">
            {averageWait}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Longest Wait
          </Typography>
          <Typography variant="h6">
            {longestWait}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const EmergencyMedicineDashboard = () => {
  // Mock data - in real app, this would come from API
  const activePatients = [
    {
      id: 1,
      patient: 'John Smith',
      priority: 'Red',
      chiefComplaint: 'Chest Pain',
      vitals: [
        { label: 'BP', value: '180/110', status: 'Critical', trend: 2 },
        { label: 'HR', value: '120', status: 'Warning', trend: 1 },
        { label: 'SpO2', value: '92%', status: 'Warning', trend: -1 },
        { label: 'Temp', value: '37.2°C', status: 'Normal', trend: 0 }
      ],
      waitTime: '0 min',
      status: 'In Treatment',
      location: 'Room 1'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      priority: 'Orange',
      chiefComplaint: 'Severe Abdominal Pain',
      vitals: [
        { label: 'BP', value: '140/90', status: 'Warning', trend: 0 },
        { label: 'HR', value: '95', status: 'Warning', trend: 1 },
        { label: 'SpO2', value: '98%', status: 'Normal', trend: 0 },
        { label: 'Temp', value: '38.5°C', status: 'Warning', trend: 1 }
      ],
      waitTime: '15 min',
      status: 'Waiting for Lab',
      location: 'Room 3'
    }
  ];

  const activeAlerts = [
    {
      id: 1,
      patient: 'John Smith',
      type: 'Vital Signs',
      priority: 'High',
      message: 'Blood pressure increasing rapidly. Consider immediate intervention.',
      timestamp: '2 minutes ago',
      status: 'Active'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      type: 'Lab Results',
      priority: 'Medium',
      message: 'WBC count elevated at 15,000. Consider infection workup.',
      timestamp: '5 minutes ago',
      status: 'Active'
    }
  ];

  const waitTimes = [
    {
      priority: 'Red',
      count: 2,
      averageWait: '0 min',
      longestWait: '5 min'
    },
    {
      priority: 'Orange',
      count: 3,
      averageWait: '15 min',
      longestWait: '25 min'
    },
    {
      priority: 'Yellow',
      count: 5,
      averageWait: '45 min',
      longestWait: '60 min'
    },
    {
      priority: 'Green',
      count: 8,
      averageWait: '90 min',
      longestWait: '120 min'
    }
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={TriageIcon} label="Triage" onClick={() => {}} badge={3} />
      <QuickActionButton icon={PatientIcon} label="Patients" onClick={() => {}} badge={18} />
      <QuickActionButton icon={VitalsIcon} label="Vitals" onClick={() => {}} badge={2} />
      <QuickActionButton icon={PrescriptionIcon} label="Orders" onClick={() => {}} />
      <QuickActionButton icon={DischargeIcon} label="Discharge" onClick={() => {}} badge={1} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} badge={2} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Active Patients */}
      <Grid item xs={12} md={8}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Active Patients
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            New Patient
          </Button>
        </Box>
        {activePatients.map((patient) => (
          <TriageCard
            key={patient.id}
            {...patient}
          />
        ))}

        {/* Active Alerts */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Active Alerts
        </Typography>
        {activeAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            {...alert}
          />
        ))}
      </Grid>

      {/* Wait Times */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Current Wait Times
        </Typography>
        {waitTimes.map((wait, index) => (
          <WaitTimeCard
            key={index}
            {...wait}
          />
        ))}
      </Grid>
    </Grid>
  );

  const sidebarContent = (
    <Box>
      <Typography variant="h6" gutterBottom>
        Department Status
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Total Patients"
            secondary="18 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Available Beds"
            secondary="7 beds"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Average Length of Stay"
            secondary="2.5 hours"
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Staff Status
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Attending Physicians"
            secondary="2 on duty"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Nurses"
            secondary="5 on duty"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Support Staff"
            secondary="3 on duty"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Emergency Medicine Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default EmergencyMedicineDashboard; 