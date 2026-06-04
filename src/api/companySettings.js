import { apiClient } from './client.js';

export async function getTemplateSettings() {
  const { data } = await apiClient.get('/api/company-settings/template');

  return data;
}

export async function patchTemplateSettings(template) {
  const { data } = await apiClient.patch('/api/company-settings/template', template);

  return data;
}

export async function getDownloadSettings() {
  const { data } = await apiClient.get('/api/company-settings/download');

  return data;
}

export async function patchDownloadSettings(settings) {
  const { data } = await apiClient.patch('/api/company-settings/download', settings);

  return data;
}
