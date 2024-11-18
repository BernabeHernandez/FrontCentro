import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MFASetup() {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const fetchMfaSetup = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/mfa/setup');
        setSecretKey(response.data.secretKey);
        setQrCodeUrl(response.data.qrCodeUrl);
      } catch (error) {
        console.error('Error fetching MFA setup data:', error);
      }
    };
    fetchMfaSetup();
  }, []);

  const handleMfaActivation = async () => {
    try {
      await axios.post('https://backendcentro.onrender.com/api/mfa/activate', {
        secretKey,
      });
      navigate('/login'); 
    } catch (error) {
      console.error('Error activating MFA:', error);
    }
  };

  return (
    <div>
      <h2>Configurar Autenticación de Dos Factores (MFA)</h2>
      <p>Escanea este código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.):</p>
      <img src={qrCodeUrl} alt="QR Code para Google Authenticator" />
      <button onClick={handleMfaActivation}>Activar MFA</button>
    </div>
  );
}

export default MFASetup;
