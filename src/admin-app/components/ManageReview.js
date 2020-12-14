import React, {Component} from 'react';
import authHeader from '../../services/auth-header';
import axios from 'axios';

export class ManageReview extends Component {

  constructor(props) {
    super(props);

    this.state = {reviews:[]}
  }

  componentDidMount() {
    this.setDataTableDemoDestroy();
    this.getBookings();
  }

  getBookings = () => {
    var config = {
      method: 'get',
      url: 'https://cleaning-service-hust.herokuapp.com/api/reviews',
      headers: authHeader()
    };

    axios(config)
    .then( response => {
      let reviews = response.data.data;
      this.setState({reviews:reviews});
      this.setDataTableDemo();
    })
    .catch( error => {
      console.log(error);
    });
  }

  setDataTableDemo = () => {
    let script = document.createElement("script");
    script.src = "js/demo/datatables-demo.js";
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
            <h6 className="m-0 font-weight-bold text-primary">Reviews</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Booking Id</th>
                    <th>Content</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                  <th>Id</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Booking Id</th>
                    <th>Content</th>
                    <th>Rating</th>
                  </tr>
                </tfoot>
                <tbody>
                  {this.state.reviews.map(review=>
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
