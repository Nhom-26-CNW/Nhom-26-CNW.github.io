import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {Dashboard} from './components/Dashboard';
import {ManageBooking} from './components/ManageBooking';
import {ManageReview} from "./components/ManageReview";
import {ManageService} from "./components/ManageService";
import {ManageUser} from "./components/ManageUser";

// import './custom.css';

const SB_STYLESHEET = process.env.PUBLIC_URL + "admin/css/sb-admin-2.min.css";

export default class App extends Component {
  static displayName = App.name;

  componentDidMount() {
    const stylesheet = document.createElement("link");
    stylesheet.href = SB_STYLESHEET;
    stylesheet.rel = "stylesheet";

    document.head.appendChild(stylesheet);
  }

  componentWillUnmount() {
    let element = document.querySelector(`link[rel=stylesheet][href="${SB_STYLESHEET}"]`);
    element.parentNode.removeChild(element);
  }

  render() {
    return (
      <Layout>
        <Route exact path='/admin' component={Dashboard}/>
        <Route exact path='/admin/manage-booking' component={ManageBooking}/>
        <Route exact path='/admin/manage-user' component={ManageUser} />
        <Route exact path='/admin/manage-service' component={ManageService} />
        <Route exact path='/admin/manage-review' component={ManageReview} />
      </Layout>
    );
  }
}
