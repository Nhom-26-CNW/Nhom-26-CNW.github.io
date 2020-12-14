import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import UserService from "../../../services/user.service";
import {minLength, required} from '../shared/Validation';
import './ChangePassword.css';


class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChangeOldPassword = this.onChangeOldPassword.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.passwordMatch = this.passwordMatch.bind(this);

    this.state = {
      oldPassword: "",
      password: "",
      confirmPassword: "",
      loading: false,
      hasError: false,
      message: ""
    };
  }

  passwordMatch = (value) => {
    if (value !== this.state.password) {
      return <small className="form-text text-danger">
        Mật khẩu không khớp
      </small>;
    }
  }

  onChangeOldPassword(e) {
    this.setState({
      oldPassword: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value
    });
  }

  onFormSubmit(e) {
    e.preventDefault();

    this.setState({
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      UserService.updatePassword(this.state.oldPassword, this.state.password)
        .then((res) => {
          if (res.data.success) {
            this.setState({
              loading: false,
              hasError: false,
              message: "Cập nhật mật khẩu thành công!"
            });
          } else {
            this.setState({
              loading: false,
              hasError: true,
              message: JSON.stringify(res.data)
            });
          }
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
              message: "Có lỗi xảy ra! " + resMessage
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
    return (
      <div>
        <div className="intro">
          <h2 className="text-left">Đổi mật khẩu</h2>
        </div>
        {this.state.message &&
        <div className="form-group">
          <div className={"alert " + (this.state.hasError ? "alert-danger" : "alert-success")}
               role="alert">
            {this.state.message}
          </div>
        </div>
        }
        <div>
          <Form onSubmit={e => this.onFormSubmit(e)} ref={c => {
            this.form = c
          }}>
            <div className="row profile-row">
              <div className="col-md-12">
                <div className="row">
                  <div className="form-group">
                    <label className="control-label">Mật khẩu cũ</label>
                    <Input type="password"
                           className="form-control"
                           placeholder="Mật khẩu cũ"
                           onChange={this.onChangeOldPassword}
                           validations={[required]}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group">
                    <label className="control-label">Mật khẩu mới</label>
                    <Input type="password"
                           className="form-control"
                           placeholder="Mật khẩu mới"
                           onChange={this.onChangePassword}
                           validations={[required, minLength]}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group">
                    <label className="control-label">Xác nhận mật khẩu</label>
                    <Input type="password"
                           className="form-control"
                           placeholder="Xác nhận mật khẩu"
                           onChange={this.onChangeConfirmPassword}
                           validations={[this.passwordMatch]}
                    />
                  </div>
                </div>
                <hr/>
                <div className="row">
                  <div className="col-md-12 content-right">
                    {
                      this.state.loading ? (
                        <button className="btn btn-primary btn-block"
                                type="button" disabled>
                          <div className="loader" id="loader-4">
                            <span/>
                            <span/>
                            <span/>
                          </div>
                        </button>
                      ) : (<button className="btn btn-default btn-active"
                                   type="submit">Lưu</button>)
                    }
                  </div>
                </div>
              </div>
            </div>
            <CheckButton style={{display: 'none'}} ref={c => {
              this.checkBtn = c
            }}/>
          </Form>
        </div>
      </div>
    );
  }
}

export {ChangePassword};
