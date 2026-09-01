export interface Partner {
  id: string; 
  brand_name: string;
  contact_email: string;
  revenue_share_percentage: number; 
}

export interface Workspace {
  id: string; 
  partner_id: string;
  name: string;
  city: string;
  location_map_url: string;
  entry_value: number; 
  image_url?: string;
  amenities?: string[];
  partner?: Partner;
}
