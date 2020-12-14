import React, {Component} from 'react';
import authHeader from '../../services/auth-header';
import axios from 'axios';

export class ManageService extends Component {

  constructor(props) {
    super(props);

    this.state = {
      services: [],
      serviceOnEdit: { id: 0, name: '', description: '', cost: 0 },
      onAddService: false
    }
  }

  componentDidMount() {
    this.setDataTableDemoDestroy();
    this.getServices();
  }

  getServices = () => {
    var config = {
      method: 'get',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/services',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        let services = response.data.data;
        this.setState({ services: services });
        this.setDataTableDemo();
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChangeCost = (event) => {
    let serviceOnEdit = Object.assign({}, this.state.serviceOnEdit);
    serviceOnEdit.cost = event.target.value;

    this.setState({ serviceOnEdit: serviceOnEdit });
  }

  handleClickChangeCost = (event) => {
    let serviceId = event.target.getAttribute("data-index");
    let serviceOnEdit = Object.assign({}, this.state.serviceOnEdit);
    serviceOnEdit.id = serviceId;
    serviceOnEdit.cost = 0;

    this.setState({ serviceOnEdit: serviceOnEdit });
  }

  changeCost = (event) => {
    event.preventDefault();

    let serviceId = event.target.getAttribute("data-index");

    var config = {
      method: 'patch',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/services/' + serviceId,
      headers: authHeader(),
      data: { 'cost': this.state.serviceOnEdit.cost }
    };

    axios(config)
      .then(response => {
        //refetch
        this.getServices();
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleClickAddService = (event) => {
    this.setState({ onAddService: true });
  }

  handleClickCloseAddingService = (event) => {
    this.setState({ onAddService: false });
  }

  handleChangeAddForm = (event) => {
    let service = Object.assign({}, this.state.serviceOnEdit);
    service[event.target.name] = event.target.value;

    this.setState({ serviceOnEdit: service });
  }

  addService = (event) => {
    event.preventDefault();

    var data = new FormData();
    data.append('name', this.state.serviceOnEdit.name);
    data.append('description', this.state.serviceOnEdit.description);
    data.append('cost', this.state.serviceOnEdit.cost);

    var config = {
      method: 'post',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/services',
      headers: authHeader(),
      data: data
    };

    axios(config)
      .then(response => {
        //refetch
        this.getServices();
      })
      .catch(error => {
        console.log(error);
      });
  }

  removeService = (event) => {
    let serviceId = event.target.getAttribute("data-index");

    var config = {
      method: 'delete',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/services/' + serviceId,
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        //refetch
        this.getServices();
      })
      .catch(error => {
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
        <div className="row">
          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <button type="button"
              className="btn btn-primary"
              data-index={0}
              hidden={this.state.onAddService}
              onClick={this.handleClickAddService}>
              Add
            </button>
            <button type="button"
              className="btn btn-danger"
              data-index={0}
              hidden={this.state.onAddService == false}
              onClick={this.handleClickCloseAddingService}>
              Close
            </button>
            <form onSubmit={this.addService}
              data-index={0}
              hidden={this.state.onAddService == false}
            >
              <br></br>
              <div className="form-group">
                <label>Name :</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={this.state.serviceOnEdit.name}
                  onChange={this.handleChangeAddForm}
                  disabled={false}
                />
              </div>
              <div className="form-group">
                <label>Description :</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={this.state.serviceOnEdit.description}
                  onChange={this.handleChangeAddForm}
                  disabled={false}
                />
              </div>
              <div className="form-group">
                <label>Cost :</label>
                <input
                  type="number"
                  className="form-control"
                  name="cost"
                  value={this.state.serviceOnEdit.cost}
                  onChange={this.handleChangeAddForm}
                  disabled={false}
                />
              </div>
              <div className="text-center">
                <button type="submit"
                  className="btn btn-warning"
                  data-index={0}>
                  Submit
              </button>
              </div>
            </form>
          </div>
          <div className={this.state.onAddService ? "col-xs-8 col-sm-8 col-md-8 col-lg-8"
            : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>

            <br></br>
            <div className="card shadow mb-4" >
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Services</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Cost</th>
                        <th>Change Cost</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tfoot>
                      <tr>
                        <th>Id</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Cost</th>
                        <th>Change Cost</th>
                        <th>Remove</th>
                      </tr>
                    </tfoot>
                    <tbody>
                      {this.state.services.map(service =>
                        <tr key={service.id}>
                          <td>{service.id}</td>
                          <td>{new Date(service.created_at).toLocaleString('vi-vn')}</td>
                          <td>{new Date(service.updated_at).toLocaleString('vi-vn')}</td>
                          <td>{service.name}</td>
                          <td>{service.description}</td>
                          <td>{service.cost}</td>
                          <td>
                            <button type="button"
                              className="btn btn-primary"
                              data-index={service.id}
                              hidden={this.state.serviceOnEdit.id == service.id}
                              onClick={this.handleClickChangeCost}>
                              Change Cost
                        </button>
                            <form onSubmit={this.changeCost}
                              data-index={service.id}
                              hidden={this.state.serviceOnEdit.id != service.id}>
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="id"
                                  value={this.state.serviceOnEdit.cost}
                                  onChange={this.handleChangeCost}
                                  disabled={false}
                                />
                              </div>
                              <div className="text-center">
                                <button type="submit"
                                  className="btn btn-warning"
                                  data-index={service.id}>
                                  Submit
                            </button>
                              </div>
                            </form>
                          </td>
                          <td>
                            <button type="button"
                              className="btn btn-danger"
                              data-index={service.id}
                              onClick={this.removeService}
                            >
                              Remove
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
        </div>
      </div>
    );
  }
}
