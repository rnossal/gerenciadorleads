import mongoose from 'mongoose';
import { schema as FollowUp } from './followUp.js';

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
  followUpHistory: [ FollowUp ],
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

const Lead = mongoose.model('Lead', schema);

export default Lead;
