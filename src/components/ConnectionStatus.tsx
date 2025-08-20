import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiClient } from '../services/api';

interface ConnectionStatusProps {
  className?: string;
}

type ApiStatus = 'connected' | 'disconnected' | 'checking' | 'error';
type BackendHealth = {
  status: string;
  timestamp: string;
  database: boolean;
  services: {
    auth: boolean;
    tenders: boolean;
    files: boolean;
  };
};

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkApiStatus(); // Re-check when coming back online
    };
    const handleOffline = () => {
      setIsOnline(false);
      setApiStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check API status and backend health
    const checkApiStatus = async () => {
      if (!navigator.onLine) {
        setApiStatus('disconnected');
        return;
      }

      setApiStatus('checking');
      try {
        // Check if backend is running and healthy
        const response = await fetch('/api/health', {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const healthData = await response.json();
          setApiStatus('connected');
          setBackendHealth(healthData.data || null);
        } else {
          setApiStatus('error');
          setBackendHealth(null);
        }
      } catch (error: any) {
        console.error('API health check failed:', error);
        
        // Distinguish between different types of errors
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          setApiStatus('disconnected'); // Backend is not running
        } else {
          setApiStatus('error'); // Backend is running but has issues
        }
        setBackendHealth(null);
      } finally {
        setLastCheck(new Date());
      }
    };

    // Initial check
    checkApiStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        status: 'offline',
        text: 'No Internet',
        variant: 'destructive' as const,
        icon: WifiOff,
        details: 'Check your internet connection'
      };
    }
    
    if (apiStatus === 'checking') {
      return {
        status: 'checking',
        text: 'Checking...',
        variant: 'secondary' as const,
        icon: Wifi,
        details: 'Verifying backend connection'
      };
    }
    
    if (apiStatus === 'connected') {
      const dbStatus = backendHealth?.database ? '✓' : '✗';
      const servicesUp = backendHealth?.services 
        ? Object.values(backendHealth.services).filter(Boolean).length 
        : 0;
      const totalServices = backendHealth?.services 
        ? Object.keys(backendHealth.services).length 
        : 0;
      
      return {
        status: 'connected',
        text: 'Connected',
        variant: 'default' as const,
        icon: CheckCircle,
        details: `DB: ${dbStatus} | Services: ${servicesUp}/${totalServices}`
      };
    }
    
    if (apiStatus === 'error') {
      return {
        status: 'error',
        text: 'API Error',
        variant: 'destructive' as const,
        icon: AlertTriangle,
        details: 'Backend is running but has issues'
      };
    }
    
    return {
      status: 'disconnected',
      text: 'Backend Offline',
      variant: 'destructive' as const,
      icon: WifiOff,
      details: 'Start the backend server (port 3000)'
    };
  };

  const { text, variant, icon: Icon, details } = getStatusInfo();
  const timeAgo = Math.floor((new Date().getTime() - lastCheck.getTime()) / 1000);

  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      <Badge variant={variant} className="cursor-help" title={`${details} • Last checked: ${timeAgo}s ago`}>
        <Icon className="mr-1 h-3 w-3" />
        {text}
      </Badge>
      
      {/* Show detailed status in development mode */}
      {process.env.NODE_ENV === 'development' && backendHealth && (
        <div className="text-xs text-muted-foreground hidden sm:block">
          DB: {backendHealth.database ? '✓' : '✗'} |
          Auth: {backendHealth.services?.auth ? '✓' : '✗'} |
          Files: {backendHealth.services?.files ? '✓' : '✗'}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;