import TokenService from './token-service';
import PubSub from './pubSub';

export class HttpService {

  constructor(baseApiPath) {
    this.baseApi = baseApiPath;
  }

  get baseHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TokenService.getToken()}`
    };
  }

  async get(path) {
    const response = await fetch(`${this.baseApi}/${path}`, { headers: this.baseHeaders });
    return this._handleResponse(response);
  }

  // async delete(path, body) {
  //   const stringifiedData = JSON.stringify(body);

  //   const response = await fetch(`${this.baseApi}/${path}`, {
  //     method: 'DELETE',
  //     body: stringifiedData,
  //     headers: this.baseHeaders
  //   });

  //   return this._handleResponse(response);
  // }

  // async put(path, body) {
  //   const stringifiedData = JSON.stringify(body);

  //   const response = await fetch(`${this.baseApi}/${path}`, {
  //     method: 'PUT',
  //     body: stringifiedData,
  //     headers: this.baseHeaders
  //   });

  //   return this._handleResponse(response);
  // }

  async post(path, body) {
    const stringifiedData = JSON.stringify(body);

    const response = await fetch(`${this.baseApi}/${path}`, {
      method: 'POST',
      body: stringifiedData,
      headers: this.baseHeaders
    });

    return this._handleResponse(response);
  }

  async _handleResponse(response) {
    const parsedData = await response.json();

    if (response.ok) {
      return parsedData;
    }

    if (response.status === 401) {
      PubSub.emit('logout');
    }

    throw parsedData;
  }
}