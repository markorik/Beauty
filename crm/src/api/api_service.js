  
import { API_PATH } from '../constants';
import { HttpService } from '../services/http-service';

export class ApiService extends HttpService {

  constructor() {
    super(API_PATH);
  }

  getMasters() {
    return this.get('staff');
  }

  getSaloonServices() {
    return this.get('services');
  }

  createOrder(order) {
    return this.post('orders', order);
  }

  login(authData) {
    return this.post('login', authData);
  }

}

export default new ApiService();