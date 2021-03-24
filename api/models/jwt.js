import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  token: String,
  userId: mongoose.Types.ObjectId,
}, {
  timestamps: true,
  versionKey: false,
});

const Jwt = mongoose.model('Jwt', schema);

export default Jwt;
