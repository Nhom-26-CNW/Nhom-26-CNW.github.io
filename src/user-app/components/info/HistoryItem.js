import React, {Component} from "react";
import ReactStars from "react-rating-stars-component";
import {Button, Modal} from 'reactstrap';
import './HistoryItem.css'
import BookingService from "../../../services/booking.service";

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
      status: this.props.item.status,
      review: this.props.item.review,
      showFeedbackBox: false,
      showCancelConfirmModal: false
    }

    this.onRatingChanged = this.onRatingChanged.bind(this);
    this.onCancelBooking = this.onCancelBooking.bind(this);
    this.onBookAgain = this.onBookAgain.bind(this);
  }

  onRatingChanged(newRating) {
    this.setState({
      rating: newRating,
      showFeedbackBox: true
    })
  }

  onCancelBooking(e) {
    this.setState({
      showCancelConfirmModal: true
    })
  }

  onDiscardCancelBooking(e) {
    this.setState({
      showCancelConfirmModal: false
    })  }

  onCancelBookingConfirm(e) {
    BookingService.cancelBooking(this.props.item.id)
      .then((res) => {
        this.setState({
          loading: false,
          status: BOOKING_STATUS.CANCELED
        });
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
    let hasRating = this.state.review;
    let hasReviewContent = hasRating && this.state.review.content;

    let buttonsArea = {};
    buttonsArea[BOOKING_STATUS.NEW] = (
      <div>
        <div className="col-md-3">
        </div>
        <div className="col-md-3">
          <button className="btn btn-default" type="button" onClick={this.onCancelBooking}>
            Hủy
          </button>
        </div>
      </div>
    );

    buttonsArea[BOOKING_STATUS.CONFIRMED] = null;
    buttonsArea[BOOKING_STATUS.DONE] = (
      <div>
        <div className="col-md-3">
        </div>
        <div className="col-md-3">
          <button className="btn btn-default btn-active" onClick={this.onBookAgain} type="button">
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
          <button className="btn btn-default btn-active" onClick={this.onBookAgain} type="button">
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
        <Modal show={this.state.showCancelConfirmModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
            <hr />

            <h4>Overflowing text to show scroll behavior</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onDiscardCancelBooking}>Close</Button>
          </Modal.Footer>
        </Modal>

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
                value={this.state.review.rating}
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
                            placeholder="Hãy cho chúng tôi biết suy nghĩ của bạn">
                    {this.state.review.content}
                  </textarea>
                  <button className="btn btn-default btn-active"
                          type="button">Gửi
                  </button>
                </div>
              </div>
            </div>
          ) : (hasReviewContent && (
            <div className="row">
              <div className="feedback">
                <div className="col-md-12">
                  <p>{this.state.review.content}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
