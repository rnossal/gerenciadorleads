import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { dirname } from '../utils/nodeESM.js';
import authenticate from '../utils/authenticateMiddleware.js';

const { Router } = express;
const router = Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const { models } = req.context;

  const user = await models.User.findOne({ $or: [{ username }, { email: username }] });
  if (!user) return res.status(401).json({ message: req.t('INCORRECT_USER_PASSWORD') });

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) return res.status(401).json({ message: req.t('INCORRECT_USER_PASSWORD') });

  const privKey = fs.readFileSync(path.join(dirname(import.meta), '../keys/auth/priv.key'));
  const token = jwt.sign({ userId: user.id }, privKey, {
    expiresIn: '7d',
    algorithm: 'RS512',
  });

  const tokenModel = models.Jwt({ token, userId: user.id });
  await tokenModel.save();

  res.json({
    token,
    user: user.toObject({ virtuals: true }),
  });
});

router.get('/', authenticate(), async (req, res) => {
  const { token, user } = req;

  res.json({
    token,
    user: user.toObject({ virtuals: true }),
  });
});

router.delete('/', async (req, res) => {
  const { token } = req;
  const { models } = req.context;

  const tokenModel = await models.Jwt.findOne({ token });
  if (!tokenModel) return res.status(400).json({ message: req.t('TOKEN_NOT_FOUND') });

  const deleted = await tokenModel.deleteOne();

  res.json({
    deleted,
  });
});

export default router;
