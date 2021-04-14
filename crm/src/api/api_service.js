import { API_PATH } from '../constants';
import { HttpService } from '../services/http-service';

export class ApiService extends HttpService {

  constructor() {
    super(API_PATH);
  }

  login(authData) {
    return this.post('login', authData);
  }

  // Customers

  createCustomer(customerData) {
    return this.post('customers', customerData);
  }

  readCustomers() {
    return this.get('customers');
  }

  updateCustomer(id, customerData) {
    return this.patch(`customers/${id}`, customerData);
  }

  deleteCustomer(id) {
    return this.delete(`customers/${id}`);
  }

  // Orders

  createOrder(orderData) {
    return this.post('orders', orderData);
  }

  readOrders() {
      return this.get('orders');
  }

  updateOrder(id, orderData) {
      return this.patch(`orders/${id}`, orderData);
  }

  deleteOrder(id) {
      return this.delete(`orders/${id}`);
  }

  // Masters

  createMaster(masterData) {
    return this.post('staff', masterData);
  }
  
  readMasters() {
    return this.get('staff');
  }

  updateMaster(id, masterData) {
    return this.patch(`staff/${id}`, masterData);
}

  deleteMaster(id) {
      return this.delete(`staff/${id}`);
  }

  // Services

  readServices() {
      return this.get('services');
  }  
}

export default new ApiService();