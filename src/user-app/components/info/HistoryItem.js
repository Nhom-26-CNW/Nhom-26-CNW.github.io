import React, {Component} from "react";
import ReactStars from "react-rating-stars-component";
import {Button, Modal} from 'reactstrap';
import './HistoryItem.css'
import BookingService from "../../../services/booking.service";
import Spinner from "../shared/Spinner";
import Loader from "../shared/Loader";

const BOOKING_STATUS = {
  NEW: 1,
  CONFIRMED: 2,
  DONE: 3,
  CANCELED: 4
}

/** TODO:
 * - confirm khi huy
 * - phan trang
 * - feedback
 */

export class HistoryItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status: this.props.item.status || 0,
      reviewContent: this.props.item.review ? this.props.item.review.content : "",
      rating: this.props.item.review ? this.props.item.review.rating : 0,
      showFeedbackBox: false,
    }

    this.onRatingChanged = this.onRatingChanged.bind(this);
    this.onFeedbackChange = this.onFeedbackChange.bind(this);
    this.onCancelBooking = this.onCancelBooking.bind(this);
    this.onSaveReview = this.onSaveReview.bind(this);
    this.onBookAgain = this.onBookAgain.bind(this);
  }

  onRatingChanged(newRating) {
    this.setState({
      rating: newRating,
      showFeedbackBox: true
    })
  }

  onFeedbackChange(e) {
    this.setState({
      reviewContent: e.target.value
    })
  }

  onCancelBooking(e) {
    this.setState({
      loadingCancelBtn: true,
    });

    BookingService.cancelBooking(this.props.item.id)
      .then((res) => {
        this.setState({
          loadingCancelBtn: false,
          status: BOOKING_STATUS.CANCELED
        });
      })
      .catch(error => {
          this.setState({
            loadingCancelBtn: false,
          });
        }
      );
  }

  onSaveReview(e) {
    this.setState({
      loadingReviewSaveBtn: true,
    });

    let promise = null;

    if (this.props.item.review == null) {
      promise = BookingService.postReview(this.props.item.id, this.state.rating, this.state.reviewContent)
    } else {
      promise = BookingService.updateReview(this.props.item.review.id, this.state.rating, this.state.reviewContent)
    }

    promise
      .then((res) => {
        this.setState({
          loadingReviewSaveBtn: false,
          showFeedbackBox: false
        });
      })
      .catch(error => {
        this.setState({
          loadingReviewSaveBtn: false,
        });
      });
  }


  onBookAgain(e) {
    let item = this.props.item;
    let newLocation = `/?name=${item.name}&phone=${item.phone_number}&address=${item.address}`;
    item.services.forEach((service) => {
      newLocation += `&services=${service.id}`;
    });
    newLocation += '#book';
    window.location.replace(newLocation);
  }

  render() {
    let item = this.props.item;
    let hasReviewContent = this.state.reviewContent !== "";

    let buttonsArea = {};
    buttonsArea[BOOKING_STATUS.NEW] = (
      <div>
        <div className="col-md-3">
        </div>
        <div className="col-md-3">
          {this.state.loadingCancelBtn ? (
            <button className="btn btn-default" type="button" disabled>
              <Loader/>
            </button>
          ) : (
            <button className="btn btn-default" type="button"
                    onClick={this.onCancelBooking}>
              Hủy
            </button>
          )}
        </div>
      </div>
    );

    buttonsArea[BOOKING_STATUS.CONFIRMED] = null;
    buttonsArea[BOOKING_STATUS.DONE] = (
      <div>
        <div className="col-md-3">
        </div>
        <div className="col-md-3">
          <button className="btn btn-default btn-active"
                  onClick={this.onBookAgain} type="button">
            Đặt lại
          </button>
        </div>
      </div>
    )

    buttonsArea[BOOKING_STATUS.CANCELED] = (
      <div>
        <div className="col-md-3">
          <button disabled className="btn btn-default" type="button">
            Đã hủy
          </button>
        </div>
        <div className="col-md-3">
          <button className="btn btn-default btn-active"
                  onClick={this.onBookAgain} type="button">
            Đặt lại
          </button>
        </div>
      </div>
    )

    let badge = {};
    badge[BOOKING_STATUS.DONE] = (
      <span className="label label-primary">Hoàn thành</span>);
    badge[BOOKING_STATUS.CONFIRMED] = (
      <span className="label label-success">Xác nhận</span>);
    badge[BOOKING_STATUS.CANCELED] = (
      <span className="label label-default">Hủy</span>);
    badge[BOOKING_STATUS.NEW] = (<span className="label label-info">Mới</span>);


    const datetimeOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'}
    const timeOptions = {hour: '2-digit', minute: '2-digit'}
    const currencyOptions = {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }

    return (
      <div className="history-item">
        <div className="row">
          <div className="col-sm-8">
            <div className="history-item-title">
              {badge[this.state.status]}
              <h4>Đơn đặt #{item.id}</h4>
            </div>

            <p className="p-no-space">
              <small>Đã đặt
                vào {new Date(item.created_at).toLocaleString('vi-vn', datetimeOptions)}</small><br/>
              <small>Hoàn thành
                vào {new Date(item.from).toLocaleDateString('vi-vn', dateOptions)},&nbsp;
                {new Date(item.from).toLocaleTimeString('vi-vn', timeOptions)}&nbsp;-&nbsp;
                {new Date(item.to).toLocaleTimeString('vi-vn', timeOptions)} </small>
            </p>
            <p className="p-no-space">
              <small><strong>{item.name}</strong></small>
              <br/><small>{item.phone_number}</small>
              <br/><small>{item.address}</small>
            </p>
          </div>
          <div className="col-sm-4">
            <p className="total-amount"
               style={{
                 textAlign: 'right',
                 fontSize: '24px'
               }}>{parseInt(item.amount).toLocaleString('vi-vn', currencyOptions)}</p>
          </div>
        </div>
        <div className="row item-content">
          <div className="col-md-12">
            <p/>
            <div className="table-responsive">
              <table className="table">
                <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Đơn giá</th>
                </tr>
                </thead>
                <tbody>
                {item.services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{parseInt(service.cost).toLocaleString('vi-vn', currencyOptions)}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {(this.state.status === BOOKING_STATUS.DONE) &&
            <div>
              Đánh giá dịch vụ
              <ReactStars
                count={5}
                value={this.state.rating}
                onChange={this.onRatingChanged}
                size={24}
                activeColor="#ffd700"
              />
            </div>
            }

          </div>
          {
            buttonsArea[this.state.status]
          }
        </div>
        {
          this.state.showFeedbackBox ? (
            <div className="row">
              <div className="feedback">
                <div className="col-md-12">
                  <textarea className="comment" rows="5"
                            placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn"
                            value={this.state.reviewContent}
                            onChange={this.onFeedbackChange}
                  >
                  </textarea>
                  {this.state.loadingReviewSaveBtn ? (
                    <button className="btn btn-default btn-active"
                            type="button"
                            disabled
                    >
                      <Loader/>
                    </button>
                  ) : (
                    <button className="btn btn-default btn-active"
                            type="button"
                            onClick={this.onSaveReview}
                    >Gửi
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (hasReviewContent && (
            <div className="row">
              <div className="feedback">
                <div className="col-md-12">
                  <p>{this.state.reviewContent}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
