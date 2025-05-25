import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  LocalPharmacy,
  Timeline,
  CheckCircle,
  Notifications,
  Celebration,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const MedicationAdherence = () => {
  const [adherence, setAdherence] = useState({
    currentStreak: 7,
    longestStreak: 14,
    totalDoses: 45,
    missedDoses: 2,
    adherenceRate: 95,
  });

  const [badges, setBadges] = useState([
    {
      id: 1,
      name: 'First Dose',
      description: 'Completed your first medication dose',
      icon: '💊',
      unlocked: true,
      date: '2024-01-01',
    },
    {
      id: 2,
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      icon: '🔥',
      unlocked: true,
      date: '2024-01-07',
    },
    {
      id: 3,
      name: 'Perfect Week',
      description: 'No missed doses for 7 days',
      icon: '⭐',
      unlocked: false,
      date: null,
    },
    {
      id: 4,
      name: 'Monthly Master',
      description: '30 days of perfect adherence',
      icon: '👑',
      unlocked: false,
      date: null,
    },
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      name: 'Early Bird',
      description: 'Take medication within 30 minutes of scheduled time',
      progress: 85,
      target: 100,
      icon: '🌅',
    },
    {
      id: 2,
      name: 'Consistency King',
      description: 'Maintain 90% adherence rate',
      progress: 95,
      target: 90,
      icon: '👑',
    },
    {
      id: 3,
      name: 'Perfect Timing',
      description: 'Take all doses at exactly the right time',
      progress: 70,
      target: 100,
      icon: '⏰',
    },
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    // Check for new achievements
    const checkAchievements = () => {
      if (adherence.currentStreak >= 7 && !badges.find(b => b.name === 'Week Warrior' && b.unlocked)) {
        unlockBadge('Week Warrior');
      }
      if (adherence.adherenceRate >= 100 && !badges.find(b => b.name === 'Perfect Week' && b.unlocked)) {
        unlockBadge('Perfect Week');
      }
    };

    checkAchievements();
  }, [adherence]);

  const unlockBadge = (badgeName) => {
    setBadges(prevBadges =>
      prevBadges.map(badge =>
        badge.name === badgeName
          ? { ...badge, unlocked: true, date: new Date().toISOString().split('T')[0] }
          : badge
      )
    );
    setShowCelebration(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'left' }}>
        Medication Adherence
      </Typography>
      {/* Current Streak and Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ mr: 1 }} />
                <Typography variant="h6">Current Streak</Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {adherence.currentStreak} days
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Longest streak: {adherence.longestStreak} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalPharmacy sx={{ mr: 1 }} />
                <Typography variant="h6">Adherence Rate</Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {adherence.adherenceRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={adherence.adherenceRate}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {adherence.totalDoses} doses taken, {adherence.missedDoses} missed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Badges Section */}
      <Typography variant="h5" gutterBottom>
        Your Badges
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {badges.map((badge) => (
          <Grid item xs={6} sm={4} md={3} key={badge.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  opacity: badge.unlocked ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleBadgeClick(badge)}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={badge.unlocked ? <CheckCircle color="success" /> : null}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        fontSize: '2rem',
                        bgcolor: badge.unlocked ? 'primary.main' : 'grey.300',
                      }}
                    >
                      {badge.icon}
                    </Avatar>
                  </Badge>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {badge.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {badge.unlocked ? 'Unlocked!' : 'Locked'}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Achievements Section */}
      <Typography variant="h5" gutterBottom>
        Achievements
      </Typography>
      <Grid container spacing={2}>
        {achievements.map((achievement) => (
          <Grid item xs={12} md={4} key={achievement.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {achievement.name}
                  </Typography>
                  <Typography variant="h4">
                    {achievement.icon}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {achievement.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(achievement.progress / achievement.target) * 100}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {achievement.progress}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Badge Details Dialog */}
      <Dialog
        open={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBadge && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {selectedBadge.icon}
                </Avatar>
                <Typography variant="h6">{selectedBadge.name}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography paragraph>
                {selectedBadge.description}
              </Typography>
              {selectedBadge.unlocked && (
                <Typography color="success.main">
                  Unlocked on {selectedBadge.date}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedBadge(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Celebration Dialog */}
      <Dialog
        open={showCelebration}
        onClose={() => setShowCelebration(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <Celebration sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          </motion.div>
          <Typography variant="h5" gutterBottom>
            Achievement Unlocked!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Keep up the great work with your medication adherence!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCelebration(false)}>Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationAdherence; 