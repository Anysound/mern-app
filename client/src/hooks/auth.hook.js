import {useState, useCallback, useEffect} from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null); // переменной token устанавливается начальное значение null
  const [userId, setUserId] = useState(null); // переменной userId устанавливается начальное значение null
  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken); // обновляем token , token = jwtToken
    setUserId(id);

    localStorage.setItem(storageName, JSON.stringify({userId: id, token: jwtToken})) // устанавливается новое свойство локалсторедж: storageName: JSON.stringify({userId, token})
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId)
    }
    setReady(true);
  }, [login]);

  return {login, logout, token, userId, ready}
}