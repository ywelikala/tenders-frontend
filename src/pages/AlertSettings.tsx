import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bell,
  Plus,
  Settings,
  BarChart3,
  Crown,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts, useAlertStats } from '../hooks/useAlerts';
import AlertList from '../components/alerts/AlertList';
import AlertForm from '../components/alerts/AlertForm';
import AlertStatsView from '../components/alerts/AlertStatsView';

const AlertSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('alerts');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<string | null>(null);

  const { data: alertsData, isLoading: alertsLoading, error: alertsError } = useAlerts();
  const { data: statsData, isLoading: statsLoading } = useAlertStats();

  // Check if user has access to email alerts
  const hasEmailAlertsFeature = user?.subscription?.features?.emailAlerts;
  const isProOrEnterprise = user?.subscription?.plan === 'professional' || user?.subscription?.plan === 'enterprise';

  if (!hasEmailAlertsFeature || !isProOrEnterprise) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <SEOHead
          title="Email Alert Settings - Lanka Tender Portal"
          description="Configure email alerts for tender opportunities"
        />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <Crown className="h-16 w-16 text-tender-orange mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-primary mb-4">
                Email Alerts - Premium Feature
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Email alerts are available for Professional and Enterprise subscribers only.
              </p>

              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-tender-orange">
                      <Bell className="h-5 w-5" />
                      <span className="font-semibold">Unlimited category & keyword alerts</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Settings className="h-5 w-5" />
                      <span className="font-semibold">Real-time notifications via email</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <BarChart3 className="h-5 w-5" />
                      <span className="font-semibold">Advanced filtering and matching</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Upgrade to Professional or Enterprise to start receiving targeted tender alerts
                    </p>
                    <Button
                      size="lg"
                      variant="orange"
                      onClick={() => window.location.href = '/pricing'}
                    >
                      View Pricing Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateAlert = () => {
    setEditingAlert(null);
    setShowCreateForm(true);
  };

  const handleEditAlert = (alertId: string) => {
    setEditingAlert(alertId);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingAlert(null);
  };

  if (alertsError && (alertsError as { status?: number })?.status === 403) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access email alerts. Please ensure you have an active Professional or Enterprise subscription.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SEOHead
        title="Email Alert Settings - Lanka Tender Portal"
        description="Configure email alerts for tender opportunities"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <Bell className="h-8 w-8 text-tender-orange" />
                Email Alert Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure keyword alerts to receive notifications when matching tenders are published
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-tender-orange border-tender-orange">
                {user?.subscription?.plan?.toUpperCase()} Plan
              </Badge>
              {!showCreateForm && (
                <Button onClick={handleCreateAlert} className="bg-tender-orange hover:bg-tender-orange/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              )}
            </div>
          </div>

          {/* Alert Creation/Edit Form */}
          {showCreateForm && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingAlert ? 'Edit Alert Configuration' : 'Create New Alert Configuration'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertForm
                    alertId={editingAlert}
                    onSuccess={handleCloseForm}
                    onCancel={handleCloseForm}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Alert Configurations
                {alertsData && (
                  <Badge variant="secondary" className="ml-2">
                    {alertsData.count}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics & Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-6">
              {alertsLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-tender-orange" />
                    <span className="ml-2 text-muted-foreground">Loading alerts...</span>
                  </CardContent>
                </Card>
              ) : alertsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load alert configurations. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <AlertList
                  alerts={alertsData?.alerts || []}
                  onEdit={handleEditAlert}
                />
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {statsLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-tender-orange" />
                    <span className="ml-2 text-muted-foreground">Loading statistics...</span>
                  </CardContent>
                </Card>
              ) : (
                <AlertStatsView stats={statsData} />
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Help */}
          {!showCreateForm && alertsData?.count === 0 && (
            <Card className="mt-8 border-dashed">
              <CardContent className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Alert Configurations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first alert to start receiving notifications when tenders matching your criteria are published.
                </p>
                <Button onClick={handleCreateAlert} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Alert
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertSettings;