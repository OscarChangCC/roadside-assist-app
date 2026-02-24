import { TenantConfig } from './config';
import tenants from './tenants';

const DEFAULT_TENANT = 'demo';

export function getTenant(): TenantConfig {
  const tenantId = process.env.EXPO_PUBLIC_TENANT ?? DEFAULT_TENANT;
  const tenant = tenants[tenantId];

  if (!tenant) {
    console.warn(
      `Tenant "${tenantId}" not found. Falling back to "${DEFAULT_TENANT}".`
    );
    return tenants[DEFAULT_TENANT];
  }

  return tenant;
}

export type { TenantConfig };
