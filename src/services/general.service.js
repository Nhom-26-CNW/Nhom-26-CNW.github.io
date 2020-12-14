import axios from 'axios';

const API_URL = "https://cleaning-service-hust.herokuapp.com/api/";

class GeneralService {

  getServices() {
    return axios.get(API_URL + 'services');
  }

  getReviews() {
    return axios.get(API_URL + 'reviews');
  }

}

export default new GeneralService();
