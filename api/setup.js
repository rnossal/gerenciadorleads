/* eslint-disable no-console */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import models, { connect, disconnect } from './models/index.js';

dotenv.config();

connect().then(async () => {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  const userModel = models.User({
    _id: mongoose.Types.ObjectId('60a954656ff6de057f2eb857'),
    name: 'Admin',
    username: 'admin',
    email: 'admin@admin.com',
    password: passwordHash,
    admin: true,
  });

  const userSaved = await userModel.save();

  if (userSaved) {
    console.log('Usuário administrador adicionado com sucesso');
  }

  disconnect();
});
