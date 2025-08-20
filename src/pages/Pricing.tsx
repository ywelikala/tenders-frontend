import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, Loader2 } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import type { SubscriptionPlan } from '../types';

const Pricing = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Try real API first
        let plansData;
        try {
          plansData = await subscriptionService.getPlans();
        } catch (apiError) {
          console.log('Backend not available, using mock data');
          // Fallback to mock data
          plansData = await subscriptionService.getPlansMock();
        }
        setPlans(plansData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getFeatureList = (plan: SubscriptionPlan) => [
    {
      name: plan.features.maxTenderViews === -1 ? 'Unlimited tender views' : `${plan.features.maxTenderViews} tender views per month`,
      included: true
    },
    {
      name: 'Advanced search functionality',
      included: plan.features.advancedFiltering
    },
    {
      name: 'Email alerts',
      included: plan.features.emailAlerts
    },
    {
      name: 'Upload tenders',
      included: plan.features.canUploadTenders
    },
    {
      name: 'API access',
      included: plan.features.apiAccess
    },
    {
      name: 'Priority support',
      included: plan.features.prioritySupport
    },
    {
      name: 'Custom reports',
      included: plan.features.customReports
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tender-orange/5 to-orange-100/30">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-128 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="relative">
                <CardHeader>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full mt-6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tender-orange/5 to-orange-100/30">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Plans</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tender-orange/5 to-orange-100/30">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get access to Sri Lanka's most comprehensive tender database with plans designed for every business size.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan._id} className={`relative ${plan.name === 'premium' ? 'ring-2 ring-tender-orange' : ''}`}>
              {plan.name === 'premium' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-tender-orange">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-lg">{plan.displayName}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(plan.price.monthly)}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {plan.price.monthly === 0 ? 'Forever' : '/month'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {getFeatureList(plan).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.name === 'premium' ? 'bg-tender-orange hover:bg-tender-orange/90' : ''}`}
                  variant={plan.name === 'premium' ? 'default' : 'outline'}
                >
                  {plan.name === 'free' ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a custom solution?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us for enterprise pricing and custom features tailored to your organization.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;