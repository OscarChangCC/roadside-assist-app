const tenant = process.env.EXPO_PUBLIC_TENANT || 'demo';

const tenantMeta = {
  demo: {
    name: 'Demo Roadside Assist',
    androidPackage: 'com.answerdesk.demo.roadsideassist',
  },
  pib: {
    name: 'TPIB Roadside Assist',
    androidPackage: 'com.thepacificinsurance.roadsideassist',
  },
};

const meta = tenantMeta[tenant] || tenantMeta.demo;

module.exports = {
  expo: {
    name: meta.name,
    slug: 'roadside-assist-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      package: meta.androidPackage,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: { favicon: './assets/favicon.png' },
    plugins: [
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to access your location to help dispatch roadside assistance.',
        },
      ],
    ],
  },
};
