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
  Tabs,
  Tab
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Favorite as VitalsIcon,
  Medication as PrescriptionIcon,
  Timeline as TimelineIcon,
  Image as ImageIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Compare as CompareIcon,
  SportsScore as RangeIcon,
  LocalHospital as SurgeryIcon
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

const ImagingCard = ({ patient, type, date, findings, imageUrl, comparisonUrl }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1">
            {patient}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {type} - {date}
          </Typography>
        </Box>
        <Box>
          <IconButton size="small" sx={{ mr: 1 }}>
            <CompareIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ImageIcon />}
          >
            View Full
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Image
          </Typography>
          <Box
            component="img"
            src={imageUrl}
            alt="Current Imaging"
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: 1
            }}
          />
        </Grid>
        {comparisonUrl && (
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Previous Image
            </Typography>
            <Box
              component="img"
              src={comparisonUrl}
              alt="Previous Imaging"
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 1
              }}
            />
          </Grid>
        )}
      </Grid>

      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
        Findings
      </Typography>
      <Typography variant="body1" paragraph>
        {findings}
      </Typography>
    </CardContent>
  </Card>
);

const RecoveryCard = ({ patient, procedure, date, progress, rangeOfMotion, nextAppointment }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1">
            {patient}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {procedure} - {date}
          </Typography>
        </Box>
        <Chip 
          label={`${progress}% Recovery`}
          color={progress >= 75 ? 'success' : progress >= 50 ? 'info' : 'warning'}
          size="small"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Range of Motion Progress
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {rangeOfMotion.map((rom, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Typography variant="body2" color="text.secondary">
              {rom.movement}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                {rom.current}°
              </Typography>
              <Typography variant="body2" color="text.secondary">
                / {rom.target}°
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(rom.current / rom.target) * 100}
              sx={{ mt: 0.5 }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Next Appointment: {nextAppointment}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
        >
          Update Progress
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const SurgicalNote = ({ patient, procedure, date, surgeon, status, notes }) => (
  <ListItem>
    <ListItemText
      primary={`${patient} - ${procedure}`}
      secondary={
        <>
          <Typography component="span" variant="body2" color="text.primary">
            {date} - Dr. {surgeon}
          </Typography>
          {" — "}{notes}
        </>
      }
    />
    <Chip 
      label={status} 
      color={status === 'Completed' ? 'success' : 'warning'}
      size="small"
      sx={{ mr: 1 }}
    />
    <IconButton size="small">
      <EditIcon />
    </IconButton>
  </ListItem>
);

const OrthopedicsDashboard = () => {
  // Mock data - in real app, this would come from API
  const recentImaging = [
    {
      id: 1,
      patient: 'John Smith',
      type: 'Knee MRI',
      date: '2024-03-20',
      findings: 'Partial ACL tear. Mild meniscal degeneration. No significant bone edema.',
      imageUrl: 'https://example.com/knee-mri1.jpg',
      comparisonUrl: 'https://example.com/knee-mri-previous.jpg'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      type: 'Shoulder X-ray',
      date: '2024-03-19',
      findings: 'Rotator cuff calcification. No acute fracture. Mild degenerative changes.',
      imageUrl: 'https://example.com/shoulder-xray1.jpg'
    }
  ];

  const activeRecoveries = [
    {
      id: 1,
      patient: 'John Smith',
      procedure: 'ACL Reconstruction',
      date: '2024-02-15',
      progress: 65,
      rangeOfMotion: [
        { movement: 'Flexion', current: 120, target: 140 },
        { movement: 'Extension', current: -2, target: 0 },
        { movement: 'Internal Rotation', current: 30, target: 45 },
        { movement: 'External Rotation', current: 35, target: 50 }
      ],
      nextAppointment: '2024-03-25'
    },
    {
      id: 2,
      patient: 'Emma Davis',
      procedure: 'Total Knee Replacement',
      date: '2024-03-01',
      progress: 45,
      rangeOfMotion: [
        { movement: 'Flexion', current: 90, target: 120 },
        { movement: 'Extension', current: -5, target: 0 },
        { movement: 'Internal Rotation', current: 15, target: 30 },
        { movement: 'External Rotation', current: 20, target: 35 }
      ],
      nextAppointment: '2024-03-24'
    }
  ];

  const surgicalNotes = [
    {
      patient: 'John Smith',
      procedure: 'ACL Reconstruction',
      date: '2024-02-15',
      surgeon: 'Johnson',
      status: 'Completed',
      notes: 'Standard ACL reconstruction with hamstring autograft. No complications.'
    },
    {
      patient: 'Emma Davis',
      procedure: 'Total Knee Replacement',
      date: '2024-03-01',
      surgeon: 'Johnson',
      status: 'Completed',
      notes: 'Unilateral TKR with standard approach. Good alignment achieved.'
    },
    {
      patient: 'Michael Brown',
      procedure: 'Rotator Cuff Repair',
      date: '2024-03-25',
      surgeon: 'Johnson',
      status: 'Scheduled',
      notes: 'Pre-op assessment completed. Patient cleared for surgery.'
    }
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={ImageIcon} label="Imaging" onClick={() => {}} />
      <QuickActionButton icon={SurgeryIcon} label="Surgery" onClick={() => {}} />
      <QuickActionButton icon={RangeIcon} label="Range of Motion" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Prescriptions" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Recent Imaging */}
      <Grid item xs={12} md={8}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Recent Imaging
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            New Imaging
          </Button>
        </Box>
        {recentImaging.map((imaging) => (
          <ImagingCard
            key={imaging.id}
            {...imaging}
          />
        ))}
      </Grid>

      {/* Active Recoveries */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Active Recoveries
        </Typography>
        {activeRecoveries.map((recovery) => (
          <RecoveryCard
            key={recovery.id}
            {...recovery}
          />
        ))}

        {/* Surgical Notes */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Surgical Notes
            </Typography>
            <List>
              {surgicalNotes.map((note, index) => (
                <React.Fragment key={index}>
                  <SurgicalNote {...note} />
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
            primary="9:00 AM - Post-op Follow-up"
            secondary="John Smith - ACL Reconstruction"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - Range of Motion Assessment"
            secondary="Emma Davis - TKR"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - Pre-op Consultation"
            secondary="Michael Brown - Rotator Cuff"
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Quick Stats
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Active Recoveries"
            secondary="12 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Upcoming Surgeries"
            secondary="3 patients this week"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Average Recovery Time"
            secondary="8.5 weeks"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Orthopedics Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default OrthopedicsDashboard; 