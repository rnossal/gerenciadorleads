/* eslint-disable */
import axios from 'axios';

export default {
  install(Vue, options) {
    if (this.installed) return;

    this.installed = true;

    const axiosOptions = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    Object.assign(axiosOptions, options);

    const axiosInstance = axios.create(axiosOptions);

    Vue.axios = axiosInstance;
    Vue.$http = axiosInstance;

    Object.defineProperties(Vue.prototype, {
      axios: {
        get() {
          return axiosInstance;
        },
      },
      $http: {
        get() {
          return axiosInstance;
        },
      },
    });
  },
};
