import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/AuthContext";
import { GOOGLE_CLIENT_ID } from "./services/api";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import TenderListing from "./pages/TenderListing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import SupplierDashboard from "./pages/SupplierDashboard";
import AddTender from "./pages/AddTender";
import AlertSettings from "./pages/AlertSettings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useToast } from "./hooks/use-toast";
import { useEffect, Suspense, lazy } from "react";

// Lazy load React Query DevTools for development

const ReactQueryDevtools = process.env.NODE_ENV === 'development' 
  ? lazy(() => import('@tanstack/react-query-devtools').then(module => ({ 
      default: module.ReactQueryDevtools 
    })))
  : null;

// Enhanced QueryClient with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 30000, // 30 seconds
      gcTime: 600000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry once for other errors
        return failureCount < 1;
      },
    },
  },
});

// Global error handler for auth events
const AuthEventHandler = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      switch (event.type) {
        case 'auth:token-expired':
          toast({
            title: "Session Expired",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          break;
        case 'auth:unauthorized':
          toast({
            title: "Access Denied",
            description: "You need to be logged in to access this resource.",
            variant: "destructive",
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('auth:token-expired', handleAuthError as EventListener);
    window.addEventListener('auth:unauthorized', handleAuthError as EventListener);

    return () => {
      window.removeEventListener('auth:token-expired', handleAuthError as EventListener);
      window.removeEventListener('auth:unauthorized', handleAuthError as EventListener);
    };
  }, [toast]);

  return null;
};

const App = () => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      // Log to external error tracking service in production
      if (process.env.NODE_ENV === 'production') {
        console.error('Application Error:', { error, errorInfo });
      }
    }}
  >
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
            <AuthEventHandler />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Landing />} />
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/tenders" 
                element={
                  <ProtectedRoute>
                    <TenderListing />
                  </ProtectedRoute>
                } 
              />
              {/* Supplier Routes - Require Supplier Role */}
              <Route 
                path="/supplier/dashboard" 
                element={
                  <ProtectedRoute requiredRole="supplier">
                    <SupplierDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/supplier/add-tender"
                element={
                  <ProtectedRoute requiredRole="supplier">
                    <AddTender />
                  </ProtectedRoute>
                }
              />
              {/* Alert Settings - Require Authentication */}
              <Route
                path="/alert-settings"
                element={
                  <ProtectedRoute>
                    <AlertSettings />
                  </ProtectedRoute>
                }
              />
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* React Query Devtools - only in development */}
            {process.env.NODE_ENV === 'development' && ReactQueryDevtools && (
              <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} />
              </Suspense>
            )}
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
