import React from "react";
import {Redirect, Route} from "react-router-dom";
import AuthService from '../services/auth.service';

function PrivateRoute({children, ...rest}) {
  let user = AuthService.getCurrentUser();
  return (
    <Route
      {...rest}
      render={({location}) => {
        if (user) {
          return children;
        } else {
          return <Redirect to={"/login?next=" + location.pathname + location.search}/>
        }
      }}
    />
  );
}

const AuthContext = React.createContext({
  user: null,
  setUser: null
});


export {PrivateRoute, AuthContext};
