export default {
  methods: {
    arrayObjectAttributeToText(array, attribute) {
      let text = '';

      if (array) {
        array.forEach((course, index) => {
          const attributeContent = course[attribute];

          if ((array.length - 2) > index) {
            text += `${attributeContent}, `;
          } else if ((array.length - 1) > index) {
            text += `${attributeContent} e `;
          } else {
            text += attributeContent;
          }
        });
      }

      return text;
    },
  },
};
