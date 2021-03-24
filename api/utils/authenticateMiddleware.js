import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { dirname } from './nodeESM.js';

const authenticate = (checkAdmin = false) => async (req, res, next) => {
  const pubKey = fs.readFileSync(path.join(dirname(import.meta), '../keys/auth/pub.key'));
  const { token } = req;
  const { models } = req.context;

  if (!token) return res.status(401).json({ message: req.t('TOKEN_NOT_FOUND') });

  let decoded = null;
  try {
    decoded = jwt.verify(token, pubKey);
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    });
  }

  if (!await models.Jwt.exists({ token })) {
    return res.status(401).json({ message: req.t('NOT_AUTHENTICATED') });
  }

  const user = await models.User.findById(decoded.userId);
  if (!user) return res.status(401).json({ message: req.t('USER_NOT_FOUND') });

  if (checkAdmin) {
    if (!user.admin) return res.status(403).json({ message: req.t('NO_PERMISSION') });
  }

  req.user = user;

  return next();
};

export default authenticate;
