# RoadsideAssist

A multi-tenant roadside assistance mobile app built with Expo (React Native) and TypeScript. Insurance companies white-label and deploy it to customers, giving them one-tap access to breakdown assistance and accident reporting with direct CRM integration.

---

## App Flow

**HomeScreen** — three action buttons:

1. **📞 Call Hotline** — dials the tenant's hotline number directly (`Linking.openURL tel:`)
2. **🔧 Breakdown Assistance** — navigates to `BreakdownFormScreen`
3. **🚨 Accident Hotline** — navigates to `AccidentFormScreen`

**BreakdownFormScreen** — user enters vehicle number, contact number, and location (GPS or manual text), then submits to the CRM API. On success, a ticket confirmation is shown and the user returns to Home.

**AccidentFormScreen** — same as Breakdown, plus a workshop picker (tow-to selection). Also submits to the CRM API.

---

## CRM API Integration

Both form screens POST to the tenant's CRM backend:

```
POST {tenant.apiBaseUrl}/api/create_new_ticket/
Content-Type: application/x-www-form-urlencoded
```

| Field | Description |
|---|---|
| `contact_number` | User's phone number |
| `insurer` | Tenant's insurer code (e.g. `"AXA"`, `"Others"`) |
| `vehicle_reg_num` | Vehicle registration (auto-uppercased in UI) |
| `ticket_type` | `"Breakdown"` or `"Accident"` |
| `lat` | GPS latitude decimal string (optional) |
| `lng` | GPS longitude decimal string (optional) |
| `tow_to` | Selected workshop name — Accident tickets only (optional) |

Response: `{ "results": true, "ticket_id": 123 }`

> **Note:** The `ticket_type` and `tow_to` fields may need to be added server-side to the Django CRM's `create_new_ticket` endpoint if not already present.

---

## Multi-Tenancy

The active tenant is set by the `EXPO_PUBLIC_TENANT` environment variable at build time.

| Variable | Tenant |
|---|---|
| `EXPO_PUBLIC_TENANT=demo` | Demo Assist |
| `EXPO_PUBLIC_TENANT=aia` | AIA Roadside |

At runtime, `src/tenants/index.ts` reads `process.env.EXPO_PUBLIC_TENANT` and returns the matching `TenantConfig`. Falls back to `demo` if not set.

### TenantConfig fields

| Field | Description |
|---|---|
| `apiBaseUrl` | CRM base URL, e.g. `"https://crm.example.com"` |
| `insurerCode` | Insurer code sent to CRM as the `insurer` field, e.g. `"AXA"` or `"Others"` |
| `hotlineNumber` | Direct dial number for the Call Hotline button |
| `workshops` | Array of `{ id, name, city }` for the Accident form workshop picker |

---

## Project Structure

```
roadside-assist-app/
├── App.tsx                          # Root — NavigationContainer + stack navigator
├── app.json                         # Expo config
├── eas.json                         # EAS Build profiles (per-tenant)
├── assets/                          # Icons and splash screen
└── src/
    ├── tenants/
    │   ├── config.ts                # TenantConfig type
    │   ├── tenants.ts               # All tenant data
    │   └── index.ts                 # getTenant() — reads EXPO_PUBLIC_TENANT
    ├── screens/
    │   ├── HomeScreen.tsx           # 3-button home screen
    │   ├── BreakdownFormScreen.tsx  # Breakdown form + CRM submit
    │   └── AccidentFormScreen.tsx   # Accident form + workshop picker + CRM submit
    └── components/
        └── LocationPicker.tsx       # Reusable GPS/manual location toggle component
```

---

## Running Locally

```bash
npm install
npx expo start

# With a specific tenant
EXPO_PUBLIC_TENANT=aia npx expo start
```

Scan the QR code with the [Expo Go](https://expo.dev/client) app on your device, or press `i` for iOS simulator / `a` for Android emulator.

---

## Building Per-Tenant with EAS

```bash
eas build --profile demo --platform android
eas build --profile aia --platform ios
```

---

## Adding a New Tenant

1. Add an entry to `src/tenants/tenants.ts`:

```ts
newinsurer: {
  id: 'newinsurer',
  name: 'New Insurer Roadside',
  tagline: 'Your safety, our priority',
  primaryColor: '#0A7EA4',
  secondaryColor: '#E0F4FF',
  logoText: 'NI',
  apiBaseUrl: 'https://crm.newinsurer.example.com',
  insurerCode: 'NewInsurer',
  hotlineNumber: '+60121234567',
  workshops: [
    { id: 'ni-w1', name: 'NI Workshop KL', city: 'Kuala Lumpur' },
  ],
},
```

2. Add a build profile in `eas.json`:

```json
"newinsurer": {
  "distribution": "internal",
  "env": { "EXPO_PUBLIC_TENANT": "newinsurer" }
}
```

No code changes beyond `tenants.ts` and `eas.json` are needed.

---

## Tech Stack

| Dependency | Purpose |
|---|---|
| `expo` | Build toolchain, dev server |
| `react-native` | Cross-platform mobile UI |
| `expo-location` | GPS location + reverse geocoding |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/native-stack` | Stack navigator |
| `react-native-screens` | Native screen optimisation |
| `react-native-safe-area-context` | Safe area insets |
| `@react-native-picker/picker` | Workshop picker on Accident form |
