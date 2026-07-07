import {
  mockGetDownloadSettings,
  mockGetTemplateSettings,
  mockPatchDownloadSettings,
  mockPatchTemplateSettings,
} from '../../mockData.js';

export async function getTemplateSettings() {
  return mockGetTemplateSettings();
}

export async function patchTemplateSettings(template) {
  return mockPatchTemplateSettings(template);
}

export async function getDownloadSettings() {
  return mockGetDownloadSettings();
}

export async function patchDownloadSettings(settings) {
  return mockPatchDownloadSettings(settings);
}
