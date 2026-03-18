import { TenantConfig } from './config';

const tenants: Record<string, TenantConfig> = {
  demo: {
    id: 'demo',
    name: 'Demo Assist',
    tagline: 'Always here when you need us',
    primaryColor: '#1E3A8A',
    secondaryColor: '#DBEAFE',
    logoText: 'DA',
    apiBaseUrl: 'https://crm.demo.example.com',
    apiKey: process.env.EXPO_PUBLIC_API_KEY_DEMO ?? 'dev-others-key',
    programCode: 'Others',
    hotlineNumber: '+60312345678',
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  },
  pib: {
    id: 'pib',
    name: 'The Pacific Insurance Berhad',
    tagline: 'Speed, Service and Tender Loving Care',
    primaryColor: '#005BAA',
    secondaryColor: '#E8F2FB',
    logoText: 'PIB',
    logoImage: require('../../assets/logo-pib.png'),
    apiBaseUrl: 'https://crm-internal.answer-desk.com',
    apiKey: process.env.EXPO_PUBLIC_API_KEY_PIB ?? 'dev-pacific-key',
    programCode: 'Pacific',
    hotlineNumber: '1800884488',
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  },
};

export default tenants;
