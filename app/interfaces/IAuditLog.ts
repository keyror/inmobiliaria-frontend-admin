export interface IAuditLog {
  id: number;
  log_name: string;
  module_label: string;
  description: string;
  event: string | null;
  subject_type: string | null;
  subject_id: string | null;
  causer_email: string | null;
  properties: {
    old?: Record<string, unknown>;
    attributes?: Record<string, unknown>;
  } | null;
  created_at: string;
}
