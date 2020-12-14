import React, {Component} from 'react';
import authHeader from '../../services/auth-header';
import axios from 'axios';
import {Combobox} from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

export class ManageBooking extends Component {

  constructor(props) {
    super(props);

    this.state = {bookings: []}
  }

  componentDidMount() {
    this.setDataTableDemoDestroy();
    this.getBookings();
  }

  getBookings = () => {
    var config = {
      method: 'get',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/bookings',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        let bookings = response.data.data;
        for (let i = 0; i < bookings.length; i++) {
          let booking = bookings[i];
          if (booking.status === 1) {
            booking.status = 'new';
          } else if (booking.status === 2) {
            booking.status = 'confirmed';
          } else if (booking.status === 3) {
            booking.status = 'completed';
          } else if (booking.status === 4) {
            booking.status = 'canceled';
          }

          let strServices = '';
          booking.services.forEach(service => {
            strServices += service.name + ', ';
          });
          strServices = strServices.slice(0, -1);
          strServices = strServices.slice(0, -1);

          booking.services = strServices;
        }

        this.setState({bookings: bookings});

        this.setDataTableDemo();
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateBookingStatus = (value) => {
    let newStatus = 0;
    if (value.status === 'new') {
      newStatus = '1';
    } else if (value.status === 'confirmed') {
      newStatus = '2';
    } else if (value.status === 'completed') {
      newStatus = '3';
    } else if (value.status === 'canceled') {
      newStatus = '4';
    }

    var config = {
      method: 'patch',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/bookings/' + value.id,
      headers: authHeader(),
      data: {'status': newStatus}
    };

    axios(config)
      .then(response => {
        //refetch
        this.getBookings();
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
            <h6 className="m-0 font-weight-bold text-primary">Bookings</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" id="dataTable"
                     width="100%"
                     cellSpacing={0}>
                <thead>
                <tr>
                  <th>Id</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>User Id</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Name</th>
                  <th>Services</th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                  <th>Id</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>User Id</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>CurrentStatus</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Name</th>
                  <th>Services</th>
                </tr>
                </tfoot>
                <tbody>
                {this.state.bookings.map(booking =>
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{new Date(booking.created_at).toLocaleString('vi-vn')}</td>
                    <td>{new Date(booking.updated_at).toLocaleString('vi-vn')}</td>
                    <td>{booking.user_id}</td>
                    <td>{booking.from}</td>
                    <td>{booking.to}</td>
                    <td>{booking.amount}</td>
                    <td>{booking.status}
                      <Combobox
                        textField='status'
                        data={[
                          {id: booking.id, status: 'new'},
                          {id: booking.id, status: 'confirmed'},
                          {id: booking.id, status: 'completed'},
                          {id: booking.id, status: 'canceled'}
                        ]}
                        defaultValue={booking.status}
                        disabled={false}
                        onChange={this.updateBookingStatus}
                      />
                    </td>
                    <td>{booking.address}</td>
                    <td>{booking.phone_number}</td>
                    <td>{booking.name}</td>
                    <td>{booking.services}</td>
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
