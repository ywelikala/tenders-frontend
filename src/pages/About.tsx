import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Globe, Shield, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Lanka Tenders
            </h1>
            <p className="text-xl text-gray-600">
              Your trusted partner for tender opportunities in Sri Lanka
            </p>
          </div>

          {/* Company Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-tender-orange">
                  <Building2 className="mr-2 h-6 w-6" />
                  Our Company
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  <strong>Lanka Tenders Pvt Ltd</strong> is a privately owned company operating from Colombo, Sri Lanka. 
                  We specialize in providing comprehensive tender information and opportunities to businesses 
                  across the island.
                </p>
                <p className="text-gray-700">
                  Our platform serves as a bridge between buyers and suppliers, facilitating transparent 
                  and efficient business transactions in both government and private sector procurement.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-tender-orange">
                  <Globe className="mr-2 h-6 w-6" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  To democratize access to tender opportunities in Sri Lanka by providing a centralized, 
                  user-friendly platform that connects businesses with procurement opportunities.
                </p>
                <p className="text-gray-700">
                  We aim to foster transparency, efficiency, and growth in the Sri Lankan business ecosystem 
                  through innovative technology solutions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-tender-orange">
                  <Users className="mr-2 h-5 w-5" />
                  For Businesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Access to comprehensive tender databases, real-time notifications, 
                  and advanced search capabilities to find relevant opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-tender-orange">
                  <Building2 className="mr-2 h-5 w-5" />
                  For Organizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Streamlined tender publishing, supplier management, and 
                  transparent procurement processes to find the best partners.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-tender-orange">
                  <Shield className="mr-2 h-5 w-5" />
                  Trusted Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Secure, reliable, and up-to-date information sourced from 
                  official publications and verified channels.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800">
                <Shield className="mr-2 h-5 w-5" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-800 text-sm">
                <strong>Limitation of Liability:</strong> Lanka Tenders Pvt Ltd provides this platform and 
                information on an "as is" basis. While we strive to ensure the accuracy and timeliness of 
                all information presented, we do not guarantee its completeness or accuracy.
              </p>
              <p className="text-amber-800 text-sm">
                <strong>No Liability:</strong> Lanka Tenders Pvt Ltd shall not be held liable for any direct, 
                indirect, incidental, special, consequential, or punitive damages, including but not limited to 
                loss of profits, data, or business opportunities, arising from the use of this website or 
                reliance on any information contained herein.
              </p>
              <p className="text-amber-800 text-sm">
                <strong>User Responsibility:</strong> Users are advised to independently verify all tender 
                information, terms, and conditions before participating in any procurement process. 
                Lanka Tenders Pvt Ltd is not responsible for any losses or damages resulting from 
                decisions made based on information obtained from this platform.
              </p>
              <p className="text-amber-800 text-sm">
                <strong>Third-Party Content:</strong> Any third-party content, links, or references provided 
                on this platform are for informational purposes only. Lanka Tenders Pvt Ltd does not 
                endorse or assume responsibility for the accuracy or reliability of such content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;