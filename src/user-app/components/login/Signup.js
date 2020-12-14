import React, {Component} from "react";

import AuthService from "../../../services/auth.service";
import './Signup.css';
import {Link, Redirect} from "react-router-dom";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import {email, minLength, phone, required} from '../shared/Validation';


export class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
      loading: false,
      hasError: false,
      message: ""
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangePhone(e) {
    this.setState({
      phone: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }


  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSignUp(e) {
    e.preventDefault();

    this.setState({
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.signup(
        this.state.name,
        this.state.phone,
        this.state.email,
        this.state.address,
        this.state.password
      ).then((res) => {
        console.log(res);
        this.props.history.push("/login");
      })
        .catch(error => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            this.setState({
              loading: false,
              hasError: true,
              message: resMessage
            });
          }
        );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    let user = AuthService.getCurrentUser();
    if (user) {
      return <Redirect to="/info"/>;
    }

    return (
      <div className="signup-clean">
        <Form onSubmit={e => this.handleSignUp(e)} ref={c => {
          this.form = c
        }}>
          <h2 className="sr-only">Login Form</h2>
          <div className="illustration">
            <h1>Tạo tài khoản</h1>
          </div>
          {this.state.hasError &&
          <div className="alert alert-danger" role="alert">
            Có lỗi xảy ra. Hãy thử lại sau!<br/>
            {this.state.message}
          </div>
          }

          <div className="form-group">
            <Input type="text"
                   className="form-control"
                   onChange={this.onChangeName}
                   placeholder="Họ tên"
                   validations={[required]}
            />
          </div>
          <div className="form-group">
            <Input className="form-control"
                   type="tel"
                   onChange={this.onChangePhone}
                   placeholder="Số điện thoại"
                   autoComplete="on"
                   inputMode="tel"
                   validations={[required, phone]}
            />
          </div>
          <div className="form-group">
            <Input className="form-control"
                   type="email"
                   onChange={this.onChangeEmail}
                   placeholder="Email"
                   inputMode="email"
                   autoComplete="on"
                   validations={[required, email]}
            />
          </div>
          <div className="form-group">
            <Input className="form-control"
                   type="text"
                   onChange={this.onChangeAddress}
                   placeholder="Địa chỉ"
                   autoComplete="on"
                   validations={[required]}
            />
          </div>
          <div className="form-group">
            <Input className="form-control"
                   type="password"
                   onChange={this.onChangePassword}
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
                <button className="btn btn-primary btn-block"
                        type="submit">Đăng ký
                </button>
              )
            }
          </div>
          <Link className="forgot" to="/login">Đã có tài khoản? Đăng
            nhập</Link>
          <CheckButton style={{display: 'none'}} ref={c => {
            this.checkBtn = c
          }}/>
        </Form>
      </div>
    );
  }
}
