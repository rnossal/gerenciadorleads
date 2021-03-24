import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import expressGraphQL from 'express-graphql';
import { root, schemas } from '../graphql/index.js';
import authenticate from '../utils/authenticateMiddleware.js';

const { Router } = express;
const router = Router();
const { graphqlHTTP } = expressGraphQL;

router.get('/', authenticate(), graphqlHTTP({
  schema: schemas.UsersSchema,
  rootValue: root.UsersRoot,
}));

router.post('/', async (req, res) => {
  const { models } = req.context;
  const {
    name,
    username,
    email,
    password,
  } = req.body;

  const userExists = await models.User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    if (userExists.username === username && userExists.email === email) {
      return res.status(400).json({ message: req.t('USERNAME_EMAIL_EXISTS') });
    } if (userExists.username === username) {
      return res.status(400).json({ message: req.t('USERNAME_EXISTS') });
    }

    return res.status(400).json({ message: req.t('EMAIL_EXISTS') });
  }

  if (!password || password.trim().length < 8) return res.status(400).json({ message: req.t('INVALID_PASSWORD') });
  if (!name || name.trim() === 0) return res.status(400).json({ message: req.t('INVALID_NAME') });
  if (!validator.isEmail(email)) return res.status(400).json({ message: req.t('INVALID_EMAIL') });

  const passwordHash = await bcrypt.hash(password, 12);

  const userModel = models.User({
    name,
    username,
    email,
    password: passwordHash,
  });
  const userSaved = await userModel.save();

  return res.json({
    user: userSaved,
  });
});

router.put('/', authenticate(), async (req, res) => {
  const { models } = req.context;
  const {
    userId,
    name,
    username,
    email,
    password,
    admin,
  } = req.body;

  const existsEmail = await models.User.findOne({ email });
  const existsUsername = await models.User.findOne({ username });

  if (existsEmail && existsEmail.id !== userId) {
    return res.status(400).json({ message: req.t('USERNAME_EMAIL_EXISTS') });
  }
  if (existsUsername && existsUsername.id !== userId) {
    return res.status(400).json({ message: req.t('USERNAME_EXISTS') });
  }

  if (!name || name.trim() === 0) return res.status(400).json({ message: req.t('INVALID_NAME') });
  if (!validator.isEmail(email)) return res.status(400).json({ message: req.t('INVALID_EMAIL') });
  if (password && password.trim().length < 8) return res.status(400).json({ message: req.t('INVALID_PASSWORD') });

  const updateModel = {
    name,
    username,
    email,
    admin,
  };

  if (password) {
    updateModel.password = await bcrypt.hash(password, 12);
  }

  const user = models.User.findById(userId);
  const userSaved = await user.updateOne(updateModel);

  return res.json({
    user: userSaved,
  });
});

// router.delete('/', authenticate(), (req, res) => {

// });

export default router;
