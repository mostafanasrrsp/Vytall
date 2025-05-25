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
  Avatar
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Favorite as VitalsIcon,
  Medication as PrescriptionIcon,
  Timeline as TimelineIcon,
  PregnantWoman as PregnancyIcon,
  Image as UltrasoundIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Event as EventIcon
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

const PregnancyCard = ({ patient, weeks, dueDate, status, nextAppointment, vitals }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PregnancyIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {patient}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {weeks} weeks - Due: {dueDate}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={status} 
          color={status === 'Normal' ? 'success' : status === 'High Risk' ? 'error' : 'warning'}
          size="small"
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {vitals.map((vital, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Typography variant="body2" color="text.secondary">
              {vital.label}
            </Typography>
            <Typography variant="h6">
              {vital.value}
            </Typography>
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

const MenstrualCycleCard = ({ patient, lastPeriod, cycleLength, nextPeriod, symptoms }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          {patient}
        </Typography>
        <Chip 
          label={`${cycleLength} day cycle`}
          size="small"
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Last Period
          </Typography>
          <Typography variant="body1">
            {lastPeriod}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Next Period
          </Typography>
          <Typography variant="body1">
            {nextPeriod}
          </Typography>
        </Grid>
      </Grid>

      {symptoms && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Recent Symptoms
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {symptoms.map((symptom, index) => (
              <Chip
                key={index}
                label={symptom}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </CardContent>
  </Card>
);

const UltrasoundCard = ({ patient, date, type, findings, imageUrl }) => (
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
        <Button
          variant="outlined"
          size="small"
          startIcon={<UltrasoundIcon />}
        >
          View Images
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Findings
      </Typography>
      <Typography variant="body1" paragraph>
        {findings}
      </Typography>

      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="Ultrasound"
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderRadius: 1,
            mt: 1
          }}
        />
      )}
    </CardContent>
  </Card>
);

const ObGynDashboard = () => {
  // Mock data - in real app, this would come from API
  const activePregnancies = [
    {
      id: 1,
      patient: 'Sarah Wilson',
      weeks: '28',
      dueDate: '2024-06-15',
      status: 'Normal',
      nextAppointment: '2024-03-25',
      vitals: [
        { label: 'Blood Pressure', value: '120/80' },
        { label: 'Weight', value: '68 kg' },
        { label: 'Fetal Heart Rate', value: '140 bpm' },
        { label: 'Fundal Height', value: '28 cm' }
      ]
    },
    {
      id: 2,
      patient: 'Emma Davis',
      weeks: '32',
      dueDate: '2024-05-20',
      status: 'High Risk',
      nextAppointment: '2024-03-24',
      vitals: [
        { label: 'Blood Pressure', value: '135/85' },
        { label: 'Weight', value: '72 kg' },
        { label: 'Fetal Heart Rate', value: '145 bpm' },
        { label: 'Fundal Height', value: '32 cm' }
      ]
    }
  ];

  const menstrualCycles = [
    {
      patient: 'Jessica Brown',
      lastPeriod: '2024-03-01',
      cycleLength: 28,
      nextPeriod: '2024-03-29',
      symptoms: ['Cramps', 'Headache', 'Fatigue']
    },
    {
      patient: 'Maria Garcia',
      lastPeriod: '2024-03-05',
      cycleLength: 30,
      nextPeriod: '2024-04-04',
      symptoms: ['Breast Tenderness', 'Mood Changes']
    }
  ];

  const recentUltrasounds = [
    {
      patient: 'Sarah Wilson',
      date: '2024-03-20',
      type: 'Anatomy Scan',
      findings: 'Normal fetal development. All measurements within normal range. Clear view of all major organs.',
      imageUrl: 'https://example.com/ultrasound1.jpg'
    },
    {
      patient: 'Emma Davis',
      date: '2024-03-19',
      type: 'Growth Scan',
      findings: 'Fetal growth on track. Amniotic fluid levels normal. Placenta position normal.',
      imageUrl: 'https://example.com/ultrasound2.jpg'
    }
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={PregnancyIcon} label="Pregnancy" onClick={() => {}} />
      <QuickActionButton icon={TimelineIcon} label="Cycle" onClick={() => {}} />
      <QuickActionButton icon={UltrasoundIcon} label="Ultrasound" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Prescriptions" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Active Pregnancies */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Active Pregnancies
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            New Pregnancy
          </Button>
        </Box>
        {activePregnancies.map((pregnancy) => (
          <PregnancyCard
            key={pregnancy.id}
            {...pregnancy}
          />
        ))}
      </Grid>

      {/* Menstrual Cycles */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Menstrual Cycle Tracking
        </Typography>
        {menstrualCycles.map((cycle, index) => (
          <MenstrualCycleCard
            key={index}
            {...cycle}
          />
        ))}
      </Grid>

      {/* Recent Ultrasounds */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Recent Ultrasounds
        </Typography>
        {recentUltrasounds.map((ultrasound, index) => (
          <UltrasoundCard
            key={index}
            {...ultrasound}
          />
        ))}
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
            primary="9:00 AM - Prenatal Checkup"
            secondary="Sarah Wilson - 28 weeks"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - Ultrasound"
            secondary="Emma Davis - Growth Scan"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - Gynecological Exam"
            secondary="Jessica Brown"
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Quick Stats
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Active Pregnancies"
            secondary="8 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Due This Month"
            secondary="3 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="High Risk Pregnancies"
            secondary="2 patients"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="OB-GYN Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default ObGynDashboard; 