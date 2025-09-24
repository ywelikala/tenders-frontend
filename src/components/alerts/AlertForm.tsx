import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Plus,
  X,
  Target,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';
import { useCreateAlert, useUpdateAlert, useAlert } from '@/hooks/useAlerts';
import type { CreateAlertData, UpdateAlertData, AlertKeyword } from '@/types';

// Form validation schema
const alertFormSchema = z.object({
  name: z.string().min(1, 'Alert name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  keywords: z.array(z.object({
    term: z.string().min(1, 'Keyword is required').max(50, 'Keyword cannot exceed 50 characters'),
    matchType: z.enum(['exact', 'contains', 'starts_with', 'ends_with'])
  })).min(1, 'At least one keyword is required').max(20, 'Maximum 20 keywords allowed'),
  categories: z.array(z.string()).max(10, 'Maximum 10 categories allowed').optional(),
  locations: z.object({
    provinces: z.array(z.string()).optional(),
    districts: z.array(z.string()).optional(),
    cities: z.array(z.string()).optional()
  }).optional(),
  organizationTypes: z.array(z.enum(['government', 'private', 'semi-government', 'ngo'])).optional(),
  estimatedValue: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.enum(['LKR', 'USD', 'EUR']).default('LKR')
  }).optional(),
  emailSettings: z.object({
    enabled: z.boolean().default(true),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('immediate'),
    customEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    dailySummaryTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').default('09:00')
  }),
  advancedFilters: z.object({
    excludeKeywords: z.array(z.string().max(50)).max(10).optional(),
    minDaysUntilClosing: z.number().min(0).max(365).optional(),
    maxDaysUntilClosing: z.number().min(0).max(365).optional(),
    includedStatuses: z.array(z.enum(['draft', 'published', 'closed', 'awarded', 'cancelled'])).optional(),
    includedPriorities: z.array(z.enum(['low', 'medium', 'high', 'urgent'])).optional()
  }).optional()
}).refine((data) => {
  if (data.estimatedValue?.min && data.estimatedValue?.max) {
    return data.estimatedValue.min <= data.estimatedValue.max;
  }
  return true;
}, {
  message: 'Minimum value cannot be greater than maximum value',
  path: ['estimatedValue', 'min']
}).refine((data) => {
  if (data.advancedFilters?.minDaysUntilClosing && data.advancedFilters?.maxDaysUntilClosing) {
    return data.advancedFilters.minDaysUntilClosing <= data.advancedFilters.maxDaysUntilClosing;
  }
  return true;
}, {
  message: 'Minimum days cannot be greater than maximum days',
  path: ['advancedFilters', 'minDaysUntilClosing']
});

type AlertFormData = z.infer<typeof alertFormSchema>;

interface AlertFormProps {
  alertId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Constants for dropdown options
const CATEGORIES = [
  'Construction',
  'Computers & Laptops',
  'Computer & IT',
  'Upkeep/Repair',
  'Medical Equipment',
  'Office Supplies',
  'Vehicles',
  'Furniture',
  'Consultancy Services',
  'Engineering Services',
  'Security Services',
  'Catering Services',
  'Cleaning Services',
  'Other'
];

const PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province'
];

const ORGANIZATION_TYPES = [
  { value: 'government', label: 'Government' },
  { value: 'private', label: 'Private' },
  { value: 'semi-government', label: 'Semi-Government' },
  { value: 'ngo', label: 'NGO' }
];

const TENDER_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
  { value: 'awarded', label: 'Awarded' },
  { value: 'cancelled', label: 'Cancelled' }
];

const TENDER_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const AlertForm: React.FC<AlertFormProps> = ({ alertId, onSuccess, onCancel }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newExcludeKeyword, setNewExcludeKeyword] = useState('');

  const createAlert = useCreateAlert();
  const updateAlert = useUpdateAlert();
  const { data: existingAlert, isLoading: loadingAlert } = useAlert(alertId || '', !!alertId);

  const isEditing = !!alertId;
  const isSubmitting = createAlert.isPending || updateAlert.isPending;

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      name: '',
      description: '',
      keywords: [{ term: '', matchType: 'contains' }],
      categories: [],
      locations: {
        provinces: [],
        districts: [],
        cities: []
      },
      organizationTypes: [],
      estimatedValue: {
        currency: 'LKR'
      },
      emailSettings: {
        enabled: true,
        frequency: 'immediate',
        customEmail: '',
        dailySummaryTime: '09:00'
      },
      advancedFilters: {
        excludeKeywords: [],
        includedStatuses: ['published'],
        includedPriorities: []
      }
    }
  });

  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control: form.control,
    name: 'keywords'
  });

  // Load existing alert data for editing
  useEffect(() => {
    if (existingAlert && isEditing) {
      const alertData = {
        ...existingAlert,
        emailSettings: {
          ...existingAlert.emailSettings,
          customEmail: existingAlert.emailSettings.customEmail || ''
        }
      };
      form.reset(alertData);
    }
  }, [existingAlert, isEditing, form]);

  const onSubmit = async (data: AlertFormData) => {
    try {
      if (isEditing && alertId) {
        await updateAlert.mutateAsync({
          id: alertId,
          data: data as UpdateAlertData
        });
      } else {
        await createAlert.mutateAsync(data as CreateAlertData);
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addKeyword = () => {
    appendKeyword({ term: '', matchType: 'contains' });
  };

  const addExcludeKeyword = () => {
    if (newExcludeKeyword.trim()) {
      const currentKeywords = form.getValues('advancedFilters.excludeKeywords') || [];
      form.setValue('advancedFilters.excludeKeywords', [...currentKeywords, newExcludeKeyword.trim()]);
      setNewExcludeKeyword('');
    }
  };

  const removeExcludeKeyword = (index: number) => {
    const currentKeywords = form.getValues('advancedFilters.excludeKeywords') || [];
    form.setValue('advancedFilters.excludeKeywords', currentKeywords.filter((_, i) => i !== index));
  };

  if (loadingAlert && isEditing) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-tender-orange" />
        <span className="ml-2 text-muted-foreground">Loading alert configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Alert Name *</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Enter a descriptive name for this alert"
            className="mt-1"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Optional description to help you remember what this alert is for"
            className="mt-1"
            rows={2}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-tender-orange" />
            Keywords *
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Add keywords to match against tender titles and descriptions
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {keywordFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  {...form.register(`keywords.${index}.term`)}
                  placeholder="Enter keyword"
                />
                {form.formState.errors.keywords?.[index]?.term && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.keywords[index]?.term?.message}
                  </p>
                )}
              </div>
              <Controller
                control={form.control}
                name={`keywords.${index}.matchType`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="exact">Exact</SelectItem>
                      <SelectItem value="starts_with">Starts with</SelectItem>
                      <SelectItem value="ends_with">Ends with</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {keywordFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeKeyword(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {keywordFields.length < 20 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addKeyword}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Keyword
            </Button>
          )}

          {form.formState.errors.keywords && typeof form.formState.errors.keywords.message === 'string' && (
            <p className="text-sm text-red-600">{form.formState.errors.keywords.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-tender-orange" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts when matching tenders are found
              </p>
            </div>
            <Controller
              control={form.control}
              name="emailSettings.enabled"
              render={({ field }) => (
                <Switch
                  id="emailEnabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Notification Frequency</Label>
              <Controller
                control={form.control}
                name="emailSettings.frequency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Summary</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {form.watch('emailSettings.frequency') === 'daily' && (
              <div>
                <Label htmlFor="dailySummaryTime">Daily Summary Time</Label>
                <Input
                  id="dailySummaryTime"
                  type="time"
                  {...form.register('emailSettings.dailySummaryTime')}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="customEmail">Custom Email (Optional)</Label>
            <Input
              id="customEmail"
              type="email"
              {...form.register('emailSettings.customEmail')}
              placeholder="Leave empty to use your account email"
              className="mt-1"
            />
            {form.formState.errors.emailSettings?.customEmail && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.emailSettings.customEmail.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optional Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-tender-orange" />
            Filters (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Narrow down your alerts with additional criteria
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Categories */}
          <div>
            <Label>Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Controller
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <Checkbox
                        id={category}
                        checked={field.value?.includes(category) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value || []), category]);
                          } else {
                            field.onChange(field.value?.filter((c) => c !== category) || []);
                          }
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={category} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Organization Types */}
          <div>
            <Label>Organization Types</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {ORGANIZATION_TYPES.map((org) => (
                <div key={org.value} className="flex items-center space-x-2">
                  <Controller
                    control={form.control}
                    name="organizationTypes"
                    render={({ field }) => (
                      <Checkbox
                        id={org.value}
                        checked={field.value?.includes(org.value) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value || []), org.value]);
                          } else {
                            field.onChange(field.value?.filter((o) => o !== org.value) || []);
                          }
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={org.value} className="text-sm">
                    {org.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Value Range */}
          <div>
            <Label>Estimated Value Range</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min value"
                  {...form.register('estimatedValue.min', { valueAsNumber: true })}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max value"
                  {...form.register('estimatedValue.max', { valueAsNumber: true })}
                />
              </div>
              <Controller
                control={form.control}
                name="estimatedValue.currency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LKR">LKR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {form.formState.errors.estimatedValue?.min && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.estimatedValue.min.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-tender-orange" />
                  Advanced Filters
                </div>
                {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Additional filtering options for precise matching
              </p>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-6 space-y-4">
              {/* Exclude Keywords */}
              <div>
                <Label>Exclude Keywords</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Keywords that should NOT appear in matching tenders
                </p>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newExcludeKeyword}
                    onChange={(e) => setNewExcludeKeyword(e.target.value)}
                    placeholder="Enter keyword to exclude"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExcludeKeyword();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addExcludeKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(form.watch('advancedFilters.excludeKeywords') || []).map((keyword, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeExcludeKeyword(index)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Days Until Closing */}
              <div>
                <Label>Days Until Closing</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min days"
                      {...form.register('advancedFilters.minDaysUntilClosing', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max days"
                      {...form.register('advancedFilters.maxDaysUntilClosing', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                {form.formState.errors.advancedFilters?.minDaysUntilClosing && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.advancedFilters.minDaysUntilClosing.message}
                  </p>
                )}
              </div>

              {/* Tender Statuses */}
              <div>
                <Label>Include Tender Statuses</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {TENDER_STATUSES.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Controller
                        control={form.control}
                        name="advancedFilters.includedStatuses"
                        render={({ field }) => (
                          <Checkbox
                            id={status.value}
                            checked={field.value?.includes(status.value) || false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), status.value]);
                              } else {
                                field.onChange(field.value?.filter((s) => s !== status.value) || []);
                              }
                            }}
                          />
                        )}
                      />
                      <Label htmlFor={status.value} className="text-sm">
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tender Priorities */}
              <div>
                <Label>Include Tender Priorities</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {TENDER_PRIORITIES.map((priority) => (
                    <div key={priority.value} className="flex items-center space-x-2">
                      <Controller
                        control={form.control}
                        name="advancedFilters.includedPriorities"
                        render={({ field }) => (
                          <Checkbox
                            id={priority.value}
                            checked={field.value?.includes(priority.value) || false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), priority.value]);
                              } else {
                                field.onChange(field.value?.filter((p) => p !== priority.value) || []);
                              }
                            }}
                          />
                        )}
                      />
                      <Label htmlFor={priority.value} className="text-sm">
                        {priority.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="orange"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Alert' : 'Create Alert'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AlertForm;