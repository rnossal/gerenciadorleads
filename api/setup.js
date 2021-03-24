/* eslint-disable no-console */
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import models, { connect, disconnect } from './models/index.js';

dotenv.config();

connect().then(async () => {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  const userModel = models.User({
    name: 'Admin',
    username: 'admin',
    email: 'admin@admin.com',
    password: passwordHash,
  });

  const userSaved = await userModel.save();

  if (userSaved) {
    console.log('Usuário administrador adicionado com sucesso');
  }

  disconnect();
});
