import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {Link, Redirect} from "react-router-dom";
import AuthService from "../../../services/auth.service";
import {email, minLength, required} from '../shared/Validation';

import "./Login.css";
import {AuthContext} from "../../../auth/Auth";


class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  onChangeEmail(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password)
        .then(res => {
          this.context.setUser(res);
          let urlSearch = new URLSearchParams(this.props.location.search);
          this.props.history.push(urlSearch.get("next") || "/info");
        })
        .catch(error => {
            console.log(error);
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            this.setState({
              loading: false,
              message: resMessage
            });
          }
        );
    }
  }

  render() {
    let user = this.context.user;

    return user ? (<Redirect to="/info"/>) : (
      <div className="login-clean">
        {this.state.message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {this.state.message}
            </div>
          </div>
        )}
        <Form onSubmit={e => this.handleLogin(e)} ref={c => {
          this.form = c
        }}>
          <h2 className="sr-only">Đăng nhập</h2>
          <div className="illustration">
            <i className="fa fa-home" aria-hidden="true"/>
          </div>
          <div className="form-group">
            <Input
              onChange={this.onChangeEmail}
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              validations={[required, email]}
            />
          </div>
          <div className="form-group">
            <Input
              onChange={this.onChangePassword}
              className="form-control"
              type="password"
              name="password"
              placeholder="Mật khẩu"
              validations={[required, minLength]}
            />
          </div>
          <div className="form-group">
            {
              this.state.loading ? (
                <button className="btn btn-primary btn-block" type="button"
                        disabled>
                  <div className="loader" id="loader-4">
                    <span/>
                    <span/>
                    <span/>
                  </div>
                </button>
              ) : (
                <button className="btn btn-primary btn-block" type="submit">Đăng
                  nhập</button>
              )
            }
          </div>
          <Link className="forgot" to="/signup">Chưa có tài khoản? Đăng
            ký</Link>
          <CheckButton style={{display: 'none'}} ref={c => {
            this.checkBtn = c
          }}/>
        </Form>
      </div>
    );
  }
}

Login.contextType = AuthContext;

export {Login};
