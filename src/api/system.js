import { API_BASE_URL, apiClient } from './client.js';

const SYSTEM_RESOURCE_PATH = '/api/system/resource';

export async function getSystemIpaddr() {
  const { data } = await apiClient.get('/api/system/ipaddr');

  return data;
}

export function getSystemResourceStreamUrl() {
  if (!API_BASE_URL) return SYSTEM_RESOURCE_PATH;

  return `${API_BASE_URL.replace(/\/$/, '')}${SYSTEM_RESOURCE_PATH}`;
}
