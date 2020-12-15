import React, {Component} from 'react';
import authHeader from '../../services/auth-header';
import axios from 'axios';
import Spinner from "../../user-app/components/shared/Spinner";

export class ManageUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      users: []
    }
  }

  componentDidMount() {
    this.setDataTableDemoDestroy();
    this.getUsers();
  }

  getUsers = () => {
    const config = {
      method: 'get',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/users',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        let users = response.data.data;
        for (let i = 0; i < users.length; i++) {
          if (users[i].role === 1) {
            users[i].role = 'Người dùng';
          } else if (users[i].role === 2) {

            users[i].role = 'hân viên';
          }

          if (users[i].status === 1) {
            users[i].status = 'Hoạt động';
          } else {
            users[i].status = 'Khóa';
          }
        }

        this.setState({
          loading: false,
          users: users
        });
        this.setDataTableDemo();
      })
      .catch(error => {
        console.log(error);
      });
  }

  lockAccount = (event) => {
    let userId = event.target.getAttribute('data-index');

    const config = {
      method: 'patch',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/users/' + userId + '/lock',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        //refetch
        this.getUsers();
      })
      .catch(error => {
        console.log(error);
      });
  }

  unlockAccount = (event) => {
    let userId = event.target.getAttribute('data-index');

    const config = {
      method: 'patch',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/users/' + userId + '/unlock',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        //refetch
        this.getUsers();
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
            <h6 className="m-0 font-weight-bold text-primary">Người dùng</h6>
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
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Vai trò</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                  </tr>
                  </thead>
                  <tfoot>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Vai trò</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                  </tr>
                  </tfoot>
                  <tbody>
                  {this.state.users.filter((item) => {
                    return item.role === 'Người dùng'
                  }).map(user =>
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.created_at).toLocaleString('vi-vn')}</td>
                      <td>{new Date(user.updated_at).toLocaleString('vi-vn')}</td>
                      <td>{user.role}</td>
                      <td>{user.address}</td>
                      <td>{user.phone_number}</td>
                      <td>{user.status}
                        <p>
                          <button type="button"
                                  className="btn btn-danger"
                                  data-index={user.id}
                                  hidden={user.status !== 'Hoạt động'}
                                  onClick={this.lockAccount}>
                            Khóa
                          </button>
                          <button type="button"
                                  className="btn btn-success"
                                  data-index={user.id}
                                  hidden={user.status !== 'Khóa'}
                                  onClick={this.unlockAccount}>
                            Kích hoạt
                          </button>
                        </p>
                      </td>
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
