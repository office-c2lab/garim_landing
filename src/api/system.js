import { mockGetSystemIpaddr, mockGetSystemResource } from '../../mockData.js';

export async function getSystemIpaddr() {
  return mockGetSystemIpaddr();
}

export async function getSystemResource() {
  return mockGetSystemResource();
}
