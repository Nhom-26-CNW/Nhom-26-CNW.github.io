import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import UserService from "../../../services/user.service";
import {phone, required} from '../shared/Validation';
import './Profile.css';
import {AuthContext} from "../../../auth/Auth";


class Profile extends Component {

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);

    this.state = {
      name: "",
      phone: "",
      email: "",
      address: "",
      loading: false,
      hasError: false,
      message: ""
    };
  }

  componentDidMount() {
    UserService.getMe()
      .then(res => {
        let data = res.data;
        this.context.setMe(data);

        this.setState({
          name: data.name || "",
          phone: data.phone_number || "",
          email: data.email || "",
          address: data.address || "",
        });
      });
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

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }

  onFormSubmit(e) {
    e.preventDefault();

    this.setState({
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      UserService.updateMe(
        this.state.name,
        this.state.address,
        this.state.phone
      ).then((res) => {
        if (res.data.data) {
          this.context.setMe(res.data);
          this.setState({
            loading: false,
            hasError: false,
            message: "Cập nhật thành công!"
          });
        } else {
          this.setState({
            loading: false,
            hasError: true,
            message: "Có lỗi xảy ra! " + JSON.stringify(res.data)
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
          <h2 className="text-left">Tài khoản của tôi</h2>
        </div>
        {this.state.message &&
        <div className="form-group">
          <div
            className={"alert " + (this.state.hasError ? "alert-danger" : "alert-success")}
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
                <div className="form-group">
                  <label className="control-label">Email</label>
                  <Input type="email"
                         className="form-control"
                         readonly="1"
                         value={this.state.email}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label className="control-label">Họ tên</label>
                      <Input type="text"
                             className="form-control"
                             onChange={this.onChangeName}
                             value={this.state.name}
                             validations={[required]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label className="control-label">Số điện thoại</label>
                      <Input type="tel"
                             className="form-control"
                             value={this.state.phone}
                             onChange={this.onChangePhone}
                             validations={[required, phone]}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label">Địa chỉ</label>
                  <Input type="text"
                         className="form-control"
                         autoComplete="on"
                         required
                         value={this.state.address}
                         onChange={this.onChangeAddress}
                         validations={[required]}
                  />
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

Profile.contextType = AuthContext;

export {Profile};
