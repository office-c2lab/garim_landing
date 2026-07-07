import { mockGetDomains, mockPatchDomainEnabled } from '../../mockData.js';

export async function getDomains() {
  return mockGetDomains();
}

export async function patchDomainEnabled({ serviceCode, enabled }) {
  return mockPatchDomainEnabled({ serviceCode, enabled });
}
