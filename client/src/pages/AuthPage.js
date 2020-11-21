import React from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [form, setForm] = useState({ // form - начальная переменная, setForm - функция, обрабатывающая form
    email: '',
    password: ''
  });

  useEffect(() => {
    console.log('error: ' + error)
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form});
      message(data.message)
    } catch(e) {

    }
  }

  // авторизация
  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form});
      auth.login(data.token, data.userId)
      message(data.message)
    } catch(e) {

    }
  }
 
  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className="default-title">Сократи ссылку!</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div>
              <div className="input-field">
                <input placeholder="Введите email" id="email" type="text" name="email" onChange={changeHandler}
                  value={form.email}/>
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input placeholder="Введите пароль" id="password" type="text" name="password" onChange={changeHandler}
                  value={form.password}/>
                <label htmlFor="password">Пароль</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button className="btn yellow darken-4" 
            onClick={loginHandler} 
            disabled={loading}>Войти</button>
            <button className="btn grey lighten-1 black-text"
            onClick={registerHandler}
            disabled={loading}>Регистрация</button>
          </div>
      </div>
      </div>
    </div>
  )
}