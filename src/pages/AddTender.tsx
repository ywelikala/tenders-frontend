import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCreateTender } from '../hooks/useTenders';
import { Loader2, ArrowLeft, Save, Send, Plus, X } from 'lucide-react';
import type { CreateTenderData } from '../types';

const AddTender = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const createTenderMutation = useCreateTender();
  
  const [formData, setFormData] = useState<CreateTenderData>({
    title: '',
    description: '',
    referenceNo: '',
    category: '',
    subcategory: '',
    organization: {
      name: user?.company || '',
      type: 'private',
      contactPerson: {
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email || '',
        phone: user?.phone || ''
      }
    },
    location: {
      province: '',
      district: '',
      city: ''
    },
    dates: {
      published: new Date().toISOString().split('T')[0],
      closing: '',
      opening: ''
    },
    financials: {
      estimatedValue: {
        amount: 0,
        currency: 'LKR'
      },
      bidBond: {
        required: false,
        percentage: 0
      },
      performanceBond: {
        required: false,
        percentage: 0
      }
    },
    eligibility: {
      criteria: [],
      documentRequired: [],
      experience: {
        years: 0,
        description: ''
      },
      turnover: {
        minimum: 0,
        currency: 'LKR'
      }
    },
    priority: 'medium',
    visibility: 'public',
    tags: []
  });

  const [newCriterion, setNewCriterion] = useState('');
  const [newDocument, setNewDocument] = useState('');
  const [newTag, setNewTag] = useState('');

  const categories = [
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

  const provinces = [
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

  const handleInputChange = (field: string, value: any) => {
    const fields = field.split('.');
    setFormData(prev => {
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) current[fields[i]] = {};
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
      return updated;
    });
  };

  const addCriterion = () => {
    if (newCriterion.trim()) {
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility!,
          criteria: [...(prev.eligibility?.criteria || []), newCriterion.trim()]
        }
      }));
      setNewCriterion('');
    }
  };

  const removeCriterion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility!,
        criteria: prev.eligibility!.criteria.filter((_, i) => i !== index)
      }
    }));
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility!,
          documentRequired: [...(prev.eligibility?.documentRequired || []), newDocument.trim()]
        }
      }));
      setNewDocument('');
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility!,
        documentRequired: prev.eligibility!.documentRequired.filter((_, i) => i !== index)
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.referenceNo.trim()) return 'Reference number is required';
    if (!formData.category) return 'Category is required';
    if (!formData.organization.name.trim()) return 'Organization name is required';
    if (!formData.location.province) return 'Province is required';
    if (!formData.location.district.trim()) return 'District is required';
    if (!formData.dates.closing) return 'Closing date is required';
    
    const closingDate = new Date(formData.dates.closing);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (closingDate <= today) return 'Closing date must be in the future';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setError('');

    if (!isDraft) {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    try {
      await createTenderMutation.mutateAsync({
        ...formData,
        status: isDraft ? 'draft' : 'published'
      });
      
      // Navigate back to supplier dashboard
      navigate('/supplier/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tender');
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => handleSubmit(e, true);
  const handlePublish = (e: React.FormEvent) => handleSubmit(e, false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link to="/supplier/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Tender</h1>
            <p className="text-gray-600">Create a new tender opportunity for your organization</p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tender Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter tender title"
                    className="mt-1"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="referenceNo">Reference Number *</Label>
                  <Input
                    id="referenceNo"
                    placeholder="Enter reference number"
                    className="mt-1"
                    value={formData.referenceNo}
                    onChange={(e) => handleInputChange('referenceNo', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the tender requirements"
                  className="mt-1 min-h-32"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    placeholder="Enter subcategory (optional)"
                    className="mt-1"
                    value={formData.subcategory || ''}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    placeholder="Enter organization name"
                    className="mt-1"
                    value={formData.organization.name}
                    onChange={(e) => handleInputChange('organization.name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select 
                    value={formData.organization.type}
                    onValueChange={(value) => handleInputChange('organization.type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="semi-government">Semi-Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Person Name</Label>
                  <Input
                    id="contactName"
                    className="mt-1"
                    value={formData.organization.contactPerson?.name || ''}
                    onChange={(e) => handleInputChange('organization.contactPerson.name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    className="mt-1"
                    value={formData.organization.contactPerson?.email || ''}
                    onChange={(e) => handleInputChange('organization.contactPerson.email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    className="mt-1"
                    value={formData.organization.contactPerson?.phone || ''}
                    onChange={(e) => handleInputChange('organization.contactPerson.phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="province">Province *</Label>
                  <Select onValueChange={(value) => handleInputChange('location.province', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    placeholder="Enter district"
                    className="mt-1"
                    value={formData.location.district}
                    onChange={(e) => handleInputChange('location.district', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city (optional)"
                    className="mt-1"
                    value={formData.location.city || ''}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="published">Published Date</Label>
                  <Input
                    id="published"
                    type="date"
                    className="mt-1"
                    value={formData.dates.published || ''}
                    onChange={(e) => handleInputChange('dates.published', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="closing">Closing Date *</Label>
                  <Input
                    id="closing"
                    type="date"
                    className="mt-1"
                    value={formData.dates.closing}
                    onChange={(e) => handleInputChange('dates.closing', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="opening">Opening Date</Label>
                  <Input
                    id="opening"
                    type="date"
                    className="mt-1"
                    value={formData.dates.opening || ''}
                    onChange={(e) => handleInputChange('dates.opening', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedValue">Estimated Value (LKR)</Label>
                  <Input
                    id="estimatedValue"
                    type="number"
                    placeholder="Enter estimated value"
                    className="mt-1"
                    value={formData.financials?.estimatedValue?.amount || ''}
                    onChange={(e) => handleInputChange('financials.estimatedValue.amount', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="bidBondPercentage">Bid Bond (%)</Label>
                    <Input
                      id="bidBondPercentage"
                      type="number"
                      placeholder="0"
                      className="mt-1"
                      value={formData.financials?.bidBond?.percentage || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        handleInputChange('financials.bidBond.percentage', value);
                        handleInputChange('financials.bidBond.required', value > 0);
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="performanceBondPercentage">Performance Bond (%)</Label>
                <Input
                  id="performanceBondPercentage"
                  type="number"
                  placeholder="0"
                  className="mt-1"
                  value={formData.financials?.performanceBond?.percentage || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    handleInputChange('financials.performanceBond.percentage', value);
                    handleInputChange('financials.performanceBond.required', value > 0);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Eligibility Criteria</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Enter eligibility criterion"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                  />
                  <Button type="button" onClick={addCriterion} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.eligibility?.criteria?.map((criterion, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {criterion}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCriterion(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Required Documents</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Enter required document"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                  />
                  <Button type="button" onClick={addDocument} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.eligibility?.documentRequired?.map((doc, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {doc}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeDocument(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceYears">Experience Required (Years)</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    placeholder="0"
                    className="mt-1"
                    value={formData.eligibility?.experience?.years || ''}
                    onChange={(e) => handleInputChange('eligibility.experience.years', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="minTurnover">Minimum Turnover (LKR)</Label>
                  <Input
                    id="minTurnover"
                    type="number"
                    placeholder="0"
                    className="mt-1"
                    value={formData.eligibility?.turnover?.minimum || ''}
                    onChange={(e) => handleInputChange('eligibility.turnover.minimum', Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select 
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select 
                    value={formData.visibility}
                    onValueChange={(value) => handleInputChange('visibility', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="registered">Registered Users Only</SelectItem>
                      <SelectItem value="premium">Premium Users Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Enter tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={createTenderMutation.isPending}
              className="flex items-center gap-2"
            >
              {createTenderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={handlePublish}
              disabled={createTenderMutation.isPending}
              className="bg-tender-blue hover:bg-tender-blue-hover text-white flex items-center gap-2"
            >
              {createTenderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publish Tender
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTender;