import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  description: String,
  status: {
    type: Number,
    min: 0,
    max: 4,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Número de status inválido.',
    },
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const FollowUp = mongoose.model('FollowUp', schema);

export default FollowUp;
