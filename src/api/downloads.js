import { mockDownloadWindowsSetupZip } from '../../mockData.js';

export const WINDOWS_SETUP_ZIP_FILENAME = 'garim-windows-setup.zip';

export async function downloadWindowsSetupZip() {
  return mockDownloadWindowsSetupZip();
}
