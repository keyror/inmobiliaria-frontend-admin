export interface IDashboardGroup {
  name: string;
  total: number;
}

export interface IDashboardStats {
  total_properties: number;
  total_people: number;
  featured_properties: number;
  properties_this_month: number;
  by_offer_type: IDashboardGroup[];
  by_status: IDashboardGroup[];
}

export interface IDashboardRecentProperty {
  id: string;
  code: string;
  title: string;
  status: string | null;
  offer_type: string | null;
  cover_url: string | null;
  created_at: string;
}

export interface IDashboard {
  stats: IDashboardStats;
  recent_properties: IDashboardRecentProperty[];
}
