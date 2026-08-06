export type SignatoryRole = 'arrendatario' | 'arrendador' | 'codeudor' | 'propietario' | 'custom';
export type SignatoryStatus = 'pending' | 'viewed' | 'signed' | 'rejected' | 'expired';
export type SignatureType = 'drawn' | 'uploaded';

export interface IDocumentSignatory {
  id: string | null;
  document_id?: string;
  person_id?: string | null;
  name: string;
  email: string;
  role: SignatoryRole;
  order: number;
  status: SignatoryStatus;
  viewed_at?: string | null;
  signed_at?: string | null;
  signature_type?: SignatureType | null;
  rejection_reason?: string | null;
  token_expires_at?: string | null;
  created_at?: string | null;
}

export interface ISigningPageData {
  signatory: IDocumentSignatory;
  document: {
    id: string;
    title: string;
    number: string | null;
  };
  company: {
    name: string;
    logo_url: string | null;
  };
}
