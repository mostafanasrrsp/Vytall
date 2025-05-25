import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
} from '@mui/material';
import { Phone, Add, Delete, Edit, Report } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const EmergencyContacts = () => {
  const theme = useTheme();
  const [contacts, setContacts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    isPrimary: false,
  });

  // Emergency services numbers
  const emergencyNumbers = [
    { name: 'Emergency Services', number: '911', description: 'For life-threatening emergencies' },
    { name: 'Poison Control', number: '1-800-222-1222', description: 'For poison emergencies' },
    { name: 'Suicide Prevention', number: '988', description: '24/7 crisis support' },
  ];

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData(contact);
    } else {
      setEditingContact(null);
      setFormData({
        name: '',
        relationship: '',
        phone: '',
        isPrimary: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContact(null);
  };

  const handleSaveContact = () => {
    if (editingContact) {
      setContacts(contacts.map(c => 
        c.id === editingContact.id ? { ...formData, id: c.id } : c
      ));
    } else {
      setContacts([...contacts, { ...formData, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleEmergencyCall = (number) => {
    // In a real app, this would integrate with the device's phone system
    window.location.href = `tel:${number}`;
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Emergency Services
      </Typography>

      {/* Emergency Services Quick Access */}
      <Card sx={{ mb: 4, bgcolor: theme.palette.grey.light }}>
        <CardContent>
          <Typography variant="h6" color="error" gutterBottom>
            Emergency Services Quick Access
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {emergencyNumbers.map((service) => (
              <Button
                key={service.number}
                variant="contained"
                color="error"
                startIcon={<Report />}
                onClick={() => handleEmergencyCall(service.number)}
                sx={{ flex: 1, minWidth: 200 }}
              >
                {service.name}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Emergency Contacts</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Contact
            </Button>
          </Box>

          <List>
            {contacts.map((contact) => (
              <ListItem key={contact.id}>
                <ListItemText
                  primary={contact.name}
                  secondary={`${contact.relationship} - ${contact.phone}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEmergencyCall(contact.phone)}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <Phone />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleOpenDialog(contact)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteContact(contact.id)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Add/Edit Contact Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Relationship"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveContact} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyContacts; 