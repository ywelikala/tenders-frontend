import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sprout, Rocket, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  icon: React.ComponentType<any>;
  popular?: boolean;
  description: string;
  features: string[];
  stripePriceId: string;
}

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 2000,
      period: 'month',
      icon: Sprout,
      description: 'For individuals and small businesses who just want to stay informed.',
      features: [
        'Access to daily tender listings (web portal only)',
        'Search functionality with basic filters (date, category, newspaper)',
        'Access to tenders from the last 14 days',
        'Email summary (once per week)'
      ],
      stripePriceId: 'price_basic_monthly_lkr'
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 5000,
      period: 'month',
      icon: Rocket,
      popular: true,
      description: 'For professionals who need timely alerts and deeper access.',
      features: [
        'All features in Basic',
        'Advanced search (by keywords, region, agency, budget range)',
        'Access to full tender archive (past 1 year)',
        'Instant email alerts (daily) for selected categories',
        'Save and track favorite tenders',
        'Download tender documents (where available)'
      ],
      stripePriceId: 'price_professional_monthly_lkr'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 10000,
      period: 'month',
      icon: Crown,
      description: 'For large companies that bid frequently and need maximum visibility.',
      features: [
        'All features in Professional',
        'Unlimited category & keyword alerts (real-time notifications via email & SMS/WhatsApp)',
        'Team access (up to 5 users per account)',
        'Priority support (phone & chat)',
        'API access for integration with internal systems',
        'Custom reporting and analytics',
        'Dedicated account manager'
      ],
      stripePriceId: 'price_enterprise_monthly_lkr'
    }
  ];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      window.location.href = `/login?redirect=/pricing`;
      return;
    }

    setLoading(plan.id);

    try {
      // Create Stripe checkout session and redirect
      const { url } = await subscriptionService.createCheckoutSession(plan.id);
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setLoading(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-tender-orange/5 to-orange-100/30">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs. Get access to Sri Lanka's most comprehensive tender database.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card key={plan.id} className={`relative flex flex-col ${plan.popular ? 'ring-2 ring-tender-orange shadow-xl' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-tender-orange">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <IconComponent className="h-12 w-12 text-tender-orange" />
                  </div>
                  <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-grow">
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-900">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-tender-orange hover:bg-tender-orange/90 text-white"
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a custom solution?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us for enterprise pricing and custom features tailored to your organization's specific requirements.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 max-w-3xl mx-auto shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💳 Secure Payment with Stripe
            </h3>
            <p className="text-gray-600 text-sm">
              All payments are processed securely through Stripe. We accept major credit cards, debit cards, and local payment methods. 
              Your subscription will automatically renew monthly unless canceled. Cancel anytime with no hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;