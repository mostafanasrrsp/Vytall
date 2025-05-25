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
  Chip,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import BaseDashboard from './BaseDashboard';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  Image as ImageIcon,
  Medication as PrescriptionIcon,
  Timeline as TimelineIcon,
  Face as FaceIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Compare as CompareIcon,
  Edit as EditIcon
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

const ConditionCard = ({ patient, condition, location, date, status, images }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1">
            {patient}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {condition} - {location}
          </Typography>
        </Box>
        <Chip 
          label={status} 
          color={status === 'Improving' ? 'success' : status === 'Stable' ? 'info' : 'warning'}
          size="small"
        />
      </Box>
      
      <ImageList sx={{ width: '100%', height: 120 }} cols={3} rowHeight={100}>
        {images.map((image, index) => (
          <ImageListItem key={index}>
            <img
              src={image.url}
              alt={`${condition} - ${index + 1}`}
              loading="lazy"
              style={{ objectFit: 'cover', height: '100%' }}
            />
            <ImageListItemBar
              title={image.date}
              actionIcon={
                <IconButton size="small">
                  <CompareIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: {date}
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

const BodyRegionMap = ({ regions }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Body Region Overview
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        mt: 2
      }}>
        {regions.map((region, index) => (
          <Chip
            key={index}
            icon={<FaceIcon />}
            label={`${region.name} (${region.count})`}
            color={region.count > 0 ? 'primary' : 'default'}
            variant={region.count > 0 ? 'filled' : 'outlined'}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
    </CardContent>
  </Card>
);

const DermatologyDashboard = () => {
  // Mock data - in real app, this would come from API
  const activeConditions = [
    {
      id: 1,
      patient: 'Sarah Wilson',
      condition: 'Psoriasis',
      location: 'Elbows, Knees',
      date: '2024-03-20',
      status: 'Improving',
      images: [
        { url: 'https://example.com/psoriasis1.jpg', date: '2024-03-20' },
        { url: 'https://example.com/psoriasis2.jpg', date: '2024-03-15' },
        { url: 'https://example.com/psoriasis3.jpg', date: '2024-03-10' },
      ]
    },
    {
      id: 2,
      patient: 'John Smith',
      condition: 'Acne',
      location: 'Face, Back',
      date: '2024-03-19',
      status: 'Stable',
      images: [
        { url: 'https://example.com/acne1.jpg', date: '2024-03-19' },
        { url: 'https://example.com/acne2.jpg', date: '2024-03-12' },
      ]
    },
    {
      id: 3,
      patient: 'Emma Davis',
      condition: 'Eczema',
      location: 'Hands, Arms',
      date: '2024-03-18',
      status: 'Worsening',
      images: [
        { url: 'https://example.com/eczema1.jpg', date: '2024-03-18' },
        { url: 'https://example.com/eczema2.jpg', date: '2024-03-11' },
      ]
    },
  ];

  const bodyRegions = [
    { name: 'Face', count: 5 },
    { name: 'Scalp', count: 2 },
    { name: 'Neck', count: 1 },
    { name: 'Chest', count: 3 },
    { name: 'Back', count: 4 },
    { name: 'Arms', count: 6 },
    { name: 'Hands', count: 3 },
    { name: 'Legs', count: 4 },
    { name: 'Feet', count: 2 },
  ];

  const pendingBiopsies = [
    { patient: 'Sarah Wilson', location: 'Left Elbow', date: '2024-03-25', type: 'Suspicious Lesion' },
    { patient: 'John Smith', location: 'Back', date: '2024-03-26', type: 'Mole Assessment' },
  ];

  const quickActions = (
    <>
      <QuickActionButton icon={CalendarIcon} label="Appointments" onClick={() => {}} />
      <QuickActionButton icon={ImageIcon} label="Images" onClick={() => {}} />
      <QuickActionButton icon={FaceIcon} label="Body Map" onClick={() => {}} />
      <QuickActionButton icon={TimelineIcon} label="Progress" onClick={() => {}} />
      <QuickActionButton icon={PrescriptionIcon} label="Prescriptions" onClick={() => {}} />
      <QuickActionButton icon={AlertIcon} label="Alerts" onClick={() => {}} />
    </>
  );

  const mainContent = (
    <Grid container spacing={3}>
      {/* Active Conditions */}
      <Grid item xs={12} md={8}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Active Conditions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            New Condition
          </Button>
        </Box>
        {activeConditions.map((condition) => (
          <ConditionCard
            key={condition.id}
            {...condition}
          />
        ))}
      </Grid>

      {/* Body Region Map */}
      <Grid item xs={12} md={4}>
        <BodyRegionMap regions={bodyRegions} />

        {/* Pending Biopsies */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Biopsies
            </Typography>
            <List>
              {pendingBiopsies.map((biopsy, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${biopsy.patient} - ${biopsy.type}`}
                      secondary={`${biopsy.location} - ${biopsy.date}`}
                    />
                    <Button variant="outlined" size="small">
                      Schedule
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
            secondary="Sarah Wilson - Psoriasis"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="10:30 AM - New Patient"
            secondary="Acne Assessment"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="2:00 PM - Biopsy Review"
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
            primary="Active Conditions"
            secondary="12 conditions"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Pending Biopsies"
            secondary="3 patients"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Images Uploaded Today"
            secondary="8 images"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <BaseDashboard
      title="Dermatology Dashboard"
      quickActions={quickActions}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default DermatologyDashboard; 