/* eslint-disable */
const flattenObject = (ob) => {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

export default {
  install(Vue) {
    if (this.installed) return;

    Vue.$flattenObject = flattenObject;

    Object.defineProperties(Vue.prototype, {
      $flattenObject: {
        get() {
          return flattenObject;
        },
      },
    });

    this.installed = true;
  },
};
