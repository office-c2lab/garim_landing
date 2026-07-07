import {
  mockCreateDropdownOption,
  mockDeleteDropdownOption,
  mockGetDropdownOptions,
  mockGetDropdownSelectOptions,
  mockPatchDropdownOption,
  mockPatchDropdownOrder,
} from '../../mockData.js';

export async function getDropdownSelectOptions(params = {}) {
  return mockGetDropdownSelectOptions(params);
}

export async function getDropdownOptions({ kind, q = '' }) {
  return mockGetDropdownOptions({ kind, q });
}

export async function createDropdownOption({ kind, option }) {
  return mockCreateDropdownOption({ kind, option });
}

export async function patchDropdownOrder({ kind, ids }) {
  return mockPatchDropdownOrder({ kind, ids });
}

export async function patchDropdownOption({ kind, optionId, option }) {
  return mockPatchDropdownOption({ kind, optionId, option });
}

export async function deleteDropdownOption({ kind, optionId }) {
  return mockDeleteDropdownOption({ kind, optionId });
}
