import React, {Component} from 'react';
import authHeader from '../../services/auth-header';
import axios from 'axios';

export class ManageUser extends Component {

  constructor(props) {
    super(props);
    this.state = {users:[]}
  }

  componentDidMount() {
    this.setDataTableDemoDestroy();
    this.getUsers();
  }

  getUsers = () => {
    var config = {
      method: 'get',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/users',
      headers: authHeader()
    };

    axios(config)
    .then( response => {
      let users = response.data.data;
      for(let i=0;i<users.length;i++)
      {
        if(users[i].role === 1)
        {
          users[i].role = 'user';
        }
        else if(users[i].role === 2)
        {

          users[i].role = 'admin';
        }

        if(users[i].status === 1)
        {
          users[i].status = 'active';
        }
        else
        {
          users[i].status = 'locked';
        }
      }

      this.setState({users:users});
      this.setDataTableDemo();
    })
    .catch( error => {
      console.log(error);
    });
  }

  lockAccount = (event)=>{
    let userId = event.target.getAttribute('data-index');

    var config = {
      method: 'patch',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/users/'+userId+'/lock',
      headers: authHeader()
    };

    axios(config)
    .then( response => {
      //refetch
      this.getUsers();
    })
    .catch( error => {
      console.log(error);
    });
  }

  unlockAccount = (event)=>{
    let userId = event.target.getAttribute('data-index');

    var config = {
      method: 'patch',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/users/'+userId+'/unlock',
      headers: authHeader()
    };

    axios(config)
    .then( response => {
      //refetch
      this.getUsers();
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
            <h6 className="m-0 font-weight-bold text-primary">Users</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Email Verified At</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Email Verified At</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                  </tr>
                </tfoot>
                <tbody>
                  {this.state.users.map(user=>
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.email_verified_at).toLocaleString('vi-vn')}</td>
                      <td>{new Date(user.created_at).toLocaleString('vi-vn')}</td>
                      <td>{new Date(user.updated_at).toLocaleString('vi-vn')}</td>
                      <td>{user.role}</td>
                      <td>{user.address}</td>
                      <td>{user.phone_number}</td>
                      <td>{user.status}
                        <button type="button"
                          className="btn btn-danger"
                          data-index={user.id}
                          hidden={user.status !== 'active'}
                          onClick={this.lockAccount}>
                          Lock
                        </button>
                        <button type="button"
                          className="btn btn-success"
                          data-index={user.id}
                          hidden={user.status !== 'locked'}
                          onClick={this.unlockAccount}>
                          UnLock
                        </button>
                      </td>
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
