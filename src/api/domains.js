import { apiClient } from './client.js';

export async function getDomains() {
  const { data } = await apiClient.get('/api/domains');

  return data;
}

export async function patchDomainEnabled({ serviceCode, enabled }) {
  const { data } = await apiClient.patch(`/api/domains/${serviceCode}/enabled`, {
    enabled,
  });

  return data;
}
