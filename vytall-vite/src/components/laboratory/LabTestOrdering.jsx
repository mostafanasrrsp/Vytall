import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

// Mock data for lab tests
const availableTests = [
  { id: 1, name: 'Complete Blood Count (CBC)', category: 'Blood Tests', code: 'CBC' },
  { id: 2, name: 'Comprehensive Metabolic Panel', category: 'Blood Tests', code: 'CMP' },
  { id: 3, name: 'Lipid Panel', category: 'Blood Tests', code: 'LIPID' },
  { id: 4, name: 'Hemoglobin A1C', category: 'Diabetes', code: 'HBA1C' },
  { id: 5, name: 'Thyroid Stimulating Hormone', category: 'Hormones', code: 'TSH' },
  { id: 6, name: 'Urinalysis', category: 'Urine Tests', code: 'UA' },
  { id: 7, name: 'Urine Culture', category: 'Urine Tests', code: 'UC' },
  { id: 8, name: 'Stool Culture', category: 'Stool Tests', code: 'SC' },
];

const LabTestOrdering = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [orderData, setOrderData] = useState({
    patientName: '',
    dateOfBirth: '',
    orderingProvider: '',
    priority: 'routine',
    clinicalInformation: '',
    labLocation: '',
  });

  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestSelection = (event, newValue) => {
    setSelectedTests(newValue);
  };

  const removeTest = (testId) => {
    setSelectedTests((prev) => prev.filter((test) => test.id !== testId));
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

      // Mock API call to submit lab order
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      // Reset form after successful submission
      resetForm();
    } catch (err) {
      setError('Failed to submit lab order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'patientName',
      'dateOfBirth',
      'orderingProvider',
      'labLocation',
    ];

    const missingFields = requiredFields.filter((field) => !orderData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (selectedTests.length === 0) {
      setError('Please select at least one lab test');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setOrderData({
      patientName: '',
      dateOfBirth: '',
      orderingProvider: '',
      priority: 'routine',
      clinicalInformation: '',
      labLocation: '',
    });
    setSelectedTests([]);
    setSelectedDate(new Date());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Lab Tests
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
              Lab order submitted successfully!
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Patient Name"
                name="patientName"
                value={orderData.patientName}
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
                value={orderData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Ordering Provider"
                name="orderingProvider"
                value={orderData.orderingProvider}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={orderData.priority}
                  onChange={handleInputChange}
                  label="Priority"
                >
                  <MenuItem value="routine">Routine</MenuItem>
                  <MenuItem value="stat">STAT</MenuItem>
                  <MenuItem value="asap">ASAP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Lab Location"
                name="labLocation"
                value={orderData.labLocation}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Preferred Test Date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clinical Information"
                name="clinicalInformation"
                multiline
                rows={3}
                value={orderData.clinicalInformation}
                onChange={handleInputChange}
                placeholder="Enter relevant clinical information, symptoms, or reason for testing"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Lab Tests
            </Typography>
            <Autocomplete
              multiple
              options={availableTests}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              value={selectedTests}
              onChange={handleTestSelection}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search and select lab tests"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`${option.name} (${option.code})`}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Box>

          {selectedTests.length > 0 && (
            <TableContainer sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.code}</TableCell>
                      <TableCell>{test.category}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => removeTest(test.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Order'}
            </Button>
          </Box>
        </form>
      </FormContainer>
    </Box>
  );
};

export default LabTestOrdering; 