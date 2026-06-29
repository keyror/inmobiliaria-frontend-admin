export interface ISearchProperty {
  id: string;
  code: string;
  label: string;
  subtitle: string;
  cover_url: string | null;
}

export interface ISearchPerson {
  id: string;
  label: string;
  subtitle: string;
}

export interface ISearchCompany {
  id: string;
  label: string;
  subtitle: string;
}

export interface ISearchResults {
  properties: ISearchProperty[];
  people: ISearchPerson[];
  companies: ISearchCompany[];
}

export interface ISearchFlatItem {
  id: string;
  type: "property" | "person" | "company";
  label: string;
  subtitle?: string;
  code?: string;
  cover_url?: string | null;
  route: string;
}
