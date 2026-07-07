import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSystemIpaddr, getSystemResource } from '../api/system.js';

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
  const [resource, setResource] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadResource = () => {
      getSystemResource()
        .then(data => {
          if (!isMounted) return;
          setResource(data);
          setIsConnected(true);
          setError(null);
        })
        .catch(resourceError => {
          if (!isMounted) return;
          setIsConnected(false);
          setError(resourceError);
        });
    };

    loadResource();
    const intervalId = window.setInterval(loadResource, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return { data: resource, error, isConnected };
}
