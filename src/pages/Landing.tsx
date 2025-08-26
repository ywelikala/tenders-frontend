import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, FileText, Users, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-hero-background text-hero-foreground py-20">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Tender Notices in Sri Lanka
              <br />
              <span className="text-tender-orange">Advertise and Publish Tenders</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-light mb-4">
              Looking for Government and Private
            </h2>
            <h3 className="text-xl md:text-2xl mb-8">
              To be Connect with Buyer's & Suppliers
              <br />
              sector Tenders?
            </h3>
            
            <p className="text-lg mb-6 text-muted-foreground">
              Be informed about the latest news
              <br />
              Let us help you find opportunities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                View Tenders →
              </Button>
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                View Tenders →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-stats-background text-hero-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-transparent border-tender-orange/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-tender-orange mb-2">10</div>
                <div className="text-sm">Today's Tenders</div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border-tender-orange/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-tender-orange mb-2">508</div>
                <div className="text-sm">Live Tenders</div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border-tender-orange/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-tender-orange mb-2">29988</div>
                <div className="text-sm">Closed Tenders</div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border-tender-orange/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-tender-orange mb-2">30495</div>
                <div className="text-sm">All Tenders</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose Lanka Tender?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with opportunities, streamline your procurement process, and grow your business with our comprehensive tender management platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Building2 className="h-12 w-12 text-tender-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Government Tenders</h3>
                <p className="text-muted-foreground">Access thousands of government tender opportunities across Sri Lanka</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-tender-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Private Tenders</h3>
                <p className="text-muted-foreground">Discover private sector opportunities from leading companies</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-tender-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Supplier Network</h3>
                <p className="text-muted-foreground">Connect with verified suppliers and procurement professionals</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-tender-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Growth</h3>
                <p className="text-muted-foreground">Grow your business with real-time tender alerts and insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Join thousands of businesses already using our platform to find and win tenders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="orange" size="lg">
              Register for Free
            </Button>
            <Button variant="outline" size="lg">
              Browse Tenders
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;