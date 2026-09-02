export type UserRole =
  | 'individual'
  | 'organization'
  | 'provider'
  | 'admin'
  | 'B2C'
  | 'HR_ADMIN'
  | 'PARTNER_ADMIN'
  | 'SUPER_ADMIN';

export type BookingStatus = 'active' | 'previous' | 'cancelled';

export type BookingType = 'hot-desk' | 'private-office' | 'meeting-room';

export type BookingPlan = 'daily' | 'monthly' | 'yearly';

export type SpaceType =
  | 'hot-desk'
  | 'shared-desk'
  | 'private-office'
  | 'meeting-room'
  | 'theater'
  | 'mixed';

export type BookingMode = 'subscription' | 'hourly';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'cancelled' | 'reminder' | 'info';
  read: boolean;
  createdAt: string;
}

export interface SpaceBookingPackage {
  id: string;
  name: string;
  period: 'day' | 'month';
  hours: number;
  price: number;
}

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

  // باقات الحجز بالساعات (من كودهم)
  bookingMode?: BookingMode;
  bookingPackages?: SpaceBookingPackage[];

  rating: number;
  reviewCount: number;
  isVisible: boolean;
  isFeatured: boolean;
  openHours: string;
  phone: string;
  email: string;
  ownerId?: string; // id of the provider who owns/manages this space
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
  companyId?: string;
  orgName?: string;
  orgSize?: number;
  employees?: Employee[];
  orgDescription?: string;
  website?: string;
  industry?: string;
  savedCards?: PaymentCard[];
  businessName?: string;
  crNumber?: string;
  city?: string;
  businessDescription?: string;
  revenueShare?: number;
  hasActivePass?: boolean;
  membershipTier?: 'All-Access Pass' | 'Pro Pass' | 'Basic Pass' | 'Enterprise Pass' | string;
}

export function isUserPassHolder(user: User | null): boolean {
  if (!user) return false;
  if (user.hasActivePass !== undefined) return user.hasActivePass;
  return user.role === 'individual' || user.role === 'organization' || user.role === 'B2C' || user.role === 'HR_ADMIN';
}

export type MembershipTier = 'all-access' | 'pro' | 'basic' | 'enterprise' | 'none';

export interface PlanPricingResult {
  isCovered: boolean;
  effectivePrice: number;
  originalPrice: number;
  badgeLabel: string;
  hasDiscount: boolean;
  discountPercentage?: number;
}

export function getEffectiveSpacePrice(
  user: User | null,
  space: Space,
  planType: 'daily' | 'monthly' | 'yearly' = 'daily',
  deskType?: BookingType | SpaceType
): PlanPricingResult {
  const originalPrice = space?.pricing?.[planType] ?? 100;

  if (!user) {
    return {
      isCovered: false,
      effectivePrice: originalPrice,
      originalPrice,
      badgeLabel: `SAR ${originalPrice.toLocaleString()}`,
      hasDiscount: false,
    };
  }

  const tier: MembershipTier = user.membershipTier
    ? (user.membershipTier.toLowerCase().includes('enterprise') ? 'enterprise'
        : user.membershipTier.toLowerCase().includes('all-access') ? 'all-access'
        : user.membershipTier.toLowerCase().includes('pro') ? 'pro'
        : user.membershipTier.toLowerCase().includes('basic') ? 'basic' : 'none')
    : (user.role === 'organization' || user.role === 'HR_ADMIN' ? 'enterprise'
        : user.hasActivePass !== false ? 'all-access' : 'none');

  const targetType = deskType || space.type;

  if (tier === 'enterprise') {
    return {
      isCovered: true,
      effectivePrice: 0,
      originalPrice,
      badgeLabel: 'Included in Pass',
      hasDiscount: true,
      discountPercentage: 100,
    };
  }

  if (tier === 'all-access') {
    if (targetType === 'private-office') {
      const effectivePrice = Math.round(originalPrice * 0.3);
      return {
        isCovered: false,
        effectivePrice,
        originalPrice,
        badgeLabel: `SAR ${effectivePrice} (70% Off Upgrade)`,
        hasDiscount: true,
        discountPercentage: 70,
      };
    }
    return {
      isCovered: true,
      effectivePrice: 0,
      originalPrice,
      badgeLabel: 'Included in Pass',
      hasDiscount: true,
      discountPercentage: 100,
    };
  }

  if (tier === 'pro') {
    if (targetType === 'hot-desk' || targetType === 'mixed' || targetType === 'shared-desk') {
      if (planType === 'daily' || planType === 'monthly') {
        return {
          isCovered: true,
          effectivePrice: 0,
          originalPrice,
          badgeLabel: 'Included in Pass',
          hasDiscount: true,
          discountPercentage: 100,
        };
      }
    }
    const effectivePrice = Math.round(originalPrice * 0.5);
    return {
      isCovered: false,
      effectivePrice,
      originalPrice,
      badgeLabel: `SAR ${effectivePrice} (50% Off)`,
      hasDiscount: true,
      discountPercentage: 50,
    };
  }

  if (tier === 'basic') {
    if ((targetType === 'hot-desk' || targetType === 'shared-desk') && planType === 'daily') {
      return {
        isCovered: true,
        effectivePrice: 0,
        originalPrice,
        badgeLabel: 'Included in Pass',
        hasDiscount: true,
        discountPercentage: 100,
      };
    }
  }

  return {
    isCovered: false,
    effectivePrice: originalPrice,
    originalPrice,
    badgeLabel: `SAR ${originalPrice.toLocaleString()}`,
    hasDiscount: false,
  };
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

  // الحقول الخاصة بحجز الساعات
  bookingPackageId?: string;
  bookingHours?: number;

  startDate: string;
  endDate: string;
  seats: number;
  employees: string[];
  totalPrice: number;
  status: BookingStatus;
  createdAt?: string;
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
  | 'forgot-password'
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
  | 'provider-settings'
  | 'notifications';

export interface NavState {
  screen: Screen;
  params: Record<string, any>;
}
