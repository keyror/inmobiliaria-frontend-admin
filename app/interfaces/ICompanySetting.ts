export interface ICompanySetting {
  text_case_mode: string | null;
  has_custom_smtp?: boolean;
  smtp_host?: string | null;
  smtp_port?: number | null;
  smtp_encryption?: string | null;
  smtp_username?: string | null;
  smtp_password?: string | null;
  smtp_from_email?: string | null;
}
