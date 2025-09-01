import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Mail, Building2 } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600">
              Get in touch with Lanka Tenders for any inquiries or support
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-tender-orange">
                  <Building2 className="mr-2 h-6 w-6" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-tender-orange mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Company Name</h3>
                    <p className="text-gray-700">Lanka Tenders Pvt Ltd</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-tender-orange mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-700">
                      14 Thalawatugoda 2nd Lane<br />
                      Pitakotte<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-tender-orange mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-700">+94 72 426 5408</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-tender-orange mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Working Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Time Zone: GMT +5:30 (Sri Lanka Standard Time)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-tender-orange">
                  <Mail className="mr-2 h-6 w-6" />
                  Get Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-tender-orange/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-tender-orange mb-2">Business Hours Support</h3>
                  <p className="text-gray-700 text-sm">
                    For immediate assistance during business hours, please call us directly. 
                    Our support team is available to help with:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                    <li>Account registration and setup</li>
                    <li>Subscription plans and billing</li>
                    <li>Technical support</li>
                    <li>Tender information queries</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Email Support</h3>
                  <p className="text-blue-700 text-sm">
                    For non-urgent inquiries, you can reach us via email. 
                    We typically respond within 24 hours during business days.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Enterprise Clients</h3>
                  <p className="text-green-700 text-sm">
                    For enterprise solutions and custom requirements, 
                    please contact us directly to discuss your specific needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Office Hours Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Office Hours Notice</h3>
                  <p className="text-blue-700">
                    Our office operates from <strong>9:00 AM to 5:00 PM, Monday through Friday</strong>, 
                    Sri Lanka Standard Time (GMT +5:30). We are closed on weekends and public holidays.
                  </p>
                  <p className="text-blue-700 mt-2">
                    For urgent matters outside business hours, please leave a detailed message 
                    and we will respond first thing the next business day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;