const tenant = process.env.EXPO_PUBLIC_TENANT || 'demo';

const tenantMeta = {
  demo: {
    name: 'Demo Roadside Assist',
    androidPackage: 'com.answerdesk.demo.roadsideassist',
    icon: './assets/icon.png',
    adaptiveIcon: './assets/adaptive-icon.png',
  },
  pib: {
    name: 'TPIB Roadside Assist',
    androidPackage: 'com.thepacificinsurance.roadsideassist',
    icon: './assets/icon-pib.png',
    adaptiveIcon: './assets/adaptive-icon-pib.png',
  },
};

const meta = tenantMeta[tenant] || tenantMeta.demo;

module.exports = {
  expo: {
    name: meta.name,
    slug: 'roadside-assist-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: meta.icon,
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
        foregroundImage: meta.adaptiveIcon,
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
    extra: {
      eas: {
        projectId: 'a3ae4334-0257-499b-b1c1-d6b46762007a',
      },
    },
  },
};
