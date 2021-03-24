import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  observations: String,
}, {
  timestamps: true,
  versionKey: false,
});

const Lead = mongoose.model('Lead', schema);

export default Lead;
