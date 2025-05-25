import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const ResultsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
}));

// Mock data for lab results
const mockResults = [
  {
    id: 1,
    testName: 'Complete Blood Count (CBC)',
    testCode: 'CBC',
    dateCollected: '2024-03-15',
    dateReported: '2024-03-16',
    status: 'completed',
    results: {
      wbc: { value: '7.5', unit: 'K/uL', reference: '4.5-11.0' },
      rbc: { value: '4.8', unit: 'M/uL', reference: '4.2-5.8' },
      hgb: { value: '14.2', unit: 'g/dL', reference: '12.0-15.5' },
      hct: { value: '42', unit: '%', reference: '36-46' },
      plt: { value: '250', unit: 'K/uL', reference: '150-450' },
    },
    orderingProvider: 'Dr. Smith',
    labLocation: 'Main Lab',
    notes: 'All values within normal range',
  },
  {
    id: 2,
    testName: 'Comprehensive Metabolic Panel',
    testCode: 'CMP',
    dateCollected: '2024-03-15',
    dateReported: '2024-03-16',
    status: 'completed',
    results: {
      glucose: { value: '95', unit: 'mg/dL', reference: '70-99' },
      bun: { value: '15', unit: 'mg/dL', reference: '7-20' },
      creatinine: { value: '0.9', unit: 'mg/dL', reference: '0.6-1.2' },
      sodium: { value: '140', unit: 'mEq/L', reference: '135-145' },
      potassium: { value: '4.0', unit: 'mEq/L', reference: '3.5-5.0' },
    },
    orderingProvider: 'Dr. Smith',
    labLocation: 'Main Lab',
    notes: 'All values within normal range',
  },
  {
    id: 3,
    testName: 'Lipid Panel',
    testCode: 'LIPID',
    dateCollected: '2024-03-15',
    dateReported: '2024-03-16',
    status: 'completed',
    results: {
      totalCholesterol: { value: '180', unit: 'mg/dL', reference: '<200' },
      hdl: { value: '55', unit: 'mg/dL', reference: '>40' },
      ldl: { value: '100', unit: 'mg/dL', reference: '<100' },
      triglycerides: { value: '150', unit: 'mg/dL', reference: '<150' },
    },
    orderingProvider: 'Dr. Smith',
    labLocation: 'Main Lab',
    notes: 'All values within normal range',
  },
];

const LabResultsManagement = () => {
  const [results, setResults] = useState(mockResults);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filters, setFilters] = useState({
    testName: '',
    dateRange: [null, null],
    status: '',
    provider: '',
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowDetailsDialog(true);
  };

  const handleDownloadResult = async (result) => {
    setLoading(true);
    try {
      // Mock API call to download result
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real application, this would trigger a file download
      console.log('Downloading result:', result.id);
    } catch (err) {
      setError('Failed to download result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredResults = results.filter((result) => {
    return (
      (!filters.testName ||
        result.testName.toLowerCase().includes(filters.testName.toLowerCase())) &&
      (!filters.status || result.status === filters.status) &&
      (!filters.provider ||
        result.orderingProvider.toLowerCase().includes(filters.provider.toLowerCase()))
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lab Results Management
      </Typography>

      <ResultsContainer elevation={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FilterContainer>
          <TextField
            label="Search Test Name"
            value={filters.testName}
            onChange={(e) => handleFilterChange('testName', e.target.value)}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Provider"
            value={filters.provider}
            onChange={(e) => handleFilterChange('provider', e.target.value)}
            size="small"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={filters.dateRange[0]}
              onChange={(date) =>
                handleFilterChange('dateRange', [date, filters.dateRange[1]])
              }
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <DatePicker
              label="To Date"
              value={filters.dateRange[1]}
              onChange={(date) =>
                handleFilterChange('dateRange', [filters.dateRange[0], date])
              }
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>
        </FilterContainer>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test Name</TableCell>
                <TableCell>Date Collected</TableCell>
                <TableCell>Date Reported</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResults
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.testName}</TableCell>
                    <TableCell>{result.dateCollected}</TableCell>
                    <TableCell>{result.dateReported}</TableCell>
                    <TableCell>
                      <Chip
                        label={result.status}
                        color={getStatusColor(result.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{result.orderingProvider}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(result)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleDownloadResult(result)}
                        disabled={loading}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredResults.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ResultsContainer>

      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedResult && (
          <>
            <DialogTitle>
              {selectedResult.testName} Results
              <Chip
                label={selectedResult.status}
                color={getStatusColor(selectedResult.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Test Information</Typography>
                  <Typography>Test Code: {selectedResult.testCode}</Typography>
                  <Typography>
                    Date Collected: {selectedResult.dateCollected}
                  </Typography>
                  <Typography>
                    Date Reported: {selectedResult.dateReported}
                  </Typography>
                  <Typography>
                    Ordering Provider: {selectedResult.orderingProvider}
                  </Typography>
                  <Typography>Lab Location: {selectedResult.labLocation}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Results
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Test</TableCell>
                          <TableCell>Result</TableCell>
                          <TableCell>Unit</TableCell>
                          <TableCell>Reference Range</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(selectedResult.results).map(
                          ([key, value]) => (
                            <TableRow key={key}>
                              <TableCell>{key.toUpperCase()}</TableCell>
                              <TableCell>{value.value}</TableCell>
                              <TableCell>{value.unit}</TableCell>
                              <TableCell>{value.reference}</TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {selectedResult.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Notes</Typography>
                    <Typography>{selectedResult.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDownloadResult(selectedResult)}
                startIcon={<DownloadIcon />}
                disabled={loading}
              >
                Download
              </Button>
              <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default LabResultsManagement; 