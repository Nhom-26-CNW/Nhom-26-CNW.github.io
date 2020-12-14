import React, {useEffect, useState} from 'react';
import {Route, useLocation} from 'react-router';
import {Layout} from './components/Layout';
import Home from './components/home/Home';
import {Login} from './components/login/Login';
import {Signup} from './components/login/Signup';

import {AuthContext, PrivateRoute} from '../auth/Auth';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

import './css/animate.css';
import './css/hover-min.css';
import './css/datepicker.css';
import './css/owl.carousel.min.css';
import './css/owl.theme.default.min.css';
import './css/jquery-ui.min.css';
import './css/bootstrap.min.css';
import './css/bootsnav.css';
import './css/style.css';
import './css/responsive.css';
import {Info} from "./components/info/Info";
import {AnimatedSwitch} from "react-router-transition";

/**
 * TODO:
 * - bam
 */

const App = () => {
  const location = useLocation();

  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (location.hash) {

      // const yOffset = -70;
      const yOffset = 0;
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
        return;
      }
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location,]);

  useEffect(() => {
    console.log("Meing");
    UserService.getMe()
      .then(res => {
        setMe(res.data);
      })
      .catch(err => {
        setMe(null);
        AuthService.logout();
      });
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser, me, setMe}}>
      <Layout>
        <AnimatedSwitch
          atEnter={{opacity: 0}}
          atLeave={{opacity: 0}}
          atActive={{opacity: 1}}
        >
          <Route exact path='/' component={Home}/>
          <Route exact path='/login' render={(props) => (
            <Login {...props} setUser={setUser}/>
          )}
          />
          <Route exact path='/signup' component={Signup}/>
          <PrivateRoute path='/info'>
            <Info/>
          </PrivateRoute>
        </AnimatedSwitch>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
