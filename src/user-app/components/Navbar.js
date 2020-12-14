import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../../services/auth.service';
import Button from './shared/Button';
import {AuthContext} from '../../auth/Auth';

const USER_ROLES = {
  USER: 1,
  ADMIN: 2,
}

class Navbar extends Component {

  handleLogOut(e) {
    AuthService.logout();
    this.context.setUser(null);
    window.location.replace('/');
  }

  render() {
    let auth = this.context;
    let user = auth.user;
    return (
      <header className="sticky-dark-bg">
        <div className="header-area">
          <div className="container">
            <div className="row">
              <div className="col-sm-2">
                <div className="logo">
                  <Link to="/"> House<span>Clean</span></Link>
                </div>
              </div>
              <div className="col-sm-10">
                <div className="main-menu">

                  <div className="navbar-header">
                    <button type="button" className="navbar-toggle"
                            data-toggle="collapse"
                            data-target=".navbar-collapse">
                      <i className="fa fa-bars"/></button>
                  </div>

                  <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">

                      {user ? (
                        <React.Fragment>
                          <li>
                            <Link className="button-link" to="/#book">
                              <Button>Đặt lịch</Button>
                            </Link>
                          </li>
                          <li>
                            <Link to="/info">Chào {user.username}</Link>
                          </li>
                          {(user.roles === USER_ROLES.ADMIN) && (
                            <li>
                              <Link to="/admin">Quản lý</Link>
                            </li>
                          )}
                          <li>
                            <Link to="/" onClick={e => this.handleLogOut(e)}>
                              Đăng xuất
                            </Link>
                          </li>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <li>
                            <Link to="/">Giới thiệu</Link>
                          </li>
                          <li>
                            <Link to="/#promotion">Khuyến mãi</Link>
                          </li>
                          <li>
                            <Link to="/#services">Dịch vụ </Link>
                          </li>
                          <li>
                            <Link className="button-link" to="/#book">
                              <Button>Đặt lịch</Button>
                            </Link>
                          </li>
                          <li>
                            <Link to="/login">Đăng nhập</Link>
                          </li>
                          <li>
                            <Link to="/signup">Đăng ký</Link>
                          </li>
                        </React.Fragment>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="home-border"/>
          </div>
        </div>
      </header>
    );
  }
}

Navbar.contextType = AuthContext;

export {Navbar};
