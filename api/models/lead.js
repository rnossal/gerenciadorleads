import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  observations: String,
  coursesOfInterest: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
  ],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Lead = mongoose.model('Lead', schema);

export default Lead;
