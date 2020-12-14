import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './user-app/App';
import AppAdmin from './admin-app/App';
import registerServiceWorker from './registerServiceWorker';
import {Route, Switch} from "react-router";
import Page404 from "./user-app/components/404/Page404";
import {PrivateRoute} from "./auth/Auth";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <Switch>
      <PrivateRoute path='/admin'>
        <AppAdmin />
      </PrivateRoute>
      <Route path='/' component={App}/>
      <Route path='*' component={Page404}/>
    </Switch>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

