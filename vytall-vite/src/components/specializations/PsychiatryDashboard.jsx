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
  IconButton
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Psychology as AssessmentIcon,
  Medication as PrescriptionIcon,
  Timeline as MoodIcon,
  Note as NoteIcon,
  Warning as AlertIcon,
  Add as AddIcon
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

const AssessmentCard = ({ title, score, maxScore, date, trend, severity }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Severe': return 'error.main';
      case 'Moderate': return 'warning.main';
      case 'Mild': return 'info.main';
      default: return 'success.main';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Chip 
            label={severity} 
            size="small"
            sx={{ bgcolor: getSeverityColor(severity), color: 'white' }}
          />
        </Box>
        <Typography variant="h4" component="div">
          {score}/{maxScore}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {date}
          </Typography>
          <Typography 
            variant="body2" 
            color={trend > 0 ? 'error.main' : 'success.main'}
            sx={{ ml: 1 }}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={(score / maxScore) * 100}
          color={severity === 'Severe' ? 'error' : severity === 'Moderate' ? 'warning' : 'success'}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};

const SessionNote = ({ patient, date, type, summary, status }) => (
  <ListItem>
    <ListItemText
      primary={`${patient} - ${type}`}
      secondary={
        <>
          <Typography component="span" variant="body2" color="text.primary">
            {date}
          </Typography>
          {" — "}{summary}
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
      <NoteIcon />
    </IconButton>
  </ListItem>
);

const PsychiatryDashboard = () => {
  // Mock data - in real app, this would come from API
  const recentAssessments = [
    { 
      id: 1, 
      patient: 'Sarah Wilson', 
      type: 'PHQ-9', 
      score: 15, 
      maxScore: 27, 
      date: '2024-03-20',
      trend: 10,
      severity: 'Moderate'
    },
    { 
      id: 2, 
      patient: 'John Smith', 
      type: 'GAD-7', 
      score: 12, 
      maxScore: 21, 
      date: '2024-03-19',
      trend: -5,
      severity: 'Moderate'
    },
    { 
      id: 3, 
      patient: 'Emma Davis', 
      type: 'PHQ-9', 
      score: 22, 
      maxScore: 27, 
      date: '2024-03-18',
      trend: 15,
      severity: 'Severe'
    },
  ];

  const recentSessions = [
    { 
      patient: 'Sarah Wilson', 
      date: '2024-03-20', 
      type: 'Follow-up', 
      summary: 'Discussed medication effectiveness and sleep patterns',
      status: 'Completed'
    },
    { 
      patient: 'John Smith', 
      date: '2024-03-19', 
      type: 'Initial Assessment', 
      summary: 'Comprehensive evaluation and treatment planning',
      status: 'Completed'
    },
    { 
      patient: 'Emma Davis', 
      date: '2024-03-21', 
      type: 'Emergency Session', 
      summary: 'Crisis intervention and safety planning',
      status: 'Scheduled'
    },
  ];

  const medicationAlerts = [
    { patient: 'Sarah Wilson', medication: 'Sertraline', alert: 'Due for refill' },
    { patient: 'John Smith', medication: 'Bupropion', alert: 'Side effects reported' },
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={AssessmentIcon} label="Assessments" onClick={() => {}} />
      <QuickActionButton icon={MoodIcon} label="Mood Tracking" onClick={() => {}} />
      <QuickActionButton icon={NoteIcon} label="Session Notes" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Medications" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Recent Assessments */}
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Recent Assessments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            New Assessment
          </Button>
        </Box>
        {recentAssessments.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            title={`${assessment.patient} - ${assessment.type}`}
            score={assessment.score}
            maxScore={assessment.maxScore}
            date={assessment.date}
            trend={assessment.trend}
            severity={assessment.severity}
          />
        ))}
      </Grid>

      {/* Recent Sessions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Sessions
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
              >
                New Session
              </Button>
            </Box>
            <List>
              {recentSessions.map((session, index) => (
                <React.Fragment key={index}>
                  <SessionNote {...session} />
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Medication Alerts */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Medication Alerts
            </Typography>
            <List>
              {medicationAlerts.map((alert, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${alert.patient} - ${alert.medication}`}
                      secondary={alert.alert}
                    />
                    <Button variant="outlined" size="small">
                      Review
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
            primary="9:00 AM - Follow-up"
            secondary="Sarah Wilson"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - Initial Assessment"
            secondary="New Patient"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - Medication Review"
            secondary="John Smith"
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Quick Stats
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Active Patients"
            secondary="45 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Pending Assessments"
            secondary="3 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Medication Reviews Due"
            secondary="5 patients this week"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Psychiatry Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default PsychiatryDashboard; 