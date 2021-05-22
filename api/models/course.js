import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  name: String,
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Course = mongoose.model('Course', schema);

export default Course;
