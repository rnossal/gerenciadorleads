import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  name: String,
}, {
  timestamps: true,
  versionKey: false,
});

const Course = mongoose.model('Course', schema);

export default Course;
