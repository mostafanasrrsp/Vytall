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
  Paper
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Psychology as AssessmentIcon,
  Medication as PrescriptionIcon,
  Timeline as TimelineIcon,
  Image as ImageIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TrendingUp as TrendIcon,
  Biotech as ScanIcon,
  MonitorHeart as SymptomIcon
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

const AssessmentCard = ({ patient, assessment, date, scores, status, notes }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <AssessmentIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {patient}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {assessment} - {date}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={status} 
          color={status === 'Normal' ? 'success' : status === 'Mild' ? 'info' : 'warning'}
          size="small"
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {scores.map((score, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Typography variant="body2" color="text.secondary">
              {score.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                {score.value}
              </Typography>
              {score.trend && (
                <TrendIcon 
                  sx={{ 
                    color: score.trend > 0 ? 'error.main' : 'success.main',
                    transform: score.trend > 0 ? 'rotate(0deg)' : 'rotate(180deg)'
                  }} 
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {score.range}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {notes && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body1">
            {notes}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
        >
          Update Assessment
        </Button>
      </Box>
    </CardContent>
  </Card>
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
            Current Scan
          </Typography>
          <Box
            component="img"
            src={imageUrl}
            alt="Current Scan"
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
              Previous Scan
            </Typography>
            <Box
              component="img"
              src={comparisonUrl}
              alt="Previous Scan"
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

const SymptomCard = ({ patient, symptoms, severity, frequency, triggers, lastUpdate }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          {patient}
        </Typography>
        <Chip 
          label={`Last Update: ${lastUpdate}`}
          size="small"
          variant="outlined"
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Symptoms
          </Typography>
          <List dense>
            {symptoms.map((symptom, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={symptom.name}
                  secondary={`Severity: ${symptom.severity}/10`}
                />
                <Chip 
                  label={symptom.frequency} 
                  size="small"
                  color={symptom.frequency === 'Daily' ? 'error' : 
                         symptom.frequency === 'Weekly' ? 'warning' : 'info'}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Triggers & Notes
          </Typography>
          <List dense>
            {triggers.map((trigger, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={trigger.name}
                  secondary={trigger.notes}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
        >
          Update Symptoms
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const NeurologyDashboard = () => {
  // Mock data - in real app, this would come from API
  const recentAssessments = [
    {
      id: 1,
      patient: 'John Smith',
      assessment: 'MMSE Assessment',
      date: '2024-03-20',
      status: 'Mild',
      scores: [
        { name: 'Total Score', value: '24/30', range: 'Normal: 24-30', trend: -2 },
        { name: 'Memory', value: '4/5', range: 'Normal: 4-5', trend: -1 },
        { name: 'Attention', value: '4/5', range: 'Normal: 4-5', trend: 0 },
        { name: 'Language', value: '4/5', range: 'Normal: 4-5', trend: 0 }
      ],
      notes: 'Patient shows mild cognitive decline. Recommended follow-up in 3 months.'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      assessment: 'UPDRS Assessment',
      date: '2024-03-19',
      status: 'Moderate',
      scores: [
        { name: 'Motor Score', value: '32/108', range: 'Normal: 0-20', trend: 2 },
        { name: 'Tremor', value: '8/20', range: 'Normal: 0-4', trend: 1 },
        { name: 'Rigidity', value: '12/20', range: 'Normal: 0-4', trend: 2 },
        { name: 'Posture', value: '6/12', range: 'Normal: 0-4', trend: 1 }
      ],
      notes: 'Progression of motor symptoms noted. Consider medication adjustment.'
    }
  ];

  const recentImaging = [
    {
      id: 1,
      patient: 'John Smith',
      type: 'Brain MRI',
      date: '2024-03-20',
      findings: 'Mild cortical atrophy. No acute infarct. Small white matter hyperintensities in periventricular regions.',
      imageUrl: 'https://example.com/brain-mri1.jpg',
      comparisonUrl: 'https://example.com/brain-mri-previous.jpg'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      type: 'DaTscan',
      date: '2024-03-19',
      findings: 'Reduced dopamine transporter binding in bilateral putamen, more pronounced on the right. Consistent with Parkinson\'s disease.',
      imageUrl: 'https://example.com/datscan1.jpg'
    }
  ];

  const symptomTracking = [
    {
      patient: 'John Smith',
      symptoms: [
        { name: 'Memory Loss', severity: 6, frequency: 'Daily' },
        { name: 'Confusion', severity: 4, frequency: 'Weekly' },
        { name: 'Mood Changes', severity: 5, frequency: 'Daily' }
      ],
      triggers: [
        { name: 'Stress', notes: 'Worsens memory symptoms' },
        { name: 'Sleep Deprivation', notes: 'Increases confusion' }
      ],
      lastUpdate: '2024-03-20'
    },
    {
      patient: 'Sarah Wilson',
      symptoms: [
        { name: 'Tremor', severity: 7, frequency: 'Daily' },
        { name: 'Rigidity', severity: 6, frequency: 'Daily' },
        { name: 'Balance Issues', severity: 5, frequency: 'Weekly' }
      ],
      triggers: [
        { name: 'Fatigue', notes: 'Worsens tremor' },
        { name: 'Cold Weather', notes: 'Increases rigidity' }
      ],
      lastUpdate: '2024-03-19'
    }
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={AssessmentIcon} label="Assessments" onClick={() => {}} />
      <QuickActionButton icon={ScanIcon} label="Imaging" onClick={() => {}} />
      <QuickActionButton icon={SymptomIcon} label="Symptoms" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Medications" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Recent Assessments */}
      <Grid item xs={12}>
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
            {...assessment}
          />
        ))}
      </Grid>

      {/* Recent Imaging */}
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          Recent Imaging
        </Typography>
        {recentImaging.map((imaging) => (
          <ImagingCard
            key={imaging.id}
            {...imaging}
          />
        ))}
      </Grid>

      {/* Symptom Tracking */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Symptom Tracking
        </Typography>
        {symptomTracking.map((tracking, index) => (
          <SymptomCard
            key={index}
            {...tracking}
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
            primary="9:00 AM - Cognitive Assessment"
            secondary="John Smith"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - New Patient"
            secondary="Movement Disorder Evaluation"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - MRI Review"
            secondary="Sarah Wilson"
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
            secondary="65 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Pending Assessments"
            secondary="4 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Imaging Reviews Due"
            secondary="3 patients this week"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Neurology Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default NeurologyDashboard; 