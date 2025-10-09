export type TenantKey = "weokto";

export function resolveTenantFromHost(): TenantKey {
  return "weokto";
}

export async function getRequestTenant(): Promise<TenantKey> {
  return "weokto";
}
