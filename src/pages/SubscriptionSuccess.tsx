import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setStatus('error');
        setMessage('No session ID provided');
        return;
      }

      try {
        const response = await subscriptionService.verifySession(sessionId);
        console.log('Subscription verification response:', response);
        
        if (response.success) {
          setStatus('success');
          setMessage('Your subscription has been activated successfully!');
        } else {
          setStatus('error');
          setMessage(response.message || 'Failed to verify subscription. Please contact support.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your subscription.');
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-tender-orange/5 to-orange-100/30">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                {status === 'loading' && (
                  <Loader2 className="h-16 w-16 text-tender-orange animate-spin" />
                )}
                {status === 'success' && (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                )}
                {status === 'error' && (
                  <AlertCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {status === 'loading' && 'Processing...'}
                {status === 'success' && 'Subscription Confirmed!'}
                {status === 'error' && 'Subscription Error'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-8">
                {status === 'loading' && 'Please wait while we confirm your subscription...'}
                {message}
              </p>
              
              {status === 'success' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    You now have full access to all features in your selected plan. 
                    Start exploring Sri Lanka's comprehensive tender database!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-tender-orange hover:bg-tender-orange/90">
                      <Link to="/tenders">Browse Tenders</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/account">Manage Account</Link>
                    </Button>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    If you believe this is an error, please contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-tender-orange hover:bg-tender-orange/90">
                      <Link to="/pricing">Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;