export type UserRole = 'B2C' | 'HR_ADMIN' | 'PARTNER_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string; 
  email: string;
  role: UserRole;
  company_id?: string | null; 
  name?: string; 
}

export interface Company {
  id: string; 
  name: string;
  hr_admin_id: string; 
  total_passes_purchased: number;
}
