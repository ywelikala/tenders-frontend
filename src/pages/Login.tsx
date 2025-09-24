import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleLoginMutation = useGoogleLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 Login form submitted:', {
      email,
      hasPassword: !!password,
      timestamp: new Date().toISOString()
    });
    
    setError('');

    if (!email || !password) {
      console.log('❌ Validation failed: missing fields');
      setError('Please fill in all fields');
      return;
    }

    console.log('✅ Validation passed, starting login process...');
    setLoading(true);
    
    try {
      console.log('🚀 Calling login function from AuthContext');
      const result = await login({ email, password });
      console.log('✅ Login successful, checking user role for redirect');
      
      // Get the page user was trying to access before login
      const from = (location.state as any)?.from || '/tenders';
      
      // Navigate to the original destination or default to tenders page
      navigate(from, { replace: true });
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('🎯 Google login success:', credentialResponse);
    try {
      await googleLoginMutation.mutateAsync(credentialResponse.credential);
    } catch (error) {
      console.error('❌ Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google login failed');
    setError('Google login failed. Please try again.');
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">
                Login to Your Account
              </CardTitle>
              <p className="text-muted-foreground">
                Access thousands of tender opportunities
              </p>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
                <strong>Demo Credentials:</strong><br />
                Test User: test@example.com / password123<br />
                <span className="text-blue-600">✓ Connected to live backend API</span>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('🧪 Testing API connection...');
                      if ((window as any).debugApi) {
                        (window as any).debugApi.runAllTests();
                      } else {
                        console.log('❌ Debug API not available');
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    Test API Connection
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || googleLoginMutation.isPending}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="mt-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || googleLoginMutation.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded" />
                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-tender-orange hover:underline">
                    Forgot password?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  variant="orange" 
                  className="w-full" 
                  size="lg"
                  disabled={loading || googleLoginMutation.isPending}
                >
                  {(loading || googleLoginMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {googleLoginMutation.isPending ? 'Google Login...' : 'Logging in...'}
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-tender-orange hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  width="384"
                  shape="rectangular"
                  theme="outline"
                  text="continue_with"
                  logo_alignment="left"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;