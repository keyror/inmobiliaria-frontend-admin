export interface IPlan {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  frequency_type_id: string | null;
  discount: number | null;
  frequency?: { id: string; name: string; alias: string } | null;
  max_users: number;
  max_properties: number;
  max_images_per_property: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IPlanSelectOption {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  frequency_type_id: string | null;
  discount: number | null;
  frequency?: { id: string; name: string; alias: string } | null;
  max_users: number;
  max_properties: number;
  max_images_per_property: number;
}

