import mongoose from 'mongoose';

export const LeadsRoot = {
  lead: async (args, req) => {
    const { models } = req.context;

    if (mongoose.Types.ObjectId.isValid(args.id)) {
      return models.Lead.findById(args.id).populate([
        {
          path: 'createdBy',
        },
        {
          path: 'coursesOfInterest',
        }
      ]);
    }

    return [];
  },
  leads: async (args, req) => {
    const { models } = req.context;

    const query = {};
    if (args.name || args.email || args.phone || args.observations || (Array.isArray(args.coursesOfInterest) && args.coursesOfInterest.length > 0)) {
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
      if (Array.isArray(args.coursesOfInterest) && args.coursesOfInterest.length > 0) {
        query.$or.push({ coursesOfInterest: { $in: args.coursesOfInterest } });
      }
    }

    return models.Lead.find(query).populate([
      {
        path: 'createdBy',
      },
      {
        path: 'coursesOfInterest',
      }
    ]);
  },
};

export default {
  LeadsRoot,
};
