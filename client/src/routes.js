import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {LinksPage} from './pages/LinksPage';
import {DetailPage} from './pages/DetailPage';
import {AuthPage} from './pages/AuthPage';
import {CreatePage} from './pages/CreatePage';
// react-router-dom - библиотека для работы с маршрутизацией
// Route - элемент для вывода роута
// Switch - исключающая маршрутизация
export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/links" exact>
          <LinksPage/>
        </Route>
        <Route path="/create" exact>
          <CreatePage/>
        </Route>
        <Route path="/detail/:id">
          <DetailPage/>
        </Route>
        <Redirect to="/create"/>
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage/>
      </Route>
      <Redirect to="/"/>
    </Switch>
  )
}