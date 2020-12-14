import React, {Component} from 'react';
import Button from '../shared/Button';
import {isAfterToday, phone, required} from '../shared/Validation';
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";
import BookingService from "../../../services/booking.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {Tick} from 'react-crude-animated-tick';
import Spinner from "../shared/Spinner";


export class BookingBox extends Component {
  constructor(props) {
    super(props);

    this.onBookSubmit = this.onBookSubmit.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeFromTime = this.onChangeFromTime.bind(this);
    this.onChangeToTime = this.onChangeToTime.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeServices = this.onChangeServices.bind(this);

    this.validateCheckBox = this.validateCheckBox.bind(this);
    this.afterNow = this.afterNow.bind(this);
    this.afterFromHour = this.afterFromHour.bind(this);

    let urlSearch = new URLSearchParams(this.props.location.search);

    let chosenServices = urlSearch
      .getAll("services")
      .map(idString => parseInt(idString));

    this.state = {
      isLoading: false,
      hasError: false,
      isSuccessful: null,
      failMessage: null,
      showServiceError: false,
      chosenServices: chosenServices,
      name: urlSearch.get("name"),
      address: urlSearch.get("address"),
      from: null,
      to: null,
      date: null,
      phone: urlSearch.get("phone"),
      order_id: null
    }
  }

  componentDidMount() {
    if (AuthService.getCurrentUser() != null) {
      UserService.getMe()
        .then(res => {
          this.setState({
            name: this.state.name || res.data.name || null,
            address: this.state.address || res.data.address || null,
            phone: this.state.phone || res.data.phone_number || null
          });
        })
        .catch(() => {
        })
    }
  }

  validateCheckBox() {
    let ok = this.state.chosenServices.length !== 0;
    this.setState({
      showServiceError: !ok
    })
    return ok;
  }

  afterNow() {
    if (this.state.from) {
      let now = new Date();
      let anHourFromNow = new Date(now + 3600);
      let inputTime = new Date(this.state.date + " " + this.state.from);

      if (inputTime < anHourFromNow)
        return <small className="form-text text-danger"> Giờ không hợp lệ. Vui
          lòng đặt lịch trước ít nhất 1 tiếng.</small>;
    }
  }

  afterFromHour() {
    if (this.state.from && this.state.to) {
      let fromTime = new Date(this.state.date + " " + this.state.from);
      let oneHourFromFromTime = new Date(fromTime + 3600);
      let toTime = new Date(this.state.date + " " + this.state.to);

      if (toTime <= oneHourFromFromTime)
        return <small className="form-text text-danger"> Giờ không hợp lệ. Thời
          gian dọn dẹp ít nhât là 1 tiếng.</small>;
    }
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

  onChangeFromTime(e) {
    this.setState({
      from: e.target.value
    });
  }

  onChangeToTime(e) {
    this.setState({
      to: e.target.value
    });
  }

  onChangeDate(e) {
    this.setState({
      date: e.target.value
    });
  }

  onChangeServices(value) {
    if (this.state.chosenServices.indexOf(value) === -1) {
      this.setState({
        chosenServices: [...this.state.chosenServices, value]
      });
    } else {
      this.setState({
        chosenServices: this.state.chosenServices.filter(
          val => val !== value
        )
      });
    }
  }

  onBookSubmit(e) {
    e.preventDefault();
    this.setState({
      loading: true
    });

    this.form.validateAll();
    if (!this.validateCheckBox())
      return;

    if (this.checkBtn.context._errors.length === 0) {
      let from = this.state.date + " " + this.state.from + ":00";
      let to = this.state.date + " " + this.state.to + ":00";

      this.setState({
        isLoading: true
      })

      BookingService.book(
        this.state.name,
        this.state.address,
        this.state.phone,
        from,
        to,
        this.state.chosenServices
      )
        .then((res) => {
            console.log(res);
            if (res.status === 201) {
              this.setState({
                isSuccessful: true,
                isLoading: false,
                order_id: res.data.data.id
              })
            } else {
              let resMessage = "";
              for (const [key, value] of Object.entries(res.data)) {
                resMessage += `${key}: ${value}\n`;
              }

              this.setState({
                loading: false,
                hasError: true,
                message: resMessage
              });
            }
          },
          error => {
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
    let chosenServices = this.state.chosenServices;
    let renderedServices = this.props.services.map(
      (service) => {
        return (
          <div className="row form-row book-service-item" key={service.id}>
            <Input type="checkbox"
                   className="regular-checkbox"
                   value={service.id}
                   checked={chosenServices.indexOf(service.id) !== -1}
                   id={"service-" + service.id}
                   onChange={() => this.onChangeServices(service.id)}
            />
            <label htmlFor={"service-" + service.id}>
              {service.name}
            </label>
          </div>)
      });

    return (
      <section className="travel-box">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="single-book-box" id="book">
                <div className="tab-para">
                  <div className="row">
                    <h2>Đặt lịch</h2>
                  </div>
                  <div className="row booking-box">

                    {this.state.isLoading && (
                      <div className="overlay">
                        <Spinner/>
                      </div>
                    )}

                    {this.state.isSuccessful && (
                      <div className="overlay">
                        <div>
                          <Tick size={200}/>
                        </div>
                        <div className="success-message">
                          <h4>Đặt lịch thành công (Đơn
                            #{this.state.order_id})</h4>
                          <p>Bạn sẽ sớm nhận được cuộc gọi xác nhận của
                            HouseClean.</p>
                        </div>
                      </div>
                    )}

                    <div
                      className={(this.state.isLoading || this.state.isSuccessful) && "blurred"}>
                      <Form onSubmit={e => this.onBookSubmit(e)} ref={c => {
                        this.form = c
                      }}>
                        <div className="row">
                          <div className="row form-row p-0">
                            <div className="col-sm-3 px-0">
                              {renderedServices}
                              {this.state.showServiceError && (
                                <small className="form-text text-danger">
                                  Bạn chưa chọn dịch vụ nào
                                </small>)
                              }
                            </div>
                            <div className="col-sm-9 col-12 px-0">
                              <div className="row form-row">
                                <div className="col-12">
                                  <Input
                                    className="form-control form-control-lg"
                                    placeholder="Tên người đặt"
                                    type="text"
                                    onChange={this.onChangeName}
                                    value={this.state.name}
                                    validations={[required]}
                                  />
                                </div>
                              </div>
                              <div className="row form-row">
                                <div className="col-12">
                                  <Input
                                    className="form-control form-control-lg"
                                    placeholder="Địa chỉ"
                                    type="text"
                                    value={this.state.address}
                                    onChange={this.onChangeAddress}
                                    validations={[required]}
                                  />
                                </div>
                              </div>
                              <div className="row form-row">
                                <div className="col-12">
                                  <Input placeholder="Số điện thoại"
                                         className="form-control form-control-lg"
                                         type="tel"
                                         value={this.state.phone}
                                         onChange={this.onChangePhone}
                                         validations={[required, phone]}
                                  />
                                </div>
                              </div>
                              <div className="row form-row">
                                <div className="col-12">
                                  <Input
                                    className="form-control form-control-lg"
                                    type="date"
                                    onChange={this.onChangeDate}
                                    validations={[required, isAfterToday]}
                                  />
                                </div>
                              </div>
                              <div className="row form-row">
                                <div className="col-sm-6 col-12 px-0">
                                  <Input type="time"
                                         className="form-control form-control-lg"
                                         onChange={this.onChangeFromTime}
                                         validations={[required, this.afterNow]}
                                         min="07:00"
                                         max="21:00"
                                  />
                                </div>
                                <div className="col-sm-6 col-12 px-0">
                                  <Input type="time"
                                         className="form-control form-control-lg"
                                         onChange={this.onChangeToTime}
                                         validations={[required, this.afterFromHour]}
                                         min="07:00"
                                         max="22:00"
                                  />
                                </div>
                              </div>
                            </div>
                            <CheckButton style={{display: 'none'}} ref={c => {
                              this.checkBtn = c
                            }}/>
                            <div className="row form-row">
                              <Button className="book-btn book-btn-form">
                                Đặt lịch
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
