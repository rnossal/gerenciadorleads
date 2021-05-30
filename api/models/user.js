import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  admin: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
  versionKey: false,
});

const User = mongoose.model('User', schema);

export default User;
