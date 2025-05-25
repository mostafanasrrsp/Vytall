import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Link,
  useTheme,
} from '@mui/material';
import {
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getProviders, getMessages } from '../../api/telemedicine';

// Use explicit soft background colors for stat cards
const STAT_BG_COLORS = {
  primary: '#f5faff',      // lighter blue
  secondary: '#fff0f6',    // lighter pink
  info: '#f0fbff',         // lighter cyan
  success: '#f4fbf5',      // lighter green
  warning: '#fff8ed',      // lighter orange
  purple: '#faf3fb',       // lighter purple
  teal: '#f0fcfa',         // lighter teal
  gray: '#fafafa',         // lighter gray
  indigo: '#f4f5fa',       // lighter indigo
  amber: '#fffbea',        // lighter amber
  deepPurple: '#f7f3fa',   // lighter deep purple
  cyan: '#f0fdff',         // lighter cyan
};

const STAT_ICON_COLORS = {
  primary: '#1976d2',
  secondary: '#c2185b',
  info: '#0288d1',
  success: '#388e3c',
  warning: '#f57c00',
  purple: '#7b1fa2',
  teal: '#00796b',
  gray: '#757575',
  indigo: '#3949ab',
  amber: '#ffa000',
  deepPurple: '#5e35b1',
  cyan: '#0097a7',
};

const StatCard = styled(Card)(({ color = 'primary' }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: 20,
  background: STAT_BG_COLORS[color] || STAT_BG_COLORS.gray,
  color: '#222',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  border: 'none',
  minHeight: 90,
  height: '100%',
  marginBottom: 0,
}));

const StatIconBox = styled(Box)(({ color = 'primary' }) => ({
  background: STAT_BG_COLORS[color] || STAT_BG_COLORS.gray,
  color: STAT_ICON_COLORS[color] || STAT_ICON_COLORS.gray,
  borderRadius: '50%',
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 16,
  fontSize: 28,
}));

const DashboardCard = styled(Card)(({ color = 'gray' }) => ({
  background: STAT_BG_COLORS[color] || STAT_BG_COLORS.gray,
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  border: 'none',
  padding: 20,
  height: '100%',
}));

const ProviderAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary[100],
  color: theme.palette.primary[700],
  width: theme.spacing(5),
  height: theme.spacing(5),
  border: `2px solid ${theme.palette.primary[200]}`,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.grey[800],
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary[600],
  },
}));

const ActionButton = styled(Button)(({ theme, variant = 'contained', color = 'primary' }) => ({
  textTransform: 'none',
  fontWeight: 500,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius * 1.5,
  ...(variant === 'contained' && {
    background: `linear-gradient(135deg, ${theme.palette[color][500]} 0%, ${theme.palette[color][600]} 100%)`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette[color][600]} 0%, ${theme.palette[color][700]} 100%)`,
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: theme.palette[color][300],
    color: theme.palette[color][700],
    '&:hover': {
      borderColor: theme.palette[color][500],
      backgroundColor: theme.palette[color][50],
    },
  }),
}));

// Add a section wrapper for consistent padding
const SectionWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(7),
  padding: theme.spacing(0, 0, 0, 0),
}));

const TelemedicineDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch providers
        const providersData = await getProviders();
        
        // Ensure providersData is an array
        if (!Array.isArray(providersData)) {
          console.error('Providers data is not an array:', providersData);
          setProviders([]);
          setRecentMessages([]);
          setUpcomingConsultations([]);
          return;
        }

        setProviders(providersData);

        // Fetch recent messages for each provider (limit to first 3 providers)
        const messagesPromises = providersData
          .slice(0, 3)
          .map(provider => getMessages(provider.id).catch(err => {
            console.error(`Failed to fetch messages for provider ${provider.id}:`, err);
            return []; // Return empty array if message fetch fails for a provider
          }));

        const messagesResults = await Promise.all(messagesPromises);
        const recentMessagesData = messagesResults
          .flat()
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);
        setRecentMessages(recentMessagesData);

        // Mock upcoming consultations (replace with actual API call)
        const mockConsultations = providersData.slice(0, 2).map((provider, index) => ({
          id: index + 1,
          provider,
          date: new Date(Date.now() + (index + 1) * 3600000),
          type: 'video',
        }));
        setUpcomingConsultations(mockConsultations);

      } catch (err) {
        console.error('Error in fetchDashboardData:', err);
        setError('Failed to load dashboard data');
        setProviders([]);
        setRecentMessages([]);
        setUpcomingConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStartVideoCall = (providerId) => {
    navigate(`/telemedicine/video/${providerId}`, { state: { providerId } });
  };

  const handleStartMessaging = (providerId) => {
    navigate(`/telemedicine/messaging/${providerId}`, { state: { providerId } });
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
      {/* Quick Stats Section */}
      <SectionWrapper>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={3}>
            <StatCard color="primary">
              <StatIconBox color="primary">
                <GroupIcon sx={{ fontSize: 28, color: STAT_ICON_COLORS.primary }} />
              </StatIconBox>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {providers.length}
                </Typography>
                <Typography variant="body2" color="primary.600" fontWeight={500}>
                  Active Patients
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard color="secondary">
              <StatIconBox color="secondary">
                <CalendarIcon sx={{ fontSize: 28, color: STAT_ICON_COLORS.secondary }} />
              </StatIconBox>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {upcomingConsultations.filter(c => new Date(c.date).toDateString() === new Date().toDateString()).length}
                </Typography>
                <Typography variant="body2" color="secondary.600" fontWeight={500}>
                  Today's Consultations
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard color="info">
              <StatIconBox color="info">
                <NotificationsIcon sx={{ fontSize: 28, color: STAT_ICON_COLORS.info }} />
              </StatIconBox>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {recentMessages.filter(m => !m.read).length}
                </Typography>
                <Typography variant="body2" color="info.600" fontWeight={500}>
                  Pending Messages
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard color="success">
              <StatIconBox color="success">
                <AccessTimeIcon sx={{ fontSize: 28, color: STAT_ICON_COLORS.success }} />
              </StatIconBox>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {upcomingConsultations.length}
                </Typography>
                <Typography variant="body2" color="success.600" fontWeight={500}>
                  Consultation Hours
                </Typography>
              </Box>
            </StatCard>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Telemedicine Services Section */}
      <SectionWrapper>
        <SectionTitle variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          <VideocamIcon sx={{ color: STAT_ICON_COLORS.purple }} /> Telemedicine Services
        </SectionTitle>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <DashboardCard color="primary" sx={{ p: 3, minHeight: 120 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton 
                    size="large"
                    sx={{ 
                      backgroundColor: STAT_BG_COLORS.primary,
                      color: STAT_ICON_COLORS.primary,
                    }}
                    disabled
                  >
                    <MessageIcon sx={{ color: STAT_ICON_COLORS.primary }} />
                  </IconButton>
                  <Typography variant="h6" fontWeight={700} color={STAT_ICON_COLORS.primary}>
                    Patient Communications
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<MessageIcon sx={{ color: '#1976d2' }} />}
                      onClick={() => navigate('/telemedicine/messaging')}
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#bbdefb' }
                      }}
                    >
                      Start Messaging
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<VideoCallIcon sx={{ color: '#7b1fa2' }} />}
                      onClick={() => navigate('/telemedicine/video')}
                      sx={{
                        backgroundColor: '#f3e5f5',
                        color: '#7b1fa2',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#e1bee7' }
                      }}
                    >
                      Start Video Call
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardCard color="purple" sx={{ p: 3, minHeight: 120 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton 
                    size="large"
                    sx={{ 
                      backgroundColor: STAT_BG_COLORS.purple,
                      color: STAT_ICON_COLORS.purple,
                    }}
                    disabled
                  >
                    <ScheduleIcon sx={{ color: STAT_ICON_COLORS.purple }} />
                  </IconButton>
                  <Typography variant="h6" fontWeight={700} color={STAT_ICON_COLORS.purple}>
                    Schedule Management
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ScheduleIcon sx={{ color: '#3949ab' }} />}
                      onClick={() => navigate('/telemedicine/schedule')}
                      sx={{
                        backgroundColor: '#e8eaf6',
                        color: '#3949ab',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#c5cae9' }
                      }}
                    >
                      View Schedule
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<GroupIcon sx={{ color: '#00796b' }} />}
                      onClick={() => navigate('/telemedicine/patients')}
                      sx={{
                        backgroundColor: '#e0f2f1',
                        color: '#00796b',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#b2dfdb' }
                      }}
                    >
                      Patient List
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Upcoming Consultations Section */}
      <SectionWrapper>
        <SectionTitle variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          <CalendarIcon sx={{ color: STAT_ICON_COLORS.info }} /> Upcoming Consultations
        </SectionTitle>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12}>
            <DashboardCard color="info" sx={{ p: 3 }}>
              <CardContent sx={{ p: 0 }}>
                {upcomingConsultations.length > 0 ? (
                  <List>
                    {upcomingConsultations.map((consultation) => (
                      <React.Fragment key={consultation.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: STAT_BG_COLORS.info, color: STAT_ICON_COLORS.info }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="600" color={STAT_ICON_COLORS.info}>
                                {consultation.provider.name}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="grey.600">
                                  {new Date(consultation.date).toLocaleString()}
                                </Typography>
                                <br />
                                <Chip
                                  size="small"
                                  icon={<VideoCallIcon sx={{ color: STAT_ICON_COLORS.info }} />}
                                  label="Video Consultation"
                                  sx={{ mt: 1, backgroundColor: STAT_BG_COLORS.info, color: STAT_ICON_COLORS.info, fontWeight: 500 }}
                                />
                              </>
                            }
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<VideoCallIcon />}
                              onClick={() => handleStartVideoCall(consultation.provider.id)}
                            >
                              Join
                            </Button>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<MessageIcon />}
                              onClick={() => handleStartMessaging(consultation.provider.id)}
                            >
                              Message
                            </Button>
                          </Box>
                        </ListItem>
                        <Divider sx={{ borderColor: '#e0e0e0' }} />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography color="grey.600" align="center" sx={{ py: 3 }}>
                    No upcoming consultations
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/telemedicine/schedule')}
                  sx={{
                    backgroundColor: '#f5faff',
                    color: '#1976d2',
                    borderColor: '#bbdefb',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#e3f2fd', borderColor: '#90caf9' }
                  }}
                >
                  View Full Schedule
                </Button>
              </CardActions>
            </DashboardCard>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Recent Communications Section */}
      <SectionWrapper>
        <SectionTitle variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          <ChatIcon sx={{ color: STAT_ICON_COLORS.indigo }} /> Recent Communications
        </SectionTitle>
        <Grid container spacing={3} sx={{ mb: 0 }} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <DashboardCard color="indigo" sx={{ p: 3, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent sx={{ height: '100%', p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton 
                    size="large"
                    sx={{ 
                      backgroundColor: STAT_BG_COLORS.indigo,
                      color: STAT_ICON_COLORS.indigo,
                    }}
                    disabled
                  >
                    <MessageIcon sx={{ color: STAT_ICON_COLORS.indigo }} />
                  </IconButton>
                  <Typography variant="h6" fontWeight={700} color={STAT_ICON_COLORS.indigo}>Recent Messages</Typography>
                </Box>
                {recentMessages.length > 0 ? (
                  <List>
                    {recentMessages.map((message) => (
                      <React.Fragment key={message.id}>
                        <ListItem
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                              borderRadius: theme.shape.borderRadius,
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <ProviderAvatar>
                              <PersonIcon sx={{ color: STAT_ICON_COLORS.indigo }} />
                            </ProviderAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={600}>
                                {message.content}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {message.sender === 'provider' ? 'From: ' : 'To: '}
                                  {providers.find(p => p.id === message.providerId)?.name}
                                </Typography>
                                <br />
                                <Typography component="span" variant="caption" color="text.secondary">
                                  {new Date(message.timestamp).toLocaleString()}
                                </Typography>
                              </>
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleStartMessaging(message.providerId)}
                            sx={{ 
                              color: STAT_ICON_COLORS.indigo,
                              '&:hover': { backgroundColor: STAT_BG_COLORS.indigo }
                            }}
                          >
                            <MessageIcon />
                          </IconButton>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary" align="center" sx={{ py: 3, fontWeight: 400 }}>
                    No recent messages
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ pt: 0, pb: 2 }}>
                <Button
                  fullWidth
                  onClick={() => navigate('/telemedicine/messaging')}
                  sx={{ 
                    color: STAT_ICON_COLORS.indigo,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: STAT_BG_COLORS.indigo }
                  }}
                >
                  View All Messages
                </Button>
              </CardActions>
            </DashboardCard>
          </Grid>

          {/* Consultation History */}
          <Grid item xs={12} md={6}>
            <DashboardCard color="deepPurple" sx={{ p: 3, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent sx={{ height: '100%', p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton 
                    size="large"
                    sx={{ 
                      backgroundColor: STAT_BG_COLORS.deepPurple,
                      color: STAT_ICON_COLORS.deepPurple,
                    }}
                    disabled
                  >
                    <HistoryIcon sx={{ color: STAT_ICON_COLORS.deepPurple }} />
                  </IconButton>
                  <Typography variant="h6" fontWeight={700} color={STAT_ICON_COLORS.deepPurple}>Consultation History</Typography>
                </Box>
                <List>
                  {upcomingConsultations
                    .filter(c => new Date(c.date) < new Date())
                    .slice(0, 5)
                    .map((consultation) => (
                      <React.Fragment key={consultation.id}>
                        <ListItem
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                              borderRadius: theme.shape.borderRadius,
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <ProviderAvatar>
                              <PersonIcon sx={{ color: STAT_ICON_COLORS.deepPurple }} />
                            </ProviderAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={600}>
                                {consultation.provider.name}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {new Date(consultation.date).toLocaleString()}
                                </Typography>
                                <br />
                                <Chip
                                  size="small"
                                  icon={<VideoCallIcon sx={{ color: STAT_ICON_COLORS.deepPurple }} />}
                                  label="Completed"
                                  sx={{ mt: 1, color: STAT_ICON_COLORS.deepPurple, fontWeight: 500 }}
                                />
                              </>
                            }
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/telemedicine/consultation/${consultation.id}`)}
                            sx={{ 
                              color: STAT_ICON_COLORS.deepPurple,
                              borderColor: STAT_ICON_COLORS.deepPurple,
                              fontWeight: 600,
                              '&:hover': { 
                                borderColor: STAT_ICON_COLORS.deepPurple,
                                backgroundColor: STAT_BG_COLORS.deepPurple 
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                </List>
              </CardContent>
              <CardActions sx={{ pt: 0, pb: 2 }}>
                <Button
                  fullWidth
                  onClick={() => navigate('/telemedicine/history')}
                  sx={{ 
                    color: STAT_ICON_COLORS.deepPurple,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: STAT_BG_COLORS.deepPurple }
                  }}
                >
                  View Full History
                </Button>
              </CardActions>
            </DashboardCard>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Available Providers Section */}
      <SectionWrapper>
        <SectionTitle variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          <GroupIcon sx={{ color: STAT_ICON_COLORS.cyan }} /> Available Providers
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard color="cyan" sx={{ p: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton 
                    size="large"
                    sx={{ 
                      backgroundColor: STAT_BG_COLORS.cyan,
                      color: STAT_ICON_COLORS.cyan,
                    }}
                    disabled
                  >
                    <GroupIcon sx={{ color: STAT_ICON_COLORS.cyan }} />
                  </IconButton>
                  <Typography variant="h6" fontWeight={700} color={STAT_ICON_COLORS.cyan}>Provider List</Typography>
                </Box>
                <List>
                  {providers.map((provider) => (
                    <React.Fragment key={provider.id}>
                      <ListItem
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: theme.shape.borderRadius,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <ProviderAvatar>
                            <PersonIcon sx={{ color: STAT_ICON_COLORS.cyan }} />
                          </ProviderAvatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={600}>
                              {provider.name}
                            </Typography>
                          }
                          secondary={<Typography fontWeight={400}>{provider.specialty}</Typography>}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<MessageIcon sx={{ color: '#fff' }} />}
                            onClick={() => handleStartMessaging(provider.id)}
                            sx={{ 
                              backgroundColor: STAT_ICON_COLORS.cyan,
                              color: '#fff',
                              fontWeight: 600,
                              '&:hover': { backgroundColor: '#00838f' }
                            }}
                          >
                            Message
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<VideoCallIcon sx={{ color: '#fff' }} />}
                            onClick={() => handleStartVideoCall(provider.id)}
                            sx={{ 
                              backgroundColor: STAT_ICON_COLORS.indigo,
                              color: '#fff',
                              fontWeight: 600,
                              '&:hover': { backgroundColor: '#283593' }
                            }}
                          >
                            Video
                          </Button>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  onClick={() => navigate('/telemedicine/providers')}
                  sx={{ 
                    color: STAT_ICON_COLORS.cyan,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: STAT_BG_COLORS.cyan }
                  }}
                >
                  View All Providers
                </Button>
              </CardActions>
            </DashboardCard>
          </Grid>
        </Grid>
      </SectionWrapper>
    </Box>
  );
};

export default TelemedicineDashboard; 