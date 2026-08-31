import { useCallback, useEffect, useState } from 'react';

import {
  getHostNamesFromNerdStorage,
  saveHostNamesToNerdStorage,
} from '../utilities/nerdlet-storage';

const useNerdStorageHostnames = ({ key, type }) => {
  const [hostNames, setHostNames] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const result = await getHostNamesFromNerdStorage({ key, type });
        if (cancelled) return;
        setHostNames(result || []);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key, type]);

  const save = useCallback(
    async (next) => {
      if (!key) return;
      await saveHostNamesToNerdStorage({ key, type }, next);
    },
    [key, type]
  );

  return { hostNames, setHostNames, loaded, save };
};

export default useNerdStorageHostnames;
