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
  Favorite as VitalsIcon,
  Medication as PrescriptionIcon,
  Timeline as TimelineIcon,
  Science as LabIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TrendingUp as TrendIcon,
  MonitorHeart as ConditionIcon
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

const ConditionCard = ({ patient, condition, status, vitals, trends, lastVisit, nextVisit }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <ConditionIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {patient}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {condition}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={status} 
          color={status === 'Stable' ? 'success' : status === 'Improving' ? 'info' : 'warning'}
          size="small"
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {vitals.map((vital, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Typography variant="body2" color="text.secondary">
              {vital.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
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
            Last Visit: {lastVisit}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Next Visit: {nextVisit}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
        >
          Update Status
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const LabResultCard = ({ patient, date, results, status, trends }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1">
            {patient}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Lab Results - {date}
          </Typography>
        </Box>
        <Chip 
          label={status} 
          color={status === 'Normal' ? 'success' : status === 'Borderline' ? 'warning' : 'error'}
          size="small"
        />
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Test</TableCell>
              <TableCell align="right">Result</TableCell>
              <TableCell align="right">Reference Range</TableCell>
              <TableCell align="right">Trend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.test}</TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: result.status === 'High' ? 'error.main' : 
                           result.status === 'Low' ? 'error.main' : 
                           'text.primary'
                  }}
                >
                  {result.value}
                </TableCell>
                <TableCell align="right">{result.range}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {result.trend && (
                      <TrendIcon 
                        sx={{ 
                          color: result.trend > 0 ? 'error.main' : 'success.main',
                          transform: result.trend > 0 ? 'rotate(0deg)' : 'rotate(180deg)',
                          fontSize: '1rem'
                        }} 
                      />
                    )}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {result.trend ? `${Math.abs(result.trend)}%` : '-'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

const MedicationCard = ({ patient, medications, lastReview, nextReview }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          {patient}
        </Typography>
        <Chip 
          label={`Last Review: ${lastReview}`}
          size="small"
          variant="outlined"
        />
      </Box>

      <List>
        {medications.map((med, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={med.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {med.dosage}
                    </Typography>
                    {" — "}{med.frequency}
                    {med.notes && ` (${med.notes})`}
                  </>
                }
              />
              <Chip 
                label={med.status} 
                color={med.status === 'Stable' ? 'success' : med.status === 'Needs Review' ? 'warning' : 'error'}
                size="small"
                sx={{ mr: 1 }}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Next Review: {nextReview}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
        >
          Review Medications
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const InternalMedicineDashboard = () => {
  // Mock data - in real app, this would come from API
  const chronicConditions = [
    {
      id: 1,
      patient: 'John Smith',
      condition: 'Type 2 Diabetes',
      status: 'Stable',
      vitals: [
        { label: 'HbA1c', value: '6.8%', trend: -0.5 },
        { label: 'Blood Glucose', value: '128 mg/dL', trend: -2 },
        { label: 'Blood Pressure', value: '130/85', trend: -1 },
        { label: 'Weight', value: '85 kg', trend: -0.5 }
      ],
      lastVisit: '2024-03-15',
      nextVisit: '2024-04-15'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      condition: 'Hypertension',
      status: 'Improving',
      vitals: [
        { label: 'Blood Pressure', value: '135/88', trend: -3 },
        { label: 'Heart Rate', value: '72 bpm', trend: -1 },
        { label: 'Weight', value: '68 kg', trend: -0.2 },
        { label: 'BMI', value: '24.5', trend: -0.1 }
      ],
      lastVisit: '2024-03-18',
      nextVisit: '2024-04-18'
    }
  ];

  const recentLabResults = [
    {
      id: 1,
      patient: 'John Smith',
      date: '2024-03-20',
      status: 'Borderline',
      results: [
        { test: 'HbA1c', value: '6.8%', range: '4.0-5.6%', status: 'High', trend: 0.5 },
        { test: 'Fasting Glucose', value: '128 mg/dL', range: '70-99 mg/dL', status: 'High', trend: -2 },
        { test: 'LDL Cholesterol', value: '110 mg/dL', range: '<100 mg/dL', status: 'High', trend: -5 },
        { test: 'HDL Cholesterol', value: '45 mg/dL', range: '>40 mg/dL', status: 'Normal', trend: 2 }
      ]
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      date: '2024-03-19',
      status: 'Normal',
      results: [
        { test: 'Sodium', value: '140 mEq/L', range: '135-145 mEq/L', status: 'Normal', trend: 0 },
        { test: 'Potassium', value: '4.0 mEq/L', range: '3.5-5.0 mEq/L', status: 'Normal', trend: -0.5 },
        { test: 'Creatinine', value: '0.9 mg/dL', range: '0.6-1.2 mg/dL', status: 'Normal', trend: 0 },
        { test: 'eGFR', value: '90 mL/min', range: '>60 mL/min', status: 'Normal', trend: 0 }
      ]
    }
  ];

  const medicationReviews = [
    {
      patient: 'John Smith',
      medications: [
        { name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', status: 'Stable', notes: 'With meals' },
        { name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily', status: 'Stable' },
        { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily', status: 'Needs Review', notes: 'Side effects reported' }
      ],
      lastReview: '2024-03-15',
      nextReview: '2024-04-15'
    },
    {
      patient: 'Sarah Wilson',
      medications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', status: 'Stable' },
        { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Once daily', status: 'Stable' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', status: 'Stable' }
      ],
      lastReview: '2024-03-18',
      nextReview: '2024-04-18'
    }
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={ConditionIcon} label="Conditions" onClick={() => {}} />
      <QuickActionButton icon={LabIcon} label="Lab Results" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Medications" onClick={() => {}} />
      <QuickActionButton icon={VitalsIcon} label="Vitals" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Chronic Conditions */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Chronic Conditions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            New Condition
          </Button>
        </Box>
        {chronicConditions.map((condition) => (
          <ConditionCard
            key={condition.id}
            {...condition}
          />
        ))}
      </Grid>

      {/* Recent Lab Results */}
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          Recent Lab Results
        </Typography>
        {recentLabResults.map((lab) => (
          <LabResultCard
            key={lab.id}
            {...lab}
          />
        ))}
      </Grid>

      {/* Medication Reviews */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Medication Reviews
        </Typography>
        {medicationReviews.map((review, index) => (
          <MedicationCard
            key={index}
            {...review}
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
            primary="9:00 AM - Diabetes Follow-up"
            secondary="John Smith"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - New Patient"
            secondary="Hypertension Assessment"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - Lab Review"
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
            secondary="85 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Pending Lab Reviews"
            secondary="5 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Medication Reviews Due"
            secondary="8 patients this week"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Internal Medicine Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default InternalMedicineDashboard; 