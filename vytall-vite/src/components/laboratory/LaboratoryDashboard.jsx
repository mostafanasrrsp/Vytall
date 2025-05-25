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
  Avatar,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  getLabOrders,
  getLabResults,
  getLabLocations,
  getTestCategories,
  getAvailableTests,
} from '../../api/laboratory';

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
    status === 'completed'
      ? theme.palette.success.light
      : status === 'pending'
      ? theme.palette.warning.light
      : status === 'cancelled'
      ? theme.palette.error.light
      : theme.palette.info.light,
  color: theme.palette.getContrastText(
    status === 'completed'
      ? theme.palette.success.light
      : status === 'pending'
      ? theme.palette.warning.light
      : status === 'cancelled'
      ? theme.palette.error.light
      : theme.palette.info.light
  ),
}));

const LaboratoryDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch lab orders
        const ordersData = await getLabOrders();
        setOrders(ordersData);

        // Calculate order statistics
        const stats = ordersData.reduce(
          (acc, order) => {
            acc.totalOrders++;
            switch (order.status) {
              case 'pending':
                acc.pendingOrders++;
                break;
              case 'completed':
                acc.completedOrders++;
                break;
              case 'cancelled':
                acc.cancelledOrders++;
                break;
            }
            return acc;
          },
          { totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelledOrders: 0 }
        );
        setStats(stats);

        // Fetch lab results
        const resultsData = await getLabResults();
        setResults(resultsData);

        // Fetch lab locations
        const locationsData = await getLabLocations();
        setLocations(locationsData);

        // Fetch test categories
        const categoriesData = await getTestCategories();
        setCategories(categoriesData);
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
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'cancelled':
        return <ErrorIcon color="error" />;
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
        Laboratory Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/laboratory/order')}
                  >
                    Order New Test
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AssignmentIcon />}
                    onClick={() => navigate('/laboratory/results')}
                  >
                    View Results
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Orders Overview */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Orders Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h4">{stats.totalOrders}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Orders
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pendingOrders}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Completed Orders
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.completedOrders}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cancelled Orders
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.cancelledOrders}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(stats.completedOrders / stats.totalOrders) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Completion Rate: {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              {orders.length > 0 ? (
                <List>
                  {orders.slice(0, 5).map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(order.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={order.testName}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                Order ID: {order.id}
                              </Typography>
                              <br />
                              <Typography component="span" variant="caption">
                                Ordered: {new Date(order.orderDate).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <StatusChip
                            label={order.status}
                            status={order.status}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/laboratory/orders/${order.id}`)}
                          >
                            <AssignmentIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" align="center">
                  No recent orders
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                onClick={() => navigate('/laboratory/orders')}
                variant="outlined"
              >
                View All Orders
              </Button>
            </CardActions>
          </DashboardCard>
        </Grid>

        {/* Recent Results */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Results
              </Typography>
              {results.length > 0 ? (
                <List>
                  {results.slice(0, 5).map((result) => (
                    <React.Fragment key={result.id}>
                      <ListItem>
                        <ListItemIcon>
                          <ScienceIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={result.testName}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {result.labLocation}
                              </Typography>
                              <br />
                              <Typography component="span" variant="caption">
                                Reported: {new Date(result.dateReported).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/laboratory/results/${result.id}`)}
                          >
                            <AssignmentIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/laboratory/results/${result.id}/download`)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" align="center">
                  No recent results
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                onClick={() => navigate('/laboratory/results')}
                variant="outlined"
              >
                View All Results
              </Button>
            </CardActions>
          </DashboardCard>
        </Grid>

        {/* Lab Locations */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lab Locations
              </Typography>
              <Grid container spacing={2}>
                {locations.map((location) => (
                  <Grid item xs={12} sm={6} key={location.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            {location.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {location.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hours: {location.hours}
                        </Typography>
                        <Chip
                          size="small"
                          label={location.status}
                          color={location.status === 'open' ? 'success' : 'error'}
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Test Categories */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Categories
              </Typography>
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid item xs={12} sm={6} key={category.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CategoryIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            {category.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {category.testCount} tests available
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

export default LaboratoryDashboard; 