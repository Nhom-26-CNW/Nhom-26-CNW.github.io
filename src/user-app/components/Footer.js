import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export class Footer extends Component {
  render() {
    return (
      <footer className="footer-copyright">
        <div className="container">
          <div className="footer-content">
            <div className="row">
              <div className="col-sm-4">
                <div className="single-footer-item">
                  <div className="footer-logo">
                    <Link to="/">House<span>Clean</span></Link>
                    <p>Hơn cả giúp việc nhà</p>
                  </div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="single-footer-item">
                  <h2>Đường dẫn</h2>
                  <div className="single-footer-txt">
                    <p><Link to="/">Giới thiệu</Link></p>
                    <p><Link to="/#promotion">Khuyến mãi</Link></p>
                    <p><Link to="/#services">Dịch vụ</Link></p>
                    <p><Link to="/#testimonials">Phản hồi</Link></p>
                    <p><Link to="/#book">Đặt lịch</Link></p>
                  </div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="single-footer-item text-center">
                  <h2 className="text-left">Liên hệ</h2>
                  <div className="single-footer-txt text-left">
                    <p>+84 1234 6543</p>
                    <p className="foot-email">
                      info@houseclean.com
                    </p>
                    <p>Số 1 Đại Cồ Việt, Hai Bà Trưng</p>
                    <p>Hà Nội, Việt Nam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr/>
          <div className="foot-icons">
            <ul className="footer-social-links list-inline list-unstyled">
              <li>
                <Link to="https://facebook.com" target="_blank" className="foot-icon-bg-1">
                  <i className="fa fa-facebook"/>
                </Link>
              </li>
              <li>
                <a href="https://twitter.com" className="foot-icon-bg-2">
                  <i className="fa fa-twitter"/>
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="foot-icon-bg-3">
                  <i className="fa fa-instagram"/>
                </a>
              </li>
            </ul>
            <p>&copy; {new Date().getFullYear()} <Link to="/">HouseClean</Link>.
              All Right Reserved</p>
          </div>

          <div id="scroll-Top">
            <i className="fa fa-angle-double-up return-to-top" id="scroll-top"
               data-toggle="tooltip" data-placement="top"
               title="" data-original-title="Back to Top"
               aria-hidden="true"/>
          </div>
        </div>
      </footer>
    );
  }
}
