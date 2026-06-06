export interface PublicCompanyResponse {
  status: boolean;
  data: PublicCompany | null;
}

export interface PublicCompany {
  id: string;
  name: string | null;
  company_name: string | null;
  tradename: string | null;
  nit: string | null;
  logo: PublicCompanyLogo | null;
}

export interface PublicCompanyLogo {
  id: string;
  title: string | null;
  url: string | null;
}
