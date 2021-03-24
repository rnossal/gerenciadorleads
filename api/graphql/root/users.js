export const UsersRoot = {
  user: async (args, req) => {
    const { user } = req;
    const { models } = req.context;

    if (!user.admin && user.id !== args.id) {
      throw new Error(req.t('NO_PERMISSION'));
    }

    return models.User.findById(args.id);
  },
  users: async (args, req) => {
    const { user } = req;
    const { models } = req.context;

    if (!user.admin) {
      throw new Error(req.t('NO_PERMISSION'));
    }

    const query = {};
    if (args.username || args.name || args.email) {
      query.$or = [];

      if (args.username) {
        query.$or.push({ username: new RegExp(`.*${args.username.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
      if (args.name) {
        query.$or.push({ name: new RegExp(`.*${args.name.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
      if (args.email) {
        query.$or.push({ email: new RegExp(`.*${args.email.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
    }

    return models.User.find(query);
  },
};

export default {
  UsersRoot,
};
