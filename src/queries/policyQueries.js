import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFileUploadExtensions,
  getPolicies,
  patchPolicyEnabled,
  putFileUploadExtensions,
} from '../api/policies.js';

export const policyQueryKeys = {
  all: ['policies'],
  list: () => [...policyQueryKeys.all, 'list'],
  fileUploadExtensions: () => [...policyQueryKeys.all, 'file-upload-extensions'],
};

export function usePoliciesQuery() {
  return useQuery({
    queryKey: policyQueryKeys.list(),
    queryFn: getPolicies,
  });
}

export function usePatchPolicyEnabledMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPolicyEnabled,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: policyQueryKeys.all }),
  });
}

export function useFileUploadExtensionsQuery(options = {}) {
  return useQuery({
    queryKey: policyQueryKeys.fileUploadExtensions(),
    queryFn: getFileUploadExtensions,
    ...options,
  });
}

export function usePutFileUploadExtensionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putFileUploadExtensions,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: policyQueryKeys.fileUploadExtensions() }),
  });
}
