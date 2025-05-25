import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Science,
  CheckCircle,
  Warning,
  Info,
  Timeline,
} from '@mui/icons-material';

const ClinicalTrialMatching = () => {
  const [trials, setTrials] = useState([]);
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    conditions: [],
    medications: [],
    location: '',
    distance: 50, // miles
  });
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [participationStatus, setParticipationStatus] = useState({});

  // Mock data for clinical trials
  const mockTrials = [
    {
      id: 1,
      title: 'Diabetes Management Study',
      sponsor: 'National Institute of Health',
      phase: 'Phase 3',
      status: 'Recruiting',
      location: 'Multiple Locations',
      conditions: ['Type 2 Diabetes', 'Pre-diabetes'],
      eligibility: {
        ageRange: '18-75',
        gender: 'All',
        conditions: ['Type 2 Diabetes'],
      },
      description: 'A study to evaluate the effectiveness of a new diabetes management program.',
      duration: '12 months',
      compensation: 'Up to $500',
      matchPercentage: 95,
    },
    {
      id: 2,
      title: 'Hypertension Treatment Trial',
      sponsor: 'Cardiovascular Research Institute',
      phase: 'Phase 4',
      status: 'Active',
      location: 'Local Medical Center',
      conditions: ['Hypertension', 'High Blood Pressure'],
      eligibility: {
        ageRange: '30-80',
        gender: 'All',
        conditions: ['Hypertension'],
      },
      description: 'Long-term study of new hypertension treatment protocols.',
      duration: '24 months',
      compensation: 'Up to $1000',
      matchPercentage: 85,
    },
  ];

  useEffect(() => {
    // In a real app, this would fetch from an API
    setTrials(mockTrials);
  }, []);

  const handleProfileUpdate = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTrialSelect = (trial) => {
    setSelectedTrial(trial);
    setOpenDialog(true);
  };

  const handleParticipationUpdate = (trialId, status) => {
    setParticipationStatus(prev => ({
      ...prev,
      [trialId]: status,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Recruiting':
        return 'success';
      case 'Active':
        return 'info';
      case 'Completed':
        return 'default';
      default:
        return 'warning';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clinical Trial Matching
      </Typography>

      {/* User Profile Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                type="number"
                value={userProfile.age}
                onChange={(e) => handleProfileUpdate('age', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gender"
                value={userProfile.gender}
                onChange={(e) => handleProfileUpdate('gender', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Medical Conditions"
                value={userProfile.conditions.join(', ')}
                onChange={(e) => handleProfileUpdate('conditions', e.target.value.split(',').map(c => c.trim()))}
                fullWidth
                helperText="Separate conditions with commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Current Medications"
                value={userProfile.medications.join(', ')}
                onChange={(e) => handleProfileUpdate('medications', e.target.value.split(',').map(m => m.trim()))}
                fullWidth
                helperText="Separate medications with commas"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Matching Trials Section */}
      <Typography variant="h5" gutterBottom>
        Matching Clinical Trials
      </Typography>
      <Grid container spacing={3}>
        {trials.map((trial) => (
          <Grid item xs={12} md={6} key={trial.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">{trial.title}</Typography>
                  <Chip
                    label={trial.status}
                    color={getStatusColor(trial.status)}
                    size="small"
                  />
                </Box>
                
                <Typography color="textSecondary" gutterBottom>
                  {trial.sponsor} • {trial.phase}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Match: {trial.matchPercentage}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={trial.matchPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Typography variant="body2" paragraph>
                  {trial.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Conditions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {trial.conditions.map((condition) => (
                      <Chip
                        key={condition}
                        label={condition}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Duration: {trial.duration}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Science />}
                    onClick={() => handleTrialSelect(trial)}
                  >
                    Learn More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Trial Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTrial && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedTrial.title}</Typography>
                <Chip
                  label={selectedTrial.status}
                  color={getStatusColor(selectedTrial.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Study Details
                  </Typography>
                  <Typography paragraph>
                    {selectedTrial.description}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Eligibility Criteria
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography>• Age: {selectedTrial.eligibility.ageRange}</Typography>
                    <Typography>• Gender: {selectedTrial.eligibility.gender}</Typography>
                    <Typography>• Conditions: {selectedTrial.eligibility.conditions.join(', ')}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Study Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography>• Duration: {selectedTrial.duration}</Typography>
                    <Typography>• Compensation: {selectedTrial.compensation}</Typography>
                    <Typography>• Location: {selectedTrial.location}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Please consult with your healthcare provider before participating in any clinical trial.
                  </Alert>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleParticipationUpdate(selectedTrial.id, 'Interested');
                  setOpenDialog(false);
                }}
              >
                Express Interest
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ClinicalTrialMatching; 