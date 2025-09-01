import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import TenderCard from '@/components/TenderCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, FileText, Loader2, Eye, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMyTenders } from '../hooks/useTenders';
import { Link } from 'react-router-dom';
import type { TenderQueryParams } from '../types';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [queryParams] = useState<TenderQueryParams>({
    page: 1,
    limit: 50, // Show more tenders for suppliers
  });

  const { 
    data: tendersData, 
    isLoading: tendersLoading, 
    error: tendersError 
  } = useMyTenders(queryParams);

  const tenders = tendersData?.data?.items || [];
  const pagination = tendersData?.data?.pagination || null;

  // Calculate stats from supplier's tenders
  const stats = {
    totalTenders: tenders.length,
    liveTenders: tenders.filter(t => t.status === 'published' && !t.isExpired).length,
    closedTenders: tenders.filter(t => t.status === 'closed' || t.isExpired).length,
    draftTenders: tenders.filter(t => t.status === 'draft').length
  };

  if (tendersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-tender-blue" />
          </div>
        </div>
      </div>
    );
  }

  if (tendersError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading tenders</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Supplier Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.firstName}! Manage your tenders and track applications.
            </p>
          </div>
          <Button 
            className="bg-tender-blue hover:bg-tender-blue-hover text-white flex items-center gap-2"
            asChild
          >
            <Link to="/supplier/add-tender">
              <Plus className="h-4 w-4" />
              Add New Tender
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenders}</div>
              <p className="text-xs text-muted-foreground">
                All your published tenders
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Tenders</CardTitle>
              <Eye className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.liveTenders}</div>
              <p className="text-xs text-muted-foreground">
                Currently accepting bids
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Tenders</CardTitle>
              <Calendar className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.closedTenders}</div>
              <p className="text-xs text-muted-foreground">
                Deadline passed or closed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Tenders</CardTitle>
              <Building2 className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.draftTenders}</div>
              <p className="text-xs text-muted-foreground">
                Not yet published
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tenders List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">My Tenders</CardTitle>
              <Badge variant="secondary">{stats.totalTenders} Total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {tenders.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tenders yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't created any tenders yet. Start by adding your first tender.
                </p>
                <Button 
                  className="bg-tender-blue hover:bg-tender-blue-hover text-white"
                  asChild
                >
                  <Link to="/supplier/add-tender">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Tender
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {tenders.map((tender) => (
                  <div key={tender._id} className="relative">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        variant={
                          tender.status === 'published' && !tender.isExpired ? 'default' :
                          tender.status === 'draft' ? 'secondary' :
                          'outline'
                        }
                        className={
                          tender.status === 'published' && !tender.isExpired ? 'bg-green-500 hover:bg-green-600 text-white' :
                          tender.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {tender.status === 'published' && !tender.isExpired ? 'Live' :
                         tender.status === 'draft' ? 'Draft' :
                         tender.isExpired ? 'Expired' : tender.status}
                      </Badge>
                    </div>
                    
                    <TenderCard
                      title={tender.title}
                      category={tender.category}
                      source={tender.organization.name}
                      location={`${tender.location.district}, ${tender.location.province}`}
                      publishedDate={new Date(tender.dates.published).toLocaleDateString('en-GB')}
                      closingDate={new Date(tender.dates.closing).toLocaleDateString('en-GB')}
                      referenceNo={tender.referenceNo}
                      isToday={
                        new Date(tender.dates.published).toDateString() === new Date().toDateString()
                      }
                      tender={tender}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;