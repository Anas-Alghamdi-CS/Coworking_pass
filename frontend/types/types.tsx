export type UserRole = 'individual' | 'organization' | 'admin';
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
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  avatar: string;
  isBlocked: boolean;
  joinDate: string;
  orgName?: string;
  orgSize?: number;
  employees?: Employee[];
  orgDescription?: string;
  website?: string;
  industry?: string;
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
  | 'admin-dashboard'
  | 'admin-spaces'
  | 'admin-users'
  | 'admin-bookings'
  | 'admin-reports'
  | 'admin-settings';

export interface NavState {
  screen: Screen;
  params: Record<string, any>;
}