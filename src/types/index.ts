// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  role: 'buyer' | 'supplier' | 'admin';
  isEmailVerified: boolean;
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled' | 'suspended';
    startDate: string;
    endDate: string;
    features: {
      maxTenderViews: number;
      canUploadTenders: boolean;
      advancedFiltering: boolean;
      emailAlerts: boolean;
    };
  };
  usage: {
    tenderViewsThisMonth: number;
    lastTenderView?: string;
    totalTendersUploaded: number;
  };
  preferences: {
    categories: string[];
    locations: string[];
    emailNotifications: {
      newTenders: boolean;
      tenderUpdates: boolean;
      subscriptionUpdates: boolean;
    };
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Tender types
export interface Tender {
  _id: string;
  title: string;
  description: string;
  fullTextMarkdown?: string;
  referenceNo: string;
  category: string;
  subcategory?: string;
  organization: {
    name: string;
    type: 'government' | 'private' | 'semi-government' | 'ngo';
    contactPerson?: {
      name: string;
      email: string;
      phone: string;
    };
  };
  location: {
    province: string;
    district: string;
    city?: string;
  };
  dates: {
    published: string;
    closing: string;
    opening?: string;
  };
  financials?: {
    estimatedValue?: {
      amount: number;
      currency: string;
    };
    bidBond?: {
      required: boolean;
      amount?: number;
      percentage?: number;
    };
    performanceBond?: {
      required: boolean;
      percentage?: number;
    };
  };
  eligibility?: {
    criteria: string[];
    documentRequired: string[];
    experience?: {
      years: number;
      description: string;
    };
    turnover?: {
      minimum: number;
      currency: string;
    };
  };
  documents: TenderDocument[];
  status: 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  visibility: 'public' | 'registered' | 'premium';
  tags: string[];
  statistics: {
    views: number;
    downloads: number;
    applications: number;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    company?: string;
  };
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  daysRemaining: number;
  isClosingToday: boolean;
  isExpired: boolean;
}

export interface TenderDocument {
  _id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'image';
  size: number;
  uploadedAt: string;
}

// Subscription types
export interface SubscriptionPlan {
  _id: string;
  name: 'free' | 'basic' | 'premium' | 'enterprise';
  displayName: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    maxTenderViews: number;
    canUploadTenders: boolean;
    maxTenderUploads: number;
    advancedFiltering: boolean;
    emailAlerts: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    customReports: boolean;
    bulkDownloads: boolean;
  };
  limits: {
    documentsPerTender: number;
    maxFileSize: number;
    savedSearches: number;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  _id: string;
  user: string;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled' | 'suspended' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  payment: {
    amount: number;
    currency: string;
    method?: 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe';
    transactionId?: string;
    paymentDate?: string;
  };
  usage: {
    currentPeriodStart: string;
    currentPeriodEnd: string;
    tenderViews: number;
    tenderUploads: number;
    documentsDownloaded: number;
    apiCalls: number;
  };
  autoRenew: boolean;
  cancellation?: {
    cancelledAt: string;
    reason: string;
    refundAmount?: number;
    refundStatus?: 'pending' | 'processed' | 'denied' | 'not_applicable';
  };
  history: SubscriptionHistoryItem[];
  metadata?: {
    promotionCode?: string;
    referralCode?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  daysRemaining: number;
  isExpired: boolean;
}

export interface SubscriptionHistoryItem {
  _id: string;
  action: 'created' | 'upgraded' | 'downgraded' | 'renewed' | 'cancelled' | 'suspended' | 'reactivated';
  fromPlan?: string;
  toPlan?: string;
  date: string;
  reason?: string;
  amount?: number;
}

// Statistics types
export interface TenderStats {
  totalTenders: number;
  liveTenders: number;
  todayTenders: number;
  closedTenders: number;
  categoryStats: Array<{
    _id: string;
    count: number;
  }>;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  role: 'buyer' | 'supplier';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Query parameters
export interface TenderQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  province?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  visibility?: string;
  publishedToday?: boolean;
  isLive?: boolean;
  isClosed?: boolean;
}

// Form types
export interface CreateTenderData {
  title: string;
  description: string;
  referenceNo: string;
  category: string;
  subcategory?: string;
  organization: {
    name: string;
    type: 'government' | 'private' | 'semi-government' | 'ngo';
    contactPerson?: {
      name: string;
      email: string;
      phone: string;
    };
  };
  location: {
    province: string;
    district: string;
    city?: string;
  };
  dates: {
    published?: string;
    closing: string;
    opening?: string;
  };
  financials?: {
    estimatedValue?: {
      amount: number;
      currency: string;
    };
    bidBond?: {
      required: boolean;
      amount?: number;
      percentage?: number;
    };
    performanceBond?: {
      required: boolean;
      percentage?: number;
    };
  };
  eligibility?: {
    criteria: string[];
    documentRequired: string[];
    experience?: {
      years: number;
      description: string;
    };
    turnover?: {
      minimum: number;
      currency: string;
    };
  };
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  visibility?: 'public' | 'registered' | 'premium';
  tags?: string[];
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  preferences?: {
    categories?: string[];
    locations?: string[];
    emailNotifications?: {
      newTenders?: boolean;
      tenderUpdates?: boolean;
      subscriptionUpdates?: boolean;
    };
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}