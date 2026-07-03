import { apiClient } from './client.js';

export async function getDropdownSelectOptions(params = {}) {
  const { data } = await apiClient.get('/api/company-settings/dropdowns/select', {
    params,
  });

  return data;
}

export async function getDropdownOptions({ kind, q = '' }) {
  const { data } = await apiClient.get(`/api/company-settings/dropdowns/${kind}`, {
    params: { q },
  });

  return data;
}

export async function createDropdownOption({ kind, option }) {
  const { data } = await apiClient.post(`/api/company-settings/dropdowns/${kind}`, option);

  return data;
}

export async function patchDropdownOrder({ kind, ids }) {
  const { data } = await apiClient.patch(`/api/company-settings/dropdowns/${kind}/order`, {
    ids,
  });

  return data;
}

export async function patchDropdownOption({ kind, optionId, option }) {
  const { data } = await apiClient.patch(
    `/api/company-settings/dropdowns/${kind}/${optionId}`,
    option
  );

  return data;
}

export async function deleteDropdownOption({ kind, optionId }) {
  const { data } = await apiClient.delete(`/api/company-settings/dropdowns/${kind}/${optionId}`);

  return data;
}
