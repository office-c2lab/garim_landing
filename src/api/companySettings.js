import { apiClient } from './client.js';

export async function getTemplateSettings() {
  const { data } = await apiClient.get('/api/company-settings/template');

  return data;
}

export async function patchTemplateSettings(template) {
  const formData = new FormData();

  formData.append('company_name', template.company_name ?? '');
  formData.append('company_description', template.company_description ?? '');
  formData.append('support_email', template.support_email ?? '');
  formData.append('support_phone', template.support_phone ?? '');

  if (template.logo_file) {
    formData.append('logo_file', template.logo_file);
  }

  const { data } = await apiClient.patch('/api/company-settings/template', formData);

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
