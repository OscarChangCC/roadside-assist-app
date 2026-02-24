import { TenantConfig } from './config';

const tenants: Record<string, TenantConfig> = {
  demo: {
    id: 'demo',
    name: 'Demo Assist',
    tagline: 'Always here when you need us',
    primaryColor: '#1E3A8A',
    secondaryColor: '#DBEAFE',
    logoText: 'DA',
    breakdown: {
      label: 'Breakdown Assistance',
      number: '+60123456789',
    },
    accident: {
      label: 'Accident Hotline',
      number: '+60198765432',
    },
  },
  aia: {
    id: 'aia',
    name: 'AIA Roadside',
    tagline: 'We have you covered',
    primaryColor: '#E50019',
    secondaryColor: '#FFE5E8',
    logoText: 'AIA',
    breakdown: {
      label: 'Breakdown Assistance',
      number: '+60111234567',
    },
    accident: {
      label: 'Accident Hotline',
      number: '+60117654321',
    },
  },
};

export default tenants;
