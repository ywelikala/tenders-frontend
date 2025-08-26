import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tender-orange/5 to-orange-100/30">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <XCircle className="h-16 w-16 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">Subscription Cancelled</CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-8">
                Your subscription was cancelled. No payment has been processed.
                You can try subscribing again whenever you're ready.
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  If you experienced any issues during checkout, please contact our support team 
                  and we'll be happy to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-tender-orange hover:bg-tender-orange/90">
                    <Link to="/pricing">View Plans</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;