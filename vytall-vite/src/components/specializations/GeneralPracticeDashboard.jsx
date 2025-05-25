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
  Box
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Favorite as VitalsIcon,
  Medication as PrescriptionIcon,
  People as ReferralIcon,
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

const GeneralPracticeDashboard = () => {
  // Mock data - in real app, this would come from API
  const recentVisits = [
    { id: 1, patient: 'John Doe', date: '2024-03-20', reason: 'Annual Checkup' },
    { id: 2, patient: 'Jane Smith', date: '2024-03-19', reason: 'Flu Symptoms' },
    { id: 3, patient: 'Mike Johnson', date: '2024-03-18', reason: 'Blood Pressure Check' },
  ];

  const chronicConditions = [
    { patient: 'John Doe', condition: 'Hypertension', lastCheck: '2024-03-15' },
    { patient: 'Sarah Wilson', condition: 'Type 2 Diabetes', lastCheck: '2024-03-10' },
    { patient: 'Robert Brown', condition: 'Asthma', lastCheck: '2024-03-05' },
  ];

  const pendingReferrals = [
    { patient: 'Jane Smith', specialist: 'Dr. Heart', reason: 'Cardiac Evaluation' },
    { patient: 'Mike Johnson', specialist: 'Dr. Bones', reason: 'Joint Pain' },
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={HistoryIcon} label="Medical History" onClick={() => {}} />
      <QuickActionButton icon={VitalsIcon} label="Vitals" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Prescriptions" onClick={() => {}} />
      <QuickActionButton icon={ReferralIcon} label="Referrals" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
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
              {chronicConditions.map((condition, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={condition.patient}
                      secondary={`${condition.condition} - Last Check: ${condition.lastCheck}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Referrals */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Referrals
            </Typography>
            <List>
              {pendingReferrals.map((referral, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${referral.patient} → ${referral.specialist}`}
                      secondary={referral.reason}
                    />
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
            primary="9:00 AM - Annual Physical"
            secondary="John Doe"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - Follow-up"
            secondary="Sarah Wilson"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - New Patient"
            secondary="Emily Davis"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="General Practice Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default GeneralPracticeDashboard; 