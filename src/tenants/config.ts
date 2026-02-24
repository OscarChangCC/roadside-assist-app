export type TenantConfig = {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;           // fallback text if no logoImage
  logoImage?: number;         // require('../../../assets/logo-xxx.png')
  apiBaseUrl: string;
  apiKey: string;        // sent as X-API-Key header to CRM
  programCode: string;   // value sent as "program" to CRM API (e.g. "Pacific", "AXA")
  hotlineNumber: string;
  googleMapsApiKey: string;
};
