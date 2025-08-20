import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import debug utilities for development
if (process.env.NODE_ENV === 'development') {
  import('./utils/debug').then(({ debugApi }) => {
    // Make available globally for debugging
    (window as any).debugApi = debugApi;
    
    console.log('🔧 Development mode: Debug API tools available');
    console.log('  - debugApi.runAllTests() - Run all connection tests');
    console.log('  - debugApi.testLogin() - Test login specifically');
    console.log('  - debugApi.testConnection() - Test basic connection');
    
    // Auto-run connection test on startup
    debugApi.testConnection();
  }).catch(error => {
    console.error('Failed to load debug utilities:', error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
