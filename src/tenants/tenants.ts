import { TenantConfig } from './config';

const tenants: Record<string, TenantConfig> = {
  demo: {
    id: 'demo',
    name: 'Demo Assist',
    apiProgram: 'Demo',
    tagline: 'Always here when you need us',
    primaryColor: '#1E3A8A',
    secondaryColor: '#DBEAFE',
    logoText: 'DA',
    apiBaseUrl: 'https://crm.demo.example.com',
    insurerCode: 'Others',
    hotlineNumber: '+60312345678',
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  },
  pib: {
    id: 'pib',
    name: 'The Pacific Insurance Berhad',
    apiProgram: 'Pacific',
    tagline: 'Speed, Service and Tender Loving Care',
    primaryColor: '#005BAA',   // Pacific blue — swap if brand has different hex
    secondaryColor: '#E8F2FB',
    logoText: 'PIB',
    logoImage: require('../../assets/logo-pib.png'),  // replace this file with real logo
    apiBaseUrl: 'https://crm.example.com',            // update with real CRM URL
    insurerCode: 'Pacific',
    hotlineNumber: '1800884488',
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  },
};

export default tenants;
