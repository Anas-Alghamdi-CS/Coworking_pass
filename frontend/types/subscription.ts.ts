export type PlanType = 'B2C' | 'B2B';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED';
export type CheckInStatus = 'VALID' | 'FRAUD_ATTEMPT';

export interface MembershipPlan {
  id: string; 
  name: string;
  type: PlanType;
  total_visits_allowed: number; 
  price: number;
}

export interface Subscription {
  id: string; 
  user_id: string; 
  plan_id: string; 
  start_date: string; 
  end_date: string; 
  visits_used: number;
  status: SubscriptionStatus;
  plan?: MembershipPlan; 
}

export interface CheckIn {
  id: string; 
  user_id: string; 
  workspace_id: string; 
  scanned_at: string; 
  qr_code_hash: string;
  status: CheckInStatus;
  workspace_name?: string;
}
