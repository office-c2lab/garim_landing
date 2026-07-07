import { useMutation } from '@tanstack/react-query';
import { downloadWindowsSetupZip } from '../api/downloads.js';

export function useWindowsSetupDownloadMutation() {
  return useMutation({
    mutationFn: downloadWindowsSetupZip,
  });
}
