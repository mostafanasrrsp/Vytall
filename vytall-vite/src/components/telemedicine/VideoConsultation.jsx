import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon,
  ScreenShare as ScreenShareIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VideoContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 'calc(100vh - 200px)',
  position: 'relative',
  backgroundColor: theme.palette.grey[900],
}));

const VideoGrid = styled(Grid)(({ theme }) => ({
  height: '100%',
}));

const VideoBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.grey[800],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: theme.shape.borderRadius,
}));

const VideoConsultation = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(true);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Mock function to start/stop local video
  const toggleLocalVideo = async () => {
    try {
      if (!isVideoOff) {
        // Stop video
        if (localVideoRef.current?.srcObject) {
          localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
          localVideoRef.current.srcObject = null;
        }
      } else {
        // Start video
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
      setIsVideoOff(!isVideoOff);
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  // Mock function to start/stop local audio
  const toggleLocalAudio = async () => {
    try {
      if (localVideoRef.current?.srcObject) {
        const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = isMuted;
          setIsMuted(!isMuted);
        }
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  // Mock function to start/stop screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } else {
        if (localVideoRef.current?.srcObject) {
          localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
          // Restore camera video
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          localVideoRef.current.srcObject = stream;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const startCall = () => {
    setIsCallActive(true);
    setShowJoinDialog(false);
    // TODO: Implement actual video call connection logic
  };

  const endCall = () => {
    setIsCallActive(false);
    // Stop all tracks
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    // TODO: Implement actual call end logic
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Video Consultation
      </Typography>

      <VideoContainer elevation={3}>
        <VideoGrid container spacing={2}>
          <Grid item xs={12} md={isCallActive ? 6 : 12}>
            <VideoBox>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {isCallActive && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '2px 8px',
                    borderRadius: 1,
                  }}
                >
                  You
                </Typography>
              )}
            </VideoBox>
          </Grid>

          {isCallActive && (
            <Grid item xs={12} md={6}>
              <VideoBox>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '2px 8px',
                    borderRadius: 1,
                  }}
                >
                  Healthcare Provider
                </Typography>
              </VideoBox>
            </Grid>
          )}
        </VideoGrid>

        {isCallActive && (
          <ControlsContainer>
            <IconButton
              color={isMuted ? 'error' : 'primary'}
              onClick={toggleLocalAudio}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
            <IconButton
              color={isVideoOff ? 'error' : 'primary'}
              onClick={toggleLocalVideo}
            >
              {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>
            <IconButton
              color={isScreenSharing ? 'primary' : 'default'}
              onClick={toggleScreenShare}
            >
              <ScreenShareIcon />
            </IconButton>
            <IconButton color="error" onClick={endCall}>
              <CallEndIcon />
            </IconButton>
          </ControlsContainer>
        )}
      </VideoContainer>

      <Dialog open={showJoinDialog} onClose={() => setShowJoinDialog(false)}>
        <DialogTitle>Join Video Consultation</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to join a video consultation with your healthcare provider.
            Please ensure you have a working camera and microphone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJoinDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={startCall}>
            Join Call
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoConsultation; 