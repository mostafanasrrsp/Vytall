import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const BaseDashboard = ({ 
  title,
  children,
  quickActions,
  mainContent,
  sidebarContent,
  alerts
}) => {
  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {alerts && (
          <Box sx={{ mb: 2 }}>
            {alerts}
          </Box>
        )}
      </Box>

      {/* Quick Actions */}
      {quickActions && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            {quickActions}
          </Grid>
        </Paper>
      )}

      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={sidebarContent ? 8 : 12}>
          <Paper sx={{ p: 2 }}>
            {mainContent}
          </Paper>
        </Grid>

        {/* Sidebar Content */}
        {sidebarContent && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              {sidebarContent}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Additional Content */}
      {children}
    </Box>
  );
};

export default BaseDashboard; 