# RoadsideAssist

A multi-tenant roadside assistance mobile app built with Expo (React Native) and TypeScript. Designed for insurance companies to white-label and deploy to their customers — providing instant one-tap access to breakdown and accident hotlines.

---

## Overview

RoadsideAssist is a call-trigger app. There is no backend. Its sole purpose is to:

1. Display the correct branding for the active tenant (insurer).
2. Let users tap a button to call breakdown or accident hotlines.
3. Show a confirmation modal before dialling to prevent accidental calls.

---

## Multi-Tenancy

The active tenant is controlled by the `EXPO_PUBLIC_TENANT` environment variable set at build time.

| Variable              | Effect                                     |
|-----------------------|--------------------------------------------|
| `EXPO_PUBLIC_TENANT=demo` | Loads Demo Assist branding and numbers |
| `EXPO_PUBLIC_TENANT=aia`  | Loads AIA Roadside branding and numbers |

`EXPO_PUBLIC_` prefix is required by Expo for variables to be available in the app bundle at runtime (see [Expo docs on environment variables](https://docs.expo.dev/guides/environment-variables/)).

At runtime, `src/tenants/index.ts` reads `process.env.EXPO_PUBLIC_TENANT` and returns the matching `TenantConfig`. If no matching tenant is found, it falls back to `demo`.

---

## Project Structure

```
roadside-assist-app/
├── App.tsx                        # Root component — sets up navigation
├── app.json                       # Expo config
├── eas.json                       # EAS Build profiles (per-tenant)
├── assets/                        # App icons and splash screen
└── src/
    ├── tenants/
    │   ├── config.ts              # TenantConfig type definition
    │   ├── tenants.ts             # All tenant configurations
    │   └── index.ts               # getTenant() — reads EXPO_PUBLIC_TENANT
    ├── screens/
    │   └── HomeScreen.tsx         # Main screen: branding + call buttons
    └── components/
        └── CallConfirmModal.tsx   # Confirmation bottom sheet before dialling
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start Expo dev server (uses "demo" tenant by default)
npx expo start

# Run with a specific tenant
EXPO_PUBLIC_TENANT=aia npx expo start
```

Scan the QR code with the [Expo Go](https://expo.dev/client) app on your device, or press `i` for iOS simulator / `a` for Android emulator.

---

## Building Per-Tenant with EAS

EAS Build profiles in `eas.json` handle tenant-specific env variables automatically.

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build for the demo tenant
eas build --profile demo --platform android

# Build for AIA tenant
eas build --profile aia --platform ios

# Development build (for use with Expo Dev Client)
eas build --profile development --platform all
```

Each profile injects `EXPO_PUBLIC_TENANT` into the build environment, so the app bundles with the correct branding baked in.

---

## Adding a New Tenant

1. Open `src/tenants/tenants.ts`.
2. Add a new entry to the `tenants` object:

```ts
newinsurer: {
  id: 'newinsurer',
  name: 'New Insurer Roadside',
  tagline: 'Your safety, our priority',
  primaryColor: '#0A7EA4',
  secondaryColor: '#E0F4FF',
  logoText: 'NI',
  breakdown: {
    label: 'Breakdown Assistance',
    number: '+60121234567',
  },
  accident: {
    label: 'Accident Hotline',
    number: '+60129876543',
  },
},
```

3. Add a matching build profile in `eas.json`:

```json
"newinsurer": {
  "distribution": "internal",
  "env": {
    "EXPO_PUBLIC_TENANT": "newinsurer"
  }
}
```

4. Run `eas build --profile newinsurer --platform android` to build.

No code changes beyond `tenants.ts` and `eas.json` are needed.

---

## Tech Stack

| Dependency | Purpose |
|---|---|
| `expo` | Build toolchain, OTA updates, dev server |
| `react-native` | Cross-platform mobile UI |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/native-stack` | Stack navigator |
| `react-native-screens` | Native screen optimisation |
| `react-native-safe-area-context` | Safe area handling |

No state management libraries. No UI component libraries. No backend.
