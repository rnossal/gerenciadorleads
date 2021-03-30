export const LeadsRoot = {
  lead: async (args, req) => {
    const { models } = req.context;

    return models.Lead.findById(args.id).populate({
      path: 'createdBy',
    });
  },
  leads: async (args, req) => {
    const { models } = req.context;

    const query = {};
    if (args.name || args.email || args.phone || args.observations) {
      query.$or = [];

      if (args.name) {
        query.$or.push({ name: new RegExp(`.*${args.name.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
      if (args.email) {
        query.$or.push({ email: new RegExp(`.*${args.email.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
      if (args.phone) {
        query.$or.push({ phone: new RegExp(`.*${args.phone.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
      if (args.observations) {
        query.$or.push({ observations: new RegExp(`.*${args.observations.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
    }

    return models.Lead.find(query).populate({
      path: 'createdBy',
    });
  },
};

export default {
  LeadsRoot,
};
