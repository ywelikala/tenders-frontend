import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface FacebookLoginProps {
  onLogin: (accessToken: string, userID: string) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const FacebookLogin: React.FC<FacebookLoginProps> = ({ onLogin, onError, disabled }) => {
  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) return;

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.head.appendChild(script);
    };

    // Initialize Facebook SDK
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    loadFacebookSDK();
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      onError(new Error('Facebook SDK not loaded'));
      return;
    }

    window.FB.login((response: any) => {
      if (response.authResponse) {
        // Get user's basic info
        window.FB.api('/me', { fields: 'id,name,email' }, (userResponse: any) => {
          if (userResponse && !userResponse.error) {
            onLogin(response.authResponse.accessToken, response.authResponse.userID);
          } else {
            onError(new Error('Failed to get user information from Facebook'));
          }
        });
      } else {
        onError(new Error('Facebook login cancelled or failed'));
      }
    }, { scope: 'email' });
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center space-x-2"
      onClick={handleFacebookLogin}
      disabled={disabled}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>Continue with Facebook</span>
    </Button>
  );
};

export default FacebookLogin;