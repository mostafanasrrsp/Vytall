import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const ClaimSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [claimData, setClaimData] = useState({
    patientName: '',
    dateOfService: new Date(),
    providerName: '',
    diagnosisCode: '',
    procedureCode: '',
    totalAmount: '',
    insuranceProvider: '',
    policyNumber: '',
    claimType: '',
    notes: '',
  });

  const [services, setServices] = useState([
    {
      id: 1,
      date: new Date(),
      procedure: '',
      diagnosis: '',
      amount: '',
      notes: '',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClaimData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (id, field, value) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: new Date(),
        procedure: '',
        diagnosis: '',
        amount: '',
        notes: '',
      },
    ]);
  };

  const removeService = (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  const calculateTotal = () => {
    return services.reduce((sum, service) => sum + (Number(service.amount) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate form
      if (!validateForm()) {
        return;
      }

      // Mock API call to submit claim
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setSuccess(true);
      // Reset form after successful submission
      resetForm();
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'patientName',
      'providerName',
      'insuranceProvider',
      'policyNumber',
      'claimType',
    ];

    const missingFields = requiredFields.filter((field) => !claimData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (services.length === 0) {
      setError('Please add at least one service');
      return false;
    }

    const invalidServices = services.some(
      (service) => !service.procedure || !service.diagnosis || !service.amount
    );
    if (invalidServices) {
      setError('Please fill in all required fields for each service');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setClaimData({
      patientName: '',
      dateOfService: new Date(),
      providerName: '',
      diagnosisCode: '',
      procedureCode: '',
      totalAmount: '',
      insuranceProvider: '',
      policyNumber: '',
      claimType: '',
      notes: '',
    });
    setServices([
      {
        id: Date.now(),
        date: new Date(),
        procedure: '',
        diagnosis: '',
        amount: '',
        notes: '',
      },
    ]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Submit Insurance Claim
      </Typography>

      <FormContainer elevation={3}>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Claim submitted successfully!
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Patient Name"
                name="patientName"
                value={claimData.patientName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Provider Name"
                name="providerName"
                value={claimData.providerName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Insurance Provider"
                name="insuranceProvider"
                value={claimData.insuranceProvider}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Policy Number"
                name="policyNumber"
                value={claimData.policyNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Claim Type</InputLabel>
                <Select
                  name="claimType"
                  value={claimData.claimType}
                  onChange={handleInputChange}
                  label="Claim Type"
                >
                  <MenuItem value="medical">Medical</MenuItem>
                  <MenuItem value="dental">Dental</MenuItem>
                  <MenuItem value="vision">Vision</MenuItem>
                  <MenuItem value="pharmacy">Pharmacy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={2}
                value={claimData.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Services
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Procedure</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={service.date}
                          onChange={(date) => handleServiceChange(service.id, 'date', date)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <TextField
                        required
                        value={service.procedure}
                        onChange={(e) =>
                          handleServiceChange(service.id, 'procedure', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        required
                        value={service.diagnosis}
                        onChange={(e) =>
                          handleServiceChange(service.id, 'diagnosis', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        required
                        type="number"
                        value={service.amount}
                        onChange={(e) =>
                          handleServiceChange(service.id, 'amount', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={service.notes}
                        onChange={(e) =>
                          handleServiceChange(service.id, 'notes', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => removeService(service.id)}
                        disabled={services.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, mb: 3 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={addService}
              variant="outlined"
              color="primary"
            >
              Add Service
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Total Amount: ${calculateTotal().toFixed(2)}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Claim'}
            </Button>
          </Box>
        </form>
      </FormContainer>
    </Box>
  );
};

export default ClaimSubmission; 