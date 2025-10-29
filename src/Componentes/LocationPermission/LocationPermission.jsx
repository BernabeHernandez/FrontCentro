import React, { useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const LocationPermission = ({ onPermissionGranted, onPermissionDenied }) => {
  useEffect(() => {
    const hasAsked = localStorage.getItem('locationPermissionAsked');
    if (hasAsked) {
      const status = localStorage.getItem('locationPermission');
      if (status === 'granted') {
      } else if (status === 'denied') {
        onPermissionDenied?.(new Error('Ubicación previamente denegada'));
      }
      return;
    }
  }, [onPermissionDenied]);

  const requestLocation = () => {
    localStorage.setItem('locationPermissionAsked', 'true');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('locationPermission', 'granted');
          onPermissionGranted?.(position);
        },
        (error) => {
          localStorage.setItem('locationPermission', 'denied');
          onPermissionDenied?.(error);
        },
        { timeout: 10000, maximumAge: 600000 }
      );
    } else {
      localStorage.setItem('locationPermission', 'denied');
      onPermissionDenied?.(new Error('Geolocalización no soportada'));
    }
  };

  const denyLocation = () => {
    localStorage.setItem('locationPermissionAsked', 'true');
    localStorage.setItem('locationPermission', 'denied');
    onPermissionDenied?.(new Error('Usuario denegó ubicación'));
  };


  const hasAsked = localStorage.getItem('locationPermissionAsked');
  if (hasAsked) return null;

  return (
    <Dialog open={true} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <LocationOnIcon sx={{ fontSize: 40, color: '#667eea' }} />
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Permiso de ubicación
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Necesitamos tu ubicación para mostrarte el Centro de Rehabilitación y mejorar tu experiencia.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
        <Button onClick={denyLocation} color="inherit">
          No, gracias
        </Button>
        <Button onClick={requestLocation} variant="contained" color="primary">
          Permitir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPermission;