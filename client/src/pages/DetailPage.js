import React from 'react';
import { useContext } from 'react';
import { useCallback } from 'react';
import { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'; // загрузить данные, взять id
import {AuthContext} from '../context/AuthContext';
import { Loader } from '../components/Loader';
import {useHttp} from '../hooks/http.hook';
import {LinkCard} from '../components/LinkCard';

export const DetailPage = () => {
  const {token} = useContext(AuthContext); // получение токена
  const {request, loading} = useHttp();
  const [link, setLink] = useState(null);
  const linkId = useParams().id // ключ id берется из роута 

  const getLink = useCallback(async () => {
    try {
      const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      }) // ссылка
      setLink(fetched); // формирование ссылки
    } catch(e) {

    }
  }, [token, linkId, request]);

  useEffect(() => { // определение готовности компонента
    getLink() // формирование ссылки
  }, [getLink]);

  if (loading) { // пока грузятся данные, отображается лоадер
    return <Loader/>
  }

  return (
    <>
      { !loading && link && <LinkCard link={link}/>}     
    </>
  )
}