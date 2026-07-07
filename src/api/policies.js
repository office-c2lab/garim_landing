import {
  mockGetFileUploadExtensions,
  mockGetPolicies,
  mockPatchPolicyEnabled,
  mockPutFileUploadExtensions,
} from '../../mockData.js';

export async function getPolicies() {
  return mockGetPolicies();
}

export async function patchPolicyEnabled({ code, enabled }) {
  return mockPatchPolicyEnabled({ code, enabled });
}

export async function getFileUploadExtensions() {
  return mockGetFileUploadExtensions();
}

export async function putFileUploadExtensions({ blockedExtensions }) {
  return mockPutFileUploadExtensions({ blockedExtensions });
}
