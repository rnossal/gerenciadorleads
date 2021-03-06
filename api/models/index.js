import mongoose from 'mongoose';
import Course from './course.js';
import FollowUp from './followUp.js';
import Jwt from './jwt.js';
import Lead from './lead.js';
import User from './user.js';

const connect = () => mongoose.connect(process.env.DB_ADDRESS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const disconnect = () => mongoose.disconnect();

export { connect, disconnect };

export default {
  Course,
  FollowUp,
  Jwt,
  Lead,
  User,
};
