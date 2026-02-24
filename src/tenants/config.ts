export type Workshop = {
  id: string;
  name: string;
  city: string;
};

export type TenantConfig = {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  apiBaseUrl: string;
  insurerCode: string;
  hotlineNumber: string;
  workshops: Workshop[];
};
