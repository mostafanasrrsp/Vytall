import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  getInsuranceStatus,
  getClaims,
  getInsuranceProviders,
} from '../../api/insurance';

const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'verified'
      ? theme.palette.success.light
      : status === 'pending'
      ? theme.palette.warning.light
      : theme.palette.error.light,
  color: theme.palette.getContrastText(
    status === 'verified'
      ? theme.palette.success.light
      : status === 'pending'
      ? theme.palette.warning.light
      : theme.palette.error.light
  ),
}));

const InsuranceDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insuranceStatus, setInsuranceStatus] = useState(null);
  const [claims, setClaims] = useState([]);
  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch insurance status
        const statusData = await getInsuranceStatus('current');
        setInsuranceStatus(statusData);

        // Fetch claims
        const claimsData = await getClaims();
        setClaims(claimsData);

        // Calculate claim statistics
        const stats = claimsData.reduce(
          (acc, claim) => {
            acc.totalClaims++;
            switch (claim.status) {
              case 'pending':
                acc.pendingClaims++;
                break;
              case 'approved':
                acc.approvedClaims++;
                break;
              case 'rejected':
                acc.rejectedClaims++;
                break;
            }
            return acc;
          },
          { totalClaims: 0, pendingClaims: 0, approvedClaims: 0, rejectedClaims: 0 }
        );
        setStats(stats);

        // Fetch insurance providers
        const providersData = await getInsuranceProviders();
        setProviders(providersData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <VerifiedIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'rejected':
        return <ErrorIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  const getClaimStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'rejected':
        return <CancelIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Insurance Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Insurance Status */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Insurance Status
              </Typography>
              {insuranceStatus ? (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStatusIcon(insuranceStatus.status)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {insuranceStatus.provider}
                    </Typography>
                    <StatusChip
                      label={insuranceStatus.status}
                      status={insuranceStatus.status}
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Policy Number: {insuranceStatus.policyNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member ID: {insuranceStatus.memberId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Verified: {new Date(insuranceStatus.lastVerified).toLocaleDateString()}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary" gutterBottom>
                    No insurance information found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/insurance/verify')}
                  >
                    Add Insurance
                  </Button>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                onClick={() => navigate('/insurance/verify')}
                variant="outlined"
              >
                {insuranceStatus ? 'Update Insurance' : 'Add Insurance'}
              </Button>
            </CardActions>
          </DashboardCard>
        </Grid>

        {/* Claims Overview */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Claims Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Claims
                  </Typography>
                  <Typography variant="h4">{stats.totalClaims}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Claims
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingClaims}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Approved Claims
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.approvedClaims}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rejected Claims
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.rejectedClaims}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(stats.approvedClaims / stats.totalClaims) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Approval Rate: {((stats.approvedClaims / stats.totalClaims) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/insurance/claims/new')}
              >
                Submit New Claim
              </Button>
            </CardActions>
          </DashboardCard>
        </Grid>

        {/* Recent Claims */}
        <Grid item xs={12}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Claims
              </Typography>
              {claims.length > 0 ? (
                <List>
                  {claims.slice(0, 5).map((claim) => (
                    <React.Fragment key={claim.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getClaimStatusIcon(claim.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={claim.procedure}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                Claim ID: {claim.id}
                              </Typography>
                              <br />
                              <Typography component="span" variant="caption">
                                Submitted: {new Date(claim.submittedDate).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2">
                            ${claim.amount}
                          </Typography>
                          <StatusChip
                            label={claim.status}
                            status={claim.status}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/insurance/claims/${claim.id}`)}
                          >
                            <DescriptionIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" align="center">
                  No claims found
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                onClick={() => navigate('/insurance/claims')}
                variant="outlined"
              >
                View All Claims
              </Button>
            </CardActions>
          </DashboardCard>
        </Grid>

        {/* Insurance Providers */}
        <Grid item xs={12}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Insurance Providers
              </Typography>
              <Grid container spacing={2}>
                {providers.map((provider) => (
                  <Grid item xs={12} sm={6} md={4} key={provider.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">
                          {provider.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {provider.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Network: {provider.network}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsuranceDashboard; 