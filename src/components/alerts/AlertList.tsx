import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Bell,
  BellRing,
  BellOff,
  MoreVertical,
  Edit,
  TestTube,
  Mail,
  Trash2,
  Calendar,
  Target,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useToggleAlert, useDeleteAlert, useTestAlert, useSendTestEmail } from '@/hooks/useAlerts';
import type { AlertConfiguration } from '@/types';

interface AlertListProps {
  alerts: AlertConfiguration[];
  onEdit: (alertId: string) => void;
}

interface AlertCardProps {
  alert: AlertConfiguration;
  onEdit: (alertId: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onEdit }) => {
  const toggleAlert = useToggleAlert();
  const deleteAlert = useDeleteAlert();
  const testAlert = useTestAlert();
  const sendTestEmail = useSendTestEmail();

  const handleToggle = () => {
    toggleAlert.mutate(alert._id);
  };

  const handleDelete = () => {
    deleteAlert.mutate(alert._id);
  };

  const handleTest = () => {
    testAlert.mutate({ id: alert._id, limit: 10 });
  };

  const handleSendTestEmail = () => {
    sendTestEmail.mutate(alert._id);
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'immediate':
        return <BellRing className="h-4 w-4" />;
      case 'daily':
        return <Calendar className="h-4 w-4" />;
      case 'weekly':
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'immediate':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'daily':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'weekly':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${
      alert.isActive
        ? 'border-tender-orange/20 shadow-sm hover:shadow-md'
        : 'border-gray-200 opacity-60 hover:opacity-80'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              alert.isActive
                ? 'bg-tender-orange/10 text-tender-orange'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {alert.isActive ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-lg">{alert.name}</CardTitle>
                <Badge
                  variant={alert.isActive ? "default" : "secondary"}
                  className={alert.isActive ? "bg-green-100 text-green-800" : ""}
                >
                  {alert.isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {alert.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {alert.description && (
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={alert.isActive}
              onCheckedChange={handleToggle}
              disabled={toggleAlert.isPending}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(alert._id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Configuration
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleTest}
                  disabled={testAlert.isPending}
                >
                  {testAlert.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4 mr-2" />
                  )}
                  Test Alert
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSendTestEmail}
                  disabled={sendTestEmail.isPending}
                >
                  {sendTestEmail.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Test Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                      <span className="text-red-600">Delete Alert</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Alert Configuration</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{alert.name}"? This action cannot be undone
                        and you will stop receiving notifications for this alert.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleteAlert.isPending}
                      >
                        {deleteAlert.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete Alert'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Keywords */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Target className="h-4 w-4 mr-2" />
              Keywords ({alert.keywords.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {alert.keywords.slice(0, 5).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword.term}
                  {keyword.matchType !== 'contains' && (
                    <span className="ml-1 text-muted-foreground">
                      ({keyword.matchType.replace('_', ' ')})
                    </span>
                  )}
                </Badge>
              ))}
              {alert.keywords.length > 5 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{alert.keywords.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          {/* Email Settings */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`${getFrequencyColor(alert.emailSettings.frequency)} border`}
                >
                  {getFrequencyIcon(alert.emailSettings.frequency)}
                  <span className="ml-1 capitalize">{alert.emailSettings.frequency}</span>
                </Badge>
              </div>

              {alert.categories.length > 0 && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span>{alert.categories.length} categories</span>
                </div>
              )}

              {(alert.locations.provinces.length > 0 || alert.locations.districts.length > 0) && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {alert.locations.provinces.length > 0
                      ? `${alert.locations.provinces.length} provinces`
                      : `${alert.locations.districts.length} districts`}
                  </span>
                </div>
              )}

              {alert.estimatedValue && (alert.estimatedValue.min || alert.estimatedValue.max) && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span>Value range</span>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Target className="h-3 w-3" />
                <span>{alert.stats.totalMatches} matches</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>{alert.stats.emailsSent} emails</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AlertList: React.FC<AlertListProps> = ({ alerts, onEdit }) => {
  if (alerts.length === 0) {
    return (
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription>
          No alert configurations found. Create your first alert to start receiving notifications.
        </AlertDescription>
      </Alert>
    );
  }

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const inactiveAlerts = alerts.filter(alert => !alert.isActive);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-600 border-green-200">
            {activeAlerts.length} Active
          </Badge>
          {inactiveAlerts.length > 0 && (
            <Badge variant="outline" className="text-gray-600 border-gray-200">
              {inactiveAlerts.length} Inactive
            </Badge>
          )}
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Active Alerts ({activeAlerts.length})
          </h3>
          {activeAlerts.map((alert) => (
            <AlertCard key={alert._id} alert={alert} onEdit={onEdit} />
          ))}
        </div>
      )}

      {/* Inactive Alerts */}
      {inactiveAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-600 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            Inactive Alerts ({inactiveAlerts.length})
          </h3>
          {inactiveAlerts.map((alert) => (
            <AlertCard key={alert._id} alert={alert} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;