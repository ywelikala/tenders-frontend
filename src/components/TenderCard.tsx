import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Building, MapPin, Calendar, DollarSign, FileText, Users, Eye, Download, ExternalLink } from 'lucide-react';

interface TenderCardProps {
  title: string;
  category: string;
  source: string;
  location: string;
  publishedDate: string;
  closingDate: string;
  referenceNo: string;
  isToday?: boolean;
  // Additional props for expanded view
  tender?: any; // Full tender object from API
}

const TenderCard = ({
  title,
  category,
  source,
  location,
  publishedDate,
  closingDate,
  referenceNo,
  isToday = false,
  tender,
}: TenderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const daysLeft = Math.ceil((new Date(closingDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="ms-card hover:ms-shadow transition-all duration-200 bg-white border border-gray-200" data-testid="tender-card">
      <CardHeader className="pb-6 px-6 pt-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-tender-blue cursor-pointer line-clamp-2 transition-colors">
            {title}
          </h3>
          {isToday && (
            <Badge className="bg-tender-blue text-white border-0 text-xs font-semibold px-3 py-1 rounded">
              Today's Tender
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-6 text-sm mb-6">
          <div className="space-y-1">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Category</span>
            <p className="text-tender-blue font-medium">{category}</p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Source</span>
            <div className="flex items-center gap-2">
              <p className="text-tender-blue cursor-pointer hover:underline font-medium">{source}</p>
              {tender?.sourceUrl && (
                <a 
                  href={tender.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-tender-blue hover:text-tender-blue-hover transition-colors"
                  title="View original tender image"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Location</span>
            <p className="text-gray-800 font-medium">{location}</p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Published Date</span>
            <p className="text-tender-blue cursor-pointer hover:underline font-medium">{publishedDate}</p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Closing Date</span>
            <p className="text-gray-800 font-medium">{closingDate}</p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Reference No</span>
            <p className="text-gray-800 font-medium">{referenceNo}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Closing in:</span>
            <span className={`font-semibold ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-yellow-600' : 'text-tender-blue'}`}>
              {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <Button 
            className="bg-tender-blue hover:bg-tender-blue-hover text-white border-0 rounded font-semibold px-4 py-2 text-sm transition-colors flex items-center gap-2"
            size="sm"
            onClick={toggleExpansion}
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && tender && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
            
            {/* Organization Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <Building className="h-5 w-5 text-tender-blue" />
                Organization Details
              </div>
              <div className="pl-7 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {tender.organization?.type?.charAt(0).toUpperCase() + tender.organization?.type?.slice(1) || 'N/A'}
                    </Badge>
                  </div>
                </div>
                {tender.organization?.contactPerson && (
                  <div className="space-y-1">
                    {tender.organization.contactPerson.name && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-600">Contact:</span> {tender.organization.contactPerson.name}
                      </p>
                    )}
                    {tender.organization.contactPerson.email && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-600">Email:</span> 
                        <a href={`mailto:${tender.organization.contactPerson.email}`} className="text-tender-blue hover:underline ml-1">
                          {tender.organization.contactPerson.email}
                        </a>
                      </p>
                    )}
                    {tender.organization.contactPerson.phone && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-600">Phone:</span> 
                        <a href={`tel:${tender.organization.contactPerson.phone}`} className="text-tender-blue hover:underline ml-1">
                          {tender.organization.contactPerson.phone}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information */}
            {(tender.financials?.estimatedValue?.amount || tender.financials?.bidBond?.required || tender.financials?.performanceBond?.required) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <DollarSign className="h-5 w-5 text-tender-blue" />
                  Financial Information
                </div>
                <div className="pl-7 space-y-2">
                  {tender.financials.estimatedValue?.amount && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Estimated Value:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        {tender.financials.estimatedValue.currency} {tender.financials.estimatedValue.amount} Million
                      </span>
                    </p>
                  )}
                  {tender.financials.bidBond?.required && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Bid Bond:</span>
                      <Badge variant="outline" className="ml-2 text-xs bg-orange-50 text-orange-700">Required</Badge>
                    </p>
                  )}
                  {tender.financials.performanceBond?.required && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Performance Bond:</span>
                      <Badge variant="outline" className="ml-2 text-xs bg-orange-50 text-orange-700">Required</Badge>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Location Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <MapPin className="h-5 w-5 text-tender-blue" />
                Location Details
              </div>
              <div className="pl-7 space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Province:</span>
                  <span className="ml-2">{tender.location?.province || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">District:</span>
                  <span className="ml-2">{tender.location?.district || 'N/A'}</span>
                </p>
                {tender.location?.city && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">City:</span>
                    <span className="ml-2">{tender.location.city}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <Calendar className="h-5 w-5 text-tender-blue" />
                Timeline
              </div>
              <div className="pl-7 space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Published:</span>
                  <span className="ml-2">{publishedDate}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Closes:</span>
                  <span className="ml-2">{closingDate}</span>
                </p>
                {tender.dates?.opening && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Opening:</span>
                    <span className="ml-2">{new Date(tender.dates.opening).toLocaleDateString('en-GB')}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Eligibility & Requirements */}
            {(tender.eligibility?.criteria?.length > 0 || tender.eligibility?.documentRequired?.length > 0 || tender.eligibility?.experience || tender.eligibility?.turnover?.minimum) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <Users className="h-5 w-5 text-tender-blue" />
                  Eligibility & Requirements
                </div>
                <div className="pl-7 space-y-2">
                  {tender.eligibility.criteria?.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">Criteria:</span>
                      <ul className="mt-1 list-disc list-inside text-sm space-y-1">
                        {tender.eligibility.criteria.map((criterion: string, index: number) => (
                          <li key={index} className="text-gray-700">{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tender.eligibility.documentRequired?.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">Required Documents:</span>
                      <ul className="mt-1 list-disc list-inside text-sm space-y-1">
                        {tender.eligibility.documentRequired.map((doc: string, index: number) => (
                          <li key={index} className="text-gray-700">{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tender.eligibility.experience && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Experience Required:</span>
                      <span className="ml-2">{tender.eligibility.experience.years} years - {tender.eligibility.experience.description}</span>
                    </p>
                  )}
                  {tender.eligibility.turnover?.minimum && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Minimum Turnover:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        {tender.eligibility.turnover.currency} {tender.eligibility.turnover.minimum}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Complete Tender Details */}
            {tender.fullTextMarkdown && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <FileText className="h-5 w-5 text-tender-blue" />
                  Complete Tender Details
                </div>
                <div className="pl-7">
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: tender.fullTextMarkdown
                          .replace(/\n/g, '<br>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^# (.*$)/gm, '<h3 class="font-bold text-lg mt-4 mb-2 text-gray-800">$1</h3>')
                          .replace(/^## (.*$)/gm, '<h4 class="font-semibold text-base mt-3 mb-1 text-gray-800">$1</h4>')
                          .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                          .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-tender-blue pl-4 italic text-gray-600">$1</blockquote>')
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Complete tender information extracted and formatted by AI
                  </p>
                </div>
              </div>
            )}

            {/* Source Information */}
            {tender.sourceUrl && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <Eye className="h-5 w-5 text-tender-blue" />
                  Source Information
                </div>
                <div className="pl-7">
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Source Page:</span>
                    <a 
                      href={tender.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-tender-blue hover:underline ml-2 break-all"
                    >
                      View Original Page {tender.sourcePage && `(Page ${tender.sourcePage})`}
                    </a>
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Click to view the original newspaper page where this tender was found
                  </p>
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <Download className="h-5 w-5 text-tender-blue" />
                Documents
              </div>
              <div className="pl-7">
                {tender.documents?.length > 0 ? (
                  <div className="space-y-2">
                    {tender.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.type.toUpperCase()} • {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Size unknown'}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 text-tender-blue border-tender-blue hover:bg-tender-blue hover:text-white"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No documents available</p>
                )}
              </div>
            </div>

            {/* Statistics & Tags */}
            <div className="flex justify-between items-start pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    {tender.statistics?.views || 0} views
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Download className="h-4 w-4" />
                    {tender.statistics?.downloads || 0} downloads
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {tender.statistics?.applications || 0} applications
                  </div>
                </div>
                {tender.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tender.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Badge 
                variant={tender.status === 'published' ? 'default' : 'secondary'} 
                className={`${tender.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                {tender.status?.charAt(0).toUpperCase() + tender.status?.slice(1)}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenderCard;