import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const steps = ['Insurance Information', 'Verification', 'Confirmation'];

const InsuranceVerification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  const [insuranceData, setInsuranceData] = useState({
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    memberId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    relationshipToSubscriber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInsuranceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate insurance information
      if (!validateInsuranceInfo()) {
        return;
      }
      setLoading(true);
      try {
        // Mock API call to verify insurance
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setVerificationStatus('verified');
        setActiveStep(1);
      } catch (err) {
        setError('Failed to verify insurance information. Please try again.');
        setVerificationStatus('failed');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateInsuranceInfo = () => {
    const requiredFields = [
      'insuranceProvider',
      'policyNumber',
      'memberId',
      'firstName',
      'lastName',
      'dateOfBirth',
    ];

    const missingFields = requiredFields.filter((field) => !insuranceData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Insurance Provider"
                name="insuranceProvider"
                value={insuranceData.insuranceProvider}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Policy Number"
                name="policyNumber"
                value={insuranceData.policyNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Group Number"
                name="groupNumber"
                value={insuranceData.groupNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Member ID"
                name="memberId"
                value={insuranceData.memberId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                name="firstName"
                value={insuranceData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                name="lastName"
                value={insuranceData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={insuranceData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Relationship to Subscriber"
                name="relationshipToSubscriber"
                select
                value={insuranceData.relationshipToSubscriber}
                onChange={handleInputChange}
                SelectProps={{ native: true }}
              >
                <option value="">Select Relationship</option>
                <option value="self">Self</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="other">Other</option>
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {loading ? (
              <CircularProgress />
            ) : verificationStatus === 'verified' ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Insurance information verified successfully!
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error || 'Verification failed. Please try again.'}
              </Alert>
            )}
            <Typography variant="body1" gutterBottom>
              Insurance Provider: {insuranceData.insuranceProvider}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Policy Number: {insuranceData.policyNumber}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Member ID: {insuranceData.memberId}
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Insurance verification completed successfully!
            </Alert>
            <Typography variant="body1" gutterBottom>
              Your insurance information has been verified and saved to your profile.
            </Typography>
            <Typography variant="body1" gutterBottom>
              You can now proceed with scheduling appointments and submitting claims.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Insurance Verification
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormContainer elevation={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading || (activeStep === 1 && verificationStatus !== 'verified')}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </FormContainer>
    </Box>
  );
};

export default InsuranceVerification; 