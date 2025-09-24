import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bell,
  BellRing,
  Calendar,
  Clock,
  Mail,
  Target,
  BarChart3,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import type { AlertStats } from '@/types';

interface AlertStatsViewProps {
  stats?: AlertStats;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: string;
}> = ({ title, value, icon, description, color = "text-tender-orange" }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gray-50 ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const AlertStatsView: React.FC<AlertStatsViewProps> = ({ stats }) => {
  if (!stats) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No statistics available. Create some alerts to see your analytics.
        </AlertDescription>
      </Alert>
    );
  }

  const totalActiveAlerts = stats.activeAlerts;
  const alertEfficiency = stats.totalAlerts > 0
    ? ((stats.totalMatches / stats.totalAlerts) * 100).toFixed(1)
    : '0';

  const avgEmailsPerAlert = stats.activeAlerts > 0
    ? (stats.totalEmailsSent / stats.activeAlerts).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Alerts"
          value={stats.totalAlerts}
          icon={<Bell className="h-6 w-6" />}
          description={`${stats.activeAlerts} active, ${stats.inactiveAlerts} inactive`}
          color="text-blue-600"
        />

        <StatCard
          title="Total Matches"
          value={stats.totalMatches}
          icon={<Target className="h-6 w-6" />}
          description={`${alertEfficiency}% match efficiency`}
          color="text-green-600"
        />

        <StatCard
          title="Emails Sent"
          value={stats.totalEmailsSent}
          icon={<Mail className="h-6 w-6" />}
          description={`${avgEmailsPerAlert} avg per alert`}
          color="text-purple-600"
        />

        <StatCard
          title="Active Alerts"
          value={`${stats.activeAlerts}/${stats.totalAlerts}`}
          icon={<CheckCircle className="h-6 w-6" />}
          description={totalActiveAlerts > 0 ? "Currently monitoring" : "No active alerts"}
          color={totalActiveAlerts > 0 ? "text-green-600" : "text-red-600"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Frequency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-tender-orange" />
              Alert Frequency Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BellRing className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Immediate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {stats.alertsByFrequency.immediate}
                  </Badge>
                  <div className="w-24 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-300"
                      style={{
                        width: stats.totalAlerts > 0
                          ? `${(stats.alertsByFrequency.immediate / stats.totalAlerts) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Daily</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {stats.alertsByFrequency.daily}
                  </Badge>
                  <div className="w-24 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{
                        width: stats.totalAlerts > 0
                          ? `${(stats.alertsByFrequency.daily / stats.totalAlerts) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Weekly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {stats.alertsByFrequency.weekly}
                  </Badge>
                  <div className="w-24 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{
                        width: stats.totalAlerts > 0
                          ? `${(stats.alertsByFrequency.weekly / stats.totalAlerts) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tender-orange" />
              Recent Alert Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentMatches.length > 0 ? (
              <div className="space-y-3">
                {stats.recentMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{match.alertName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.lastMatchedAt).toLocaleDateString()} at{' '}
                        {new Date(match.lastMatchedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {match.totalMatches} matches
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No recent alert activity
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Activity will appear here when your alerts start matching tenders
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {stats.totalAlerts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tender-orange" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{alertEfficiency}%</p>
                <p className="text-sm text-blue-800">Match Efficiency</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average matches per alert
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{avgEmailsPerAlert}</p>
                <p className="text-sm text-green-800">Emails per Alert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average notifications sent
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {((stats.activeAlerts / stats.totalAlerts) * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-purple-800">Active Rate</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage of alerts currently active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">💡 Tips for Better Alert Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Use specific keywords for more targeted results</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Set up different alerts for different categories or locations</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Use exclude keywords to filter out unwanted matches</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Test your alerts regularly to ensure they're working correctly</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertStatsView;