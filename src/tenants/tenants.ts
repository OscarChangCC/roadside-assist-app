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
    // For local dev: replace with your Mac's LAN IP e.g. http://192.168.1.x:8000
    apiBaseUrl: 'http://192.168.1.x:8000',
    programCode: 'Pacific',
    hotlineNumber: '1800884488',
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  },
};

export default tenants;
