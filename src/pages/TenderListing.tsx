import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SearchFilters from '@/components/SearchFilters';
import TenderCard from '@/components/TenderCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText, Loader2, X } from 'lucide-react';
import { useTenders, useTenderStats } from '../hooks/useTenders';
import type { TenderQueryParams } from '../types';

const TenderListing = () => {
  const [queryParams, setQueryParams] = useState<TenderQueryParams>({
    page: 1,
    limit: 10,
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { 
    data: tendersData, 
    isLoading: tendersLoading, 
    error: tendersError 
  } = useTenders(queryParams);
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useTenderStats();

  const tenders = tendersData?.data?.items || [];
  const pagination = tendersData?.data?.pagination || null;

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handleCategoryFilter = (category: string) => {
    setActiveFilter(`category-${category}`);
    setQueryParams(prev => ({ 
      ...prev, 
      page: 1,
      category: category,
      // Clear other filters
      search: undefined,
      publishedToday: undefined,
      isLive: undefined,
      isClosed: undefined,
    }));
  };

  const handleSearch = (searchTerm: string, category?: string) => {
    setActiveFilter(searchTerm ? `search-${searchTerm}` : null);
    setQueryParams(prev => ({
      ...prev,
      page: 1,
      search: searchTerm || undefined,
      category: category || undefined,
      // Clear other filters when searching
      publishedToday: undefined,
      isLive: undefined,
      isClosed: undefined,
    }));
  };

  const handleStatsFilter = (filterType: string) => {
    setActiveFilter(filterType);
    const newParams: TenderQueryParams = { 
      ...queryParams, 
      page: 1,
      // Clear category and search filters
      category: undefined,
      search: undefined,
    };

    switch (filterType) {
      case 'today':
        newParams.publishedToday = true;
        newParams.isLive = undefined;
        newParams.isClosed = undefined;
        break;
      case 'live':
        newParams.isLive = true;
        newParams.publishedToday = undefined;
        newParams.isClosed = undefined;
        break;
      case 'closed':
        newParams.isClosed = true;
        newParams.publishedToday = undefined;
        newParams.isLive = undefined;
        break;
      case 'all':
      default:
        newParams.publishedToday = undefined;
        newParams.isLive = undefined;
        newParams.isClosed = undefined;
        break;
    }
    
    setQueryParams(newParams);
  };

  const clearFilters = () => {
    setActiveFilter(null);
    setQueryParams({
      page: 1,
      limit: 10,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTenderForCard = (tender: any) => ({
    title: tender.title,
    category: tender.category,
    source: tender.organization?.name || 'Unknown Organization',
    location: `${tender.location?.province || ''}, ${tender.location?.district || ''}`.trim(),
    publishedDate: formatDate(tender.dates.published),
    closingDate: formatDate(tender.dates.closing),
    referenceNo: tender.referenceNo,
    isToday: tender.isClosingToday || false,
    tender: tender, // Pass the full tender object for expansion
  });

  // Category statistics from backend
  const categories = stats?.categoryStats || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SearchFilters 
        onSearch={handleSearch}
        initialSearchTerm={queryParams.search || ''}
        initialCategory={queryParams.category || 'all'}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Tender */}
            <Card className="ms-card bg-tender-blue text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2 text-white">Connect with Buyers & Suppliers</h3>
                <p className="text-sm mb-4 text-tender-light-blue">Upload Your Tenders FREE</p>
                <Button className="w-full bg-white text-tender-blue hover:bg-gray-50 font-semibold">
                  Upload Tender
                </Button>
              </CardContent>
            </Card>

            {/* Registration */}
            <Card className="ms-card bg-gray-50 border-gray-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-4 text-gray-800">Registration of Suppliers (2800)</h3>
                <Button className="w-full bg-tender-blue hover:bg-tender-blue-hover text-white font-semibold">
                  Register Now
                </Button>
              </CardContent>
            </Card>

            {/* Tenders by Sectors */}
            <Card className="ms-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-800 font-semibold">
                  <Building2 className="mr-2 h-5 w-5 text-tender-blue" />
                  Tenders By Sectors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center py-3 px-3 rounded-md cursor-pointer transition-colors ${
                        activeFilter === `category-${category._id}` 
                          ? 'bg-tender-blue text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCategoryFilter(category._id || category.name)}
                    >
                      <span className="text-sm font-medium">{category._id || category.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          activeFilter === `category-${category._id}` 
                            ? 'bg-white text-tender-blue border-white' 
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {statsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      'No categories available'
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tender Categories */}
            <Card className="ms-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-800 font-semibold">
                  <FileText className="mr-2 h-5 w-5 text-tender-blue" />
                  Tenders By Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {categories.length > 0 ? (
                  categories.slice(0, 6).map((category, index) => (
                    <div key={index} className="flex justify-between items-center py-3 px-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <span className="text-sm font-medium text-gray-700">{category._id || category.name}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-tender-blue hover:bg-transparent">
                        ▶
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {statsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      'No categories available'
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tender Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card 
                className={`ms-card cursor-pointer transition-all hover:ms-shadow ${
                  activeFilter === 'all' ? 'ring-2 ring-tender-blue bg-tender-blue text-white' : 'bg-white'
                }`}
                onClick={() => handleStatsFilter('all')}
              >
                <CardContent className="p-6 text-center">
                  {statsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <>
                      <div className={`text-3xl font-bold mb-2 ${
                        activeFilter === 'all' ? 'text-white' : 'text-tender-blue'
                      }`}>
                        {stats?.totalTenders || 0}
                      </div>
                      <div className={`text-sm font-medium ${
                        activeFilter === 'all' ? 'text-white' : 'text-gray-600'
                      }`}>
                        All Tenders
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card 
                className={`ms-card cursor-pointer transition-all hover:ms-shadow ${
                  activeFilter === 'today' ? 'ring-2 ring-green-500 bg-green-500 text-white' : 'bg-white'
                }`}
                onClick={() => handleStatsFilter('today')}
                data-testid="today-tenders-card"
              >
                <CardContent className="p-6 text-center">
                  {statsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <>
                      <div className={`text-3xl font-bold mb-2 ${
                        activeFilter === 'today' ? 'text-white' : 'text-green-600'
                      }`}>
                        {stats?.todayTenders || 0}
                      </div>
                      <div className={`text-sm font-medium ${
                        activeFilter === 'today' ? 'text-white' : 'text-gray-600'
                      }`}>
                        Today's Tenders
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card 
                className={`ms-card cursor-pointer transition-all hover:ms-shadow ${
                  activeFilter === 'live' ? 'ring-2 ring-orange-500 bg-orange-500 text-white' : 'bg-white'
                }`}
                onClick={() => handleStatsFilter('live')}
              >
                <CardContent className="p-6 text-center">
                  {statsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <>
                      <div className={`text-3xl font-bold mb-2 ${
                        activeFilter === 'live' ? 'text-white' : 'text-orange-600'
                      }`}>
                        {stats?.liveTenders || 0}
                      </div>
                      <div className={`text-sm font-medium ${
                        activeFilter === 'live' ? 'text-white' : 'text-gray-600'
                      }`}>
                        Live Tenders
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card 
                className={`ms-card cursor-pointer transition-all hover:ms-shadow ${
                  activeFilter === 'closed' ? 'ring-2 ring-gray-500 bg-gray-500 text-white' : 'bg-white'
                }`}
                onClick={() => handleStatsFilter('closed')}
              >
                <CardContent className="p-6 text-center">
                  {statsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <>
                      <div className={`text-3xl font-bold mb-2 ${
                        activeFilter === 'closed' ? 'text-white' : 'text-gray-600'
                      }`}>
                        {stats?.closedTenders || 0}
                      </div>
                      <div className={`text-sm font-medium ${
                        activeFilter === 'closed' ? 'text-white' : 'text-gray-600'
                      }`}>
                        Closed Tenders
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Filter Status and Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {pagination && (
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.current - 1) * 10) + 1} - {Math.min(pagination.current * 10, pagination.totalCount)} of {pagination.totalCount} tenders
                  </p>
                )}
                {activeFilter && (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    {activeFilter.startsWith('category-') 
                      ? `Category: ${activeFilter.replace('category-', '')}` 
                      : activeFilter.startsWith('search-')
                      ? `Search: ${activeFilter.replace('search-', '')}`
                      : `Filter: ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={clearFilters}
                      data-testid="clear-filter"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Error States */}
            {tendersError && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
                Error loading tenders: {tendersError.message || 'Failed to load tenders'}
              </div>
            )}
            
            {statsError && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
                Error loading statistics: {statsError.message || 'Failed to load statistics'}
              </div>
            )}

            {/* Tender Cards */}
            <div className="space-y-6">
              {tendersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : tenders.length > 0 ? (
                tenders.map((tender) => (
                  <TenderCard key={tender._id} {...formatTenderForCard(tender)} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No tenders found
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={!pagination.hasPrev}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium"
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === pagination.current ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={page === pagination.current 
                          ? "bg-tender-blue hover:bg-tender-blue-hover text-white border-tender-blue font-semibold" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={!pagination.hasNext}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderListing;