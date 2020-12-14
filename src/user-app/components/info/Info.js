import React, {Component} from "react";
import {Redirect, Route, Switch} from 'react-router';

import {History} from "./History";
import {Profile} from "./Profile";
import {ChangePassword} from "./ChangePassword";
import './Info.css';
import {Link} from "react-router-dom";

export class Info extends Component {

  render() {
    return (
      <div className="bounding-box">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item"><span><Link to="/info/profile">Tài khoản của tôi</Link></span>
                </li>
                <li className="list-group-item"><span><Link to="/info/change-password">Đổi mật khẩu</Link></span>
                </li>
                <li className="list-group-item"><span><Link to="/info/history">Lịch sử dịch vụ</Link></span>
                </li>
              </ul>
            </div>
            <div className="col-md-8">
              <Switch>
                <Route exact path='/info/profile' component={Profile}/>
                <Route exact path='/info/change-password' component={ChangePassword}/>
                <Route exact path='/info/history' component={History}/>
                <Redirect to="/info/history"/>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
