import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://cleaning-service-hust.herokuapp.com/api/";

class BookingService {

  book(name, address, phoneNumber, from, to, services) {
    let formData = new FormData();

    formData.append('name', name);
    formData.append('from', from);
    formData.append('to', to);
    formData.append('phone_number', phoneNumber);
    formData.append('address', address);
    services.forEach((item) => {
      formData.append('service_ids[]', item);
    });

    return axios.post(API_URL + 'bookings', formData, {headers: authHeader()});
  }

  cancelBooking(id) {
    return axios.patch(API_URL + `bookings/${id}/cancel`, null,{headers: authHeader()});
  }

  postReview(booking_id, rating, content) {
    return axios.post(API_URL + 'reviews', {booking_id, rating, content},{headers: authHeader()});
  }

  updateReview(id, rating, content) {
    return axios.patch(API_URL + `reviews/${id}`, {rating, content},{headers: authHeader()});
  }

}

export default new BookingService();
