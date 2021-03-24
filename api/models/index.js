import mongoose from 'mongoose';
import Jwt from './jwt.js';
import User from './user.js';
import Lead from './Lead.js';

const connect = () => mongoose.connect(process.env.DB_ADDRESS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const disconnect = () => mongoose.disconnect();

export { connect, disconnect };

export default {
  Jwt,
  User,
  Lead,
};
