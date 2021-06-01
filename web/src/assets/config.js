import join from 'url-join';

export const domain = process?.env?.VUE_APP_ENDPOINT;
export const authentication = {
  location: join(domain, '/authentication/'),
  get methods() {
    return {
      login: join(this.location, '/'), // POST
      logout: join(this.location, '/'), // DELETE
      get: join(this.location, '/'),
    };
  },
};
export const courses = {
  location: join(domain, '/courses/'),
  get methods() {
    return {
      get: join(this.location, '/'),
      post: join(this.location, '/'),
      update: join(this.location, '/'),
      delete: join(this.location, '/'),
    };
  },
};
export const leads = {
  location: join(domain, '/leads/'),
  get methods() {
    return {
      get: join(this.location, '/'),
      post: join(this.location, '/'),
      update: join(this.location, '/'),
      delete: join(this.location, '/'),
    };
  },
};
export const users = {
  location: join(domain, '/users/'),
  get methods() {
    return {
      get: join(this.location, '/'),
      post: join(this.location, '/'),
      update: join(this.location, '/'),
      delete: join(this.location, '/'),
    };
  },
};

export default {
  authentication,
  courses,
  domain,
  leads,
  users,
};
