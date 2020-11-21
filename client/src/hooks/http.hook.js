import {useState, useCallback} from 'react';

export const useHttp = () => { // useHttp - пользовательский хук
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true);
      try {
        if (body) {
          body = JSON.stringify(body); // преобразование в json
          headers['Content-Type'] = 'application/json';
        }
        const response = await fetch(url, {method, body, headers});
        const data = await response.json(); // приведение инфы к формату json

        if (!response.ok) {
          throw new Error(data.message || 'something gone wrong')
        }

        setLoading(false);
        return data; // если запрос прошел успешно, возврат данных
      } catch(e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    }, []) // 2 параметр - массив зависимостей метода

  const clearError = useCallback( () => {
    setError(null);
  }, []);

  return {loading, request, error, clearError};
}