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
  Chip
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Favorite as VitalsIcon,
  Medication as PrescriptionIcon,
  Timeline as TrendsIcon,
  Vaccines as VaccineIcon,
  ChildCare as MilestoneIcon,
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

const GrowthChartCard = ({ title, value, percentile, age, gender }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">
        {title} - {age} months ({gender})
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {percentile}th percentile
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={percentile} 
          sx={{ ml: 1, flexGrow: 1 }}
        />
      </Box>
    </CardContent>
  </Card>
);

const ImmunizationStatus = ({ name, status, dueDate }) => (
  <ListItem>
    <ListItemText
      primary={name}
      secondary={status === 'Due' ? `Due: ${dueDate}` : status}
    />
    <Chip 
      label={status} 
      color={status === 'Complete' ? 'success' : status === 'Due' ? 'warning' : 'error'}
      size="small"
    />
  </ListItem>
);

const DevelopmentalMilestone = ({ age, milestone, status }) => (
  <ListItem>
    <ListItemText
      primary={milestone}
      secondary={`Age: ${age} months`}
    />
    <Chip 
      label={status} 
      color={status === 'Achieved' ? 'success' : status === 'In Progress' ? 'warning' : 'error'}
      size="small"
    />
  </ListItem>
);

const PediatricsDashboard = () => {
  // Mock data - in real app, this would come from API
  const growthData = [
    { id: 1, patient: 'Emma Smith', age: '24', gender: 'Female', height: '85 cm', heightPercentile: 75, weight: '12.5 kg', weightPercentile: 60 },
    { id: 2, patient: 'Lucas Johnson', age: '18', gender: 'Male', height: '78 cm', heightPercentile: 65, weight: '10.2 kg', weightPercentile: 55 },
  ];

  const immunizations = [
    { name: 'MMR', status: 'Complete', dueDate: null },
    { name: 'DTaP', status: 'Due', dueDate: '2024-04-15' },
    { name: 'Hepatitis B', status: 'Complete', dueDate: null },
    { name: 'Varicella', status: 'Overdue', dueDate: '2024-03-01' },
  ];

  const milestones = [
    { age: '24', milestone: 'Walking independently', status: 'Achieved' },
    { age: '24', milestone: 'Speaking 2-word phrases', status: 'In Progress' },
    { age: '18', milestone: 'Climbing stairs', status: 'Achieved' },
    { age: '18', milestone: 'Using spoon', status: 'Not Started' },
  ];

  const upcomingWellChild = [
    { patient: 'Emma Smith', age: '24', date: '2024-03-25', type: 'Well-child visit' },
    { patient: 'Lucas Johnson', age: '18', date: '2024-03-26', type: 'Vaccination' },
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={VitalsIcon} label="Vitals" onClick={() => {}} />
      <QuickActionButton icon={VaccineIcon} label="Immunizations" onClick={() => {}} />
      <QuickActionButton icon={MilestoneIcon} label="Milestones" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Prescriptions" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Growth Charts */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Growth Charts
        </Typography>
        {growthData.map((patient) => (
          <Card key={patient.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {patient.patient}
              </Typography>
              <GrowthChartCard 
                title="Height"
                value={patient.height}
                percentile={patient.heightPercentile}
                age={patient.age}
                gender={patient.gender}
              />
              <GrowthChartCard 
                title="Weight"
                value={patient.weight}
                percentile={patient.weightPercentile}
                age={patient.age}
                gender={patient.gender}
              />
            </CardContent>
          </Card>
        ))}
      </Grid>

      {/* Immunization Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Immunization Status
            </Typography>
            <List>
              {immunizations.map((immunization, index) => (
                <React.Fragment key={index}>
                  <ImmunizationStatus {...immunization} />
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Developmental Milestones */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Developmental Milestones
            </Typography>
            <List>
              {milestones.map((milestone, index) => (
                <React.Fragment key={index}>
                  <DevelopmentalMilestone {...milestone} />
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Well-child Visits */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Well-child Visits
            </Typography>
            <List>
              {upcomingWellChild.map((visit, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${visit.patient} (${visit.age} months)`}
                      secondary={`${visit.date} - ${visit.type}`}
                    />
                    <Button variant="outlined" size="small">
                      View Details
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
            primary="9:00 AM - 2-month Checkup"
            secondary="Baby Anderson"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - Vaccination"
            secondary="Emma Smith"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - Developmental Assessment"
            secondary="Lucas Johnson"
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Quick Stats
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Patients Due for Vaccination"
            secondary="3 patients this week"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Average Growth Rate"
            secondary="Normal for age group"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Pediatrics Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default PediatricsDashboard; 