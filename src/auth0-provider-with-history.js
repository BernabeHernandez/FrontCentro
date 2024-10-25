import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain="dev-yxydrmnaq46763ua.us.auth0.com"
      clientId="N5GZuwp1NECbLamNqw4WYlpVQ02nCDxY"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
