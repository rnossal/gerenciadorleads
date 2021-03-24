/* eslint-disable */
import moment from 'moment';

export default {
  install(Vue, options) {
    if (this.installed) return;

    this.installed = true;

    Vue.moment = moment;
    Vue.$moment = moment;

    Object.defineProperties(Vue.prototype, {
      moment: {
        get() {
          return moment;
        },
      },
      $moment: {
        get() {
          return moment;
        },
      },
    });
  },
};
