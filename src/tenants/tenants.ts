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
    insurerCode: 'Others',
    hotlineNumber: '+60312345678',
    workshops: [
      { id: 'demo-w1', name: 'Demo Auto Works', city: 'Kuala Lumpur' },
      { id: 'demo-w2', name: 'PJ Service Centre', city: 'Petaling Jaya' },
      { id: 'demo-w3', name: 'Shah Alam Motors', city: 'Shah Alam' },
      { id: 'demo-w4', name: 'JB Auto Repair', city: 'Johor Bahru' },
      { id: 'demo-w5', name: 'Penang Workshop', city: 'George Town' },
    ],
  },
  aia: {
    id: 'aia',
    name: 'AIA Roadside',
    tagline: 'We have you covered',
    primaryColor: '#E50019',
    secondaryColor: '#FFE5E8',
    logoText: 'AIA',
    apiBaseUrl: 'https://crm.aia.example.com',
    insurerCode: 'AXA',
    hotlineNumber: '+60387654321',
    workshops: [
      { id: 'aia-w1', name: 'AIA Panel Workshop KL', city: 'Kuala Lumpur' },
      { id: 'aia-w2', name: 'AIA Approved PJ Centre', city: 'Petaling Jaya' },
      { id: 'aia-w3', name: 'AIA Shah Alam Hub', city: 'Shah Alam' },
      { id: 'aia-w4', name: 'AIA JB Service Point', city: 'Johor Bahru' },
      { id: 'aia-w5', name: 'AIA Penang Panel', city: 'George Town' },
    ],
  },
};

export default tenants;
