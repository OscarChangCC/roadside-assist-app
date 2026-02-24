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
  logoText: string;           // fallback text if no logoImage
  logoImage?: number;         // require('../../../assets/logo-xxx.png')
  apiBaseUrl: string;
  insurerCode: string;
  hotlineNumber: string;
  workshops: Workshop[];
  googleMapsApiKey: string;
};
