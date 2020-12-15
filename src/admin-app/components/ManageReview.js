import React, {Component} from 'react';
import authHeader from '../../services/auth-header';
import axios from 'axios';
import Spinner from "../../user-app/components/shared/Spinner";

export class ManageReview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      reviews: []
    }
  }

  componentDidMount() {
    this.setDataTableDemoDestroy();
    this.getBookings();
  }

  getBookings = () => {
    const config = {
      method: 'GET',
      url: 'https://cleaning-service-hust.herokuapp.com/api/reviews',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        let reviews = response.data.data;
        this.setState({reviews: reviews, loading: false});
        this.setDataTableDemo();
      })
      .catch(error => {
        console.log(error);
      });
  }

  setDataTableDemo = () => {
    let script = document.createElement("script");
    script.src = "admin/js/demo/datatables-demo.js";
    script.async = true;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  setDataTableDemoDestroy = () => {
    let script = document.createElement("script");
    script.src = "admin/js/demo/datatables-demo-destroy.js";
    script.async = true;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Đánh giá</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {this.state.loading ? (
                <Spinner/>
              ) : (
                <table className="table table-bordered" id="dataTable"
                       width="100%" cellSpacing={0}>
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ngày tạo</th>
                    <th>Ngày sửa</th>
                    <th>Đơn đặt</th>
                    <th>Nội dung</th>
                    <th>Đánh giá</th>
                  </tr>
                  </thead>
                  <tfoot>
                  <tr>
                    <th>ID</th>
                    <th>Ngày tạo</th>
                    <th>Ngày sửa</th>
                    <th>Đơn đặt</th>
                    <th>Nội dung</th>
                    <th>Đánh giá</th>
                  </tr>
                  </tfoot>
                  <tbody>
                  {this.state.reviews.map(review =>
                    <tr key={review.id}>
                      <td>{review.id}</td>
                      <td>{new Date(review.created_at).toLocaleString('vi-vn')}</td>
                      <td>{new Date(review.updated_at).toLocaleString('vi-vn')}</td>
                      <td>{review.booking_id}</td>
                      <td>{review.content}</td>
                      <td>{review.rating}/5</td>
                    </tr>
                  )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
