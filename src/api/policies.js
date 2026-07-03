import { apiClient } from './client.js';

export async function getPolicies() {
  const { data } = await apiClient.get('/api/policies');

  return data;
}

export async function patchPolicyEnabled({ code, enabled }) {
  const { data } = await apiClient.patch(`/api/policies/${code}/enabled`, {
    enabled,
  });

  return data;
}

export async function getFileUploadExtensions() {
  const { data } = await apiClient.get('/api/policies/file-upload/extensions');

  return data;
}

export async function putFileUploadExtensions({ blockedExtensions }) {
  const { data } = await apiClient.put('/api/policies/file-upload/extensions', {
    blocked_extensions: blockedExtensions,
  });

  return data;
}
