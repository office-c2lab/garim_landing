import { mockGetRegisteredClients, mockPatchClientMetadata } from '../../mockData.js';

export async function getRegisteredClients(params) {
  return mockGetRegisteredClients(params);
}

export async function patchClientMetadata({ id, metadata }) {
  return mockPatchClientMetadata({ id, metadata });
}
