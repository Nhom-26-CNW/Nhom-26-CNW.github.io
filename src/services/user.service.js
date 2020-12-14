import axios from 'axios';
import authHeader from './auth-header';

const API_URL = "https://cleaning-service-hust.herokuapp.com/api/";

class UserService {

  getMe() {
    return axios.get(API_URL + 'me', { headers: authHeader() });
  }

  getHistory() {
    return axios.get(API_URL + 'user/bookings', { headers: authHeader() });
  }

  updateMe(name, address, phone) {
    return axios.patch(API_URL + "profile", {
      name: name,
      phone_number: phone,
      address: address
    }, {headers: authHeader()});
  }

  updatePassword(oldPassword, newPassword) {
    return axios.patch(API_URL + "password/change", {
      password: oldPassword,
      new_password: newPassword
    }, {headers: authHeader()});
  }
}

export default new UserService();
