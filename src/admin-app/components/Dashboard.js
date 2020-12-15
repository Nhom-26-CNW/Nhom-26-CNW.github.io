import React, {Component} from 'react';
import authHeader from '../../services/auth-header';

export class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMonthEarning: 0,
      sixMonthEarning: 0,
      averageRating: 0,
      numberOfRating: 0,
      percentsRating: {1: 20, 2: 20, 3: 20, 4: 20, 5: 20}
    }
  }

  componentDidMount() {
    this.loadChartAreaDemo();
    this.loadChartPieDemo();
    this.getEarnings();
    this.getRatings();
  }

  loadChartAreaDemo = () => {
    let script = document.createElement("script");
    script.src = "admin/js/demo/chart-area-demo.js";
    script.async = true;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  loadChartPieDemo = () => {
    let script = document.createElement("script");
    script.src = "admin/js/demo/chart-pie-demo.js";
    script.async = true;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  getEarnings = () => {
    const axios = require('axios');

    const config = {
      method: 'get',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/profit',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        let currentMonthEarning = parseFloat(response.data[Object.keys(response.data)[5]]);

        let sixMonthEarning = 0;
        let values = Object.values(response.data);
        values.forEach(value => {
          sixMonthEarning += parseFloat(value);
        })

        this.setState({
          currentMonthEarning: currentMonthEarning,
          sixMonthEarning: sixMonthEarning
        });
      })
      .catch(error => {
        console.log(error);
      });

  }

  getRatings = () => {
    const axios = require('axios');

    const config = {
      method: 'get',
      url: 'https://cleaning-service-hust.herokuapp.com/api/admin/rating',
      headers: authHeader()
    };

    axios(config)
      .then(response => {
        let numberOfRating = 0;
        let sumRating = 0;

        for (let i = 1; i <= 5; i++) {
          numberOfRating += response.data[i];
          sumRating += response.data[i] * i;
        }

        let averageRating = (sumRating / numberOfRating).toFixed(2);

        let percentsRating = {
          1: (response.data[1] / numberOfRating).toFixed(2) * 100,
          2: (response.data[2] / numberOfRating).toFixed(2) * 100,
          3: (response.data[3] / numberOfRating).toFixed(2) * 100,
          4: (response.data[4] / numberOfRating).toFixed(2) * 100,
          5: (response.data[5] / numberOfRating).toFixed(2) * 100
        }

        this.setState({
          numberOfRating: numberOfRating,
          averageRating: averageRating,
          percentsRating: percentsRating
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const token = authHeader().Authorization;
    const currencyOptions = {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }

    return (
      <div className="container">

        <div className="container-fluid">
          <div id='token' hidden>
            {token}
          </div>
          <div
            className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Thống kê</h1>
            {/*<a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fas fa-download fa-sm text-white-50" /> Generate Report</a>*/}
          </div>
          <div className="row">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div
                        className="text-xs font-weight-bold text-primary text-uppercase mb-1">Thu nhập
                        (Theo tháng)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {this.state.currentMonthEarning.toLocaleString('vi-vn', currencyOptions)}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Earnings (Annual) Card Example */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div
                        className="text-xs font-weight-bold text-success text-uppercase mb-1">Thu nhập
                        (Theo năm)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {this.state.sixMonthEarning.toLocaleString('vi-vn', currencyOptions)}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div
                        className="text-xs font-weight-bold text-info text-uppercase mb-1">Đánh giá trung bình
                      </div>
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div
                            className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{this.state.averageRating}/5
                          </div>
                        </div>
                        <div className="col">
                          <div className="progress progress-sm mr-2">
                            <div className="progress-bar bg-info"
                                 role="progressbar"
                                 style={{width: this.state.averageRating / 5 * 100 + '%'}}
                                 aria-valuenow={50} aria-valuemin={0}
                                 aria-valuemax={100}/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div
                        className="text-xs font-weight-bold text-warning text-uppercase mb-1">Số lượt đánh giá
                      </div>
                      <div
                        className="h5 mb-0 font-weight-bold text-gray-800">{this.state.numberOfRating}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-comments fa-2x text-gray-300"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Content Row */}
          <div className="row">
            {/* Area Chart */}
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow mb-4">
                <div
                  className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Tổng quan thu nhập</h6>
                </div>
                <div className="card-body">
                  <div className="chart-area">
                    <canvas id="myAreaChart"/>
                  </div>
                </div>
              </div>
            </div>
            {/* Pie Chart */}
            <div className="col-xl-4 col-lg-5">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Đánh giá</h6>
                </div>
                <div className="card-body">
                  <h4 className="small font-weight-bold">⭐<span
                    className="float-right">{this.state.percentsRating["1"]}%</span>
                  </h4>
                  <div className="progress mb-4">
                    <div className="progress-bar bg-danger" role="progressbar"
                         style={{width: this.state.percentsRating["1"] + '%'}}
                         aria-valuenow={20} aria-valuemin={0}
                         aria-valuemax={100}/>
                  </div>
                  <h4 className="small font-weight-bold">⭐⭐<span
                    className="float-right">{this.state.percentsRating["2"]}%</span>
                  </h4>
                  <div className="progress mb-4">
                    <div className="progress-bar bg-warning" role="progressbar"
                         style={{width: this.state.percentsRating["2"] + '%'}}
                         aria-valuenow={40} aria-valuemin={0}
                         aria-valuemax={100}/>
                  </div>
                  <h4 className="small font-weight-bold">⭐⭐⭐<span
                    className="float-right">{this.state.percentsRating["3"]}%</span>
                  </h4>
                  <div className="progress mb-4">
                    <div className="progress-bar" role="progressbar"
                         style={{width: this.state.percentsRating["3"] + '%'}}
                         aria-valuenow={60} aria-valuemin={0}
                         aria-valuemax={100}/>
                  </div>
                  <h4 className="small font-weight-bold">⭐⭐⭐⭐<span
                    className="float-right">{this.state.percentsRating["4"]}%</span>
                  </h4>
                  <div className="progress mb-4">
                    <div className="progress-bar bg-info" role="progressbar"
                         style={{width: this.state.percentsRating["4"] + '%'}}
                         aria-valuenow={80} aria-valuemin={0}
                         aria-valuemax={100}/>
                  </div>
                  <h4 className="small font-weight-bold">⭐⭐⭐⭐⭐<span
                    className="float-right">{this.state.percentsRating["5"]}%</span>
                  </h4>
                  <div className="progress">
                    <div className="progress-bar bg-success" role="progressbar"
                         style={{width: this.state.percentsRating["5"] + '%'}}
                         aria-valuenow={100} aria-valuemin={0}
                         aria-valuemax={100}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
