import axios from "axios";

const API_URL = "https://cleaning-service-hust.herokuapp.com/api/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  signup(name, phone, email, address, password) {
    return axios.post(API_URL + "register", {
      name,
      phone,
      email,
      address,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

}

export default new AuthService();
