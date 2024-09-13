import { useEffect, useMemo, useState } from 'react';
import { api, apiErrorHandler } from '../helpers/api';
import { z, ZodTypeAny } from 'zod';
import { produce } from 'immer';
import { debounce } from 'lodash';

export default function usePluginStorage<S extends ZodTypeAny, T = z.infer<S>>(
  name: string,
  schema: S
) {
  const [loaded, setLoaded] = useState(false);
  const [storage, setStorage] = useState<T>(schema.parse({}));
  useEffect(() => {
    api()
      .post('/api/plugin/get-storage', { name })
      .then(({ data }) => {
        setStorage(schema.parse(data));
        setLoaded(true);
      })
      .catch(apiErrorHandler);
  }, [name, schema]);

  const saveStorage = useMemo(() => {
    const saveToServer = debounce(
      (data: T) => {
        api()
          .post('/api/plugin/set-storage', { name, storage: data })
          .catch(apiErrorHandler);
      },
      500,
      { leading: false }
    );
    return (data: T) => {
      setStorage(data);
      saveToServer(data);
    };
  }, [name]);

  const changeStorage = useMemo(() => {
    return (recipe: (draft: T) => void) => {
      saveStorage(produce(storage, recipe));
    };
  }, [saveStorage, storage]);

  const results = useMemo(() => {
    return { loaded, saveStorage, storage, changeStorage };
  }, [loaded, saveStorage, storage, changeStorage]);

  return results;
}
