import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const MessageContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  marginBottom: theme.spacing(2),
}));

const MessageInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

const SecureMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Mock data - will be replaced with actual API calls
  const providers = [
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Johnson', specialty: 'Pediatrics' },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedProvider) return;

    const message = {
      id: Date.now(),
      content: newMessage,
      sender: 'patient', // or 'provider'
      timestamp: new Date().toISOString(),
      providerId: selectedProvider.id,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    // TODO: Implement actual API call to send message
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Secure Messaging
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
        {/* Provider List */}
        <Paper sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Healthcare Providers
          </Typography>
          <List>
            {providers.map((provider) => (
              <ListItem
                key={provider.id}
                button
                selected={selectedProvider?.id === provider.id}
                onClick={() => setSelectedProvider(provider)}
              >
                <ListItemText
                  primary={provider.name}
                  secondary={provider.specialty}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Chat Area */}
        <MessageContainer elevation={3}>
          {selectedProvider ? (
            <>
              <Typography variant="h6" gutterBottom>
                Chat with {selectedProvider.name}
              </Typography>
              <MessageList>
                {messages
                  .filter((msg) => msg.providerId === selectedProvider.id)
                  .map((message) => (
                    <ListItem key={message.id}>
                      <ListItemText
                        primary={message.content}
                        secondary={new Date(message.timestamp).toLocaleString()}
                        sx={{
                          textAlign: message.sender === 'patient' ? 'right' : 'left',
                        }}
                      />
                    </ListItem>
                  ))}
              </MessageList>
              <Divider />
              <MessageInput>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
              </MessageInput>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Select a healthcare provider to start messaging
              </Typography>
            </Box>
          )}
        </MessageContainer>
      </Box>
    </Box>
  );
};

export default SecureMessaging; 