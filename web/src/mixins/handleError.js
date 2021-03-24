export default {
  methods: {
    handleError(title, e) {
      let desc = e;
      if (e?.response?.data?.message) {
        desc = e.response.data.message;
      }
      if (Array.isArray(e?.response?.data?.errors)) {
        desc = e.response.data.errors.map((error) => error.message).join('\n');
      }
      if (e?.errors) {
        desc = e.errors.map((error) => error.message).join('\n');
      }

      this.$Notice.error({
        title,
        desc,
      });

      // eslint-disable-next-line no-console
      console.clear();
    },
  },
};
