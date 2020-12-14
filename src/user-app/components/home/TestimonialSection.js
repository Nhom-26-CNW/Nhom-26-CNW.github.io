import React, {Component} from 'react';
import GeneralService from '../../../services/general.service';
import OwlCarousel from "react-owl-carousel2";
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component/dist/react-stars";
import faker from 'faker/locale/vi';

const TestimonialCard = (props) => {
  const rand = function() {
    return Math.random().toString(36).substr(2);
  };

  const review = props.review;
  const name = faker.name.findName();
  const imageUrl = "https://i.pravatar.cc/85?u=" + rand();
  return (
    <div className="home1-testm item">
      <div className="home1-testm-single text-center">
        <div className="home1-testm-img">
          <img src={imageUrl} alt="img"/>
        </div>
        <div className="home1-testm-txt">
          <span className="icon section-icon">
            <i className="fa fa-quote-left" aria-hidden="true"/>
          </span>
          <ReactStars
            count={5}
            value={review.rating}
            edit={false}
            size={24}
            activeColor="#ffd700"
            classNames="testimonial-stars"
          />
          <p>
            {review.content}
          </p>
          <h3>
            <Link to="/#book"> {name} </Link>
          </h3>
        </div>
      </div>
    </div>
  )
}

export class TestimonialSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: []
    };
  }

  componentDidMount() {
    GeneralService.getReviews()
      .then(res => {
        this.setState({
          reviews: res.data.data.filter((review) => review.rating >= 4).slice(0, 10)
        })
      })
  }

  render() {
    if (this.state.reviews.length === 0)
      return (<div/>);


    const options = {
      items:3,
      margin:0,
      autoplay:true,
      smartSpeed:1000,
      dots:false,
      autoplayHoverPause:true,
      responsive:{
        0:{
          items:1
        },
        640:{
          items:1
        },
        767:{
          items:2
        },
        992:{
          items:3
        }
      }
    };

    return (
      <section className="testemonial">
        <div className="container">
          <div className="gallary-header text-center">
            <h2>Nhận xét của khách hàng</h2>
            <p>
              Hãy xem ý kiến của khách hàng đã sử dụng dịch vụ của HouseClean.
            </p>
          </div>
          <OwlCarousel ref="car" options={options} >
            {this.state.reviews.map(review => (
              <TestimonialCard review={review} key={review.id}/>
            ))}
          </OwlCarousel>
        </div>
      </section>
    );
  }
}
