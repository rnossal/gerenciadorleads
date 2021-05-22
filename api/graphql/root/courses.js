import mongoose from 'mongoose';

export const CoursesRoot = {
  course: async (args, req) => {
    const { models } = req.context;

    if (mongoose.Types.ObjectId.isValid(args.id)) {
      return models.Course.findById(args.id).populate({
        path: 'createdBy',
      });
    }

    return [];
  },
  courses: async (args, req) => {
    const { models } = req.context;

    const query = {};
    if (args.name) {
      query.$or = [];

      if (args.name) {
        query.$or.push({ name: new RegExp(`.*${args.name.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'gi') });
      }
    }

    return models.Course.find(query).populate({
      path: 'createdBy',
    });
  },
};

export default {
  CoursesRoot,
};
