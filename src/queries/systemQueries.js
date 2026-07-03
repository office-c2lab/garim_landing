import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSystemIpaddr, getSystemResourceStreamUrl } from '../api/system.js';

export const systemQueryKeys = {
  all: ['system'],
  ipaddr: () => [...systemQueryKeys.all, 'ipaddr'],
};

export function useSystemIpaddrQuery() {
  return useQuery({
    queryKey: systemQueryKeys.ipaddr(),
    queryFn: getSystemIpaddr,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSystemResourceStream() {
  const isEventSourceSupported = typeof EventSource !== 'undefined';
  const [resource, setResource] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(() =>
    isEventSourceSupported ? null : new Error('EventSource is not supported.')
  );

  useEffect(() => {
    if (!isEventSourceSupported) return undefined;

    const eventSource = new EventSource(getSystemResourceStreamUrl());

    const handleResourceMessage = event => {
      try {
        setResource(JSON.parse(event.data));
        setError(null);
      } catch (parseError) {
        setError(parseError);
      }
    };

    eventSource.addEventListener('open', () => {
      setIsConnected(true);
      setError(null);
    });
    eventSource.addEventListener('resource', handleResourceMessage);
    eventSource.addEventListener('message', handleResourceMessage);
    eventSource.addEventListener('error', () => {
      setIsConnected(false);
      setError(new Error('System resource stream disconnected.'));
    });

    return () => {
      eventSource.close();
    };
  }, [isEventSourceSupported]);

  return { data: resource, error, isConnected };
}
