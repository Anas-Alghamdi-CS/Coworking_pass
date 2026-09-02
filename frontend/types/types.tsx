export type BookingStatus = 'active' | 'previous' | 'cancelled';
export type BookingType = 'hot-desk' | 'private-office' | 'meeting-room';
export type BookingPlan = 'daily' | 'monthly' | 'yearly';
export type SpaceType = 'hot-desk' | 'private-office' | 'meeting-room' | 'mixed';

export interface SpacePricing {
  daily: number;
  monthly: number;
  yearly: number;
}

export interface Space {
  id: string;
  name: string;
  city: string;
  region?: string;
  district?: string;
  address: string;
  description: string;
  type: SpaceType;
  images: string[];
  amenities: string[];
  totalCapacity: number;
  availableCapacity: number;
  pricing: SpacePricing;
  rating: number;
  reviewCount: number;
  isVisible: boolean;
  isFeatured: boolean;
  openHours: string;
  phone: string;
  email: string;
  ownerId?: string; // id of the provider (User with role 'provider') who owns/manages this space
  status?: 'published' | 'draft' | 'hidden';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface PaymentCard {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Mada';
  last4: string;
  holderName: string;
  expiry: string; // MM/YY
}

export type UserRole = 'individual' | 'organization' | 'provider' | 'admin' | 'B2C' | 'HR_ADMIN' | 'PARTNER_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  erdRole?: 'B2C' | 'HR_ADMIN' | 'PARTNER_ADMIN' | 'SUPER_ADMIN';
  phone: string;
  avatar: string;
  isBlocked: boolean;
  joinDate: string;
  username?: string;
  university?: string;
  bio?: string;
  companyId?: string; // FK to COMPANIES for B2B employees
  orgName?: string; // COMPANIES.name
  orgSize?: number; // total_passes_purchased
  employees?: Employee[];
  orgDescription?: string;
  website?: string;
  industry?: string;
  savedCards?: PaymentCard[];
  businessName?: string; // PARTNERS.brand_name
  crNumber?: string;
  businessDescription?: string;
  revenueShare?: number; // PARTNERS.revenue_share_percentage
}

export interface Booking {
  id: string;
  userId: string;
  spaceId: string;
  spaceName: string;
  spaceCity: string;
  spaceAddress: string;
  spaceImage: string;
  type: BookingType;
  plan: BookingPlan;
  startDate: string;
  endDate: string;
  seats: number;
  employees: string[];
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export type Screen =
  | 'landing'
  | 'browse'
  | 'space-details'
  | 'pricing'
  | 'contact' 
  | 'login'
  | 'signup'
  | 'choose-type'
  | 'ind-dashboard'
  | 'booking-flow'
  | 'booking-confirm'
  | 'my-bookings'
  | 'booking-details'
  | 'ind-profile'
  | 'ind-settings'
  | 'org-dashboard'
  | 'team-booking'
  | 'team-bookings'
  | 'org-profile'
  | 'org-settings'
  | 'company-workspaces'
  | 'company-add-workspace'
  | 'company-bookings'
  | 'company-team'
  | 'company-workspace-details'
  | 'company-reports'
  | 'admin-dashboard'
  | 'admin-spaces'
  | 'admin-users'
  | 'admin-bookings'
  | 'admin-reports'
  | 'admin-settings'
  | 'provider-dashboard'
  | 'provider-spaces'
  | 'provider-bookings'
  | 'provider-profile'
  | 'provider-settings';

export interface NavState {
  screen: Screen;
  params: Record<string, any>;
}