export type TenantConfig = {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  breakdown: {
    label: string;
    number: string;
  };
  accident: {
    label: string;
    number: string;
  };
};
