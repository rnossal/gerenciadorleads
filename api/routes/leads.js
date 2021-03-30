import express from 'express';
import mongoose from 'mongoose';
import validator from 'validator';
import expressGraphQL from 'express-graphql';
import { root, schemas } from '../graphql/index.js';
import authenticate from '../utils/authenticateMiddleware.js';

const { Router } = express;
const router = Router();
const { graphqlHTTP } = expressGraphQL;

router.get('/', authenticate(), graphqlHTTP({
  schema: schemas.LeadsSchema,
  rootValue: root.LeadsRoot,
}));

router.post('/', authenticate(), async (req, res) => {
  const { user } = req;
  const { models } = req.context;
  const {
    name,
    email,
    phone,
    observations,
  } = req.body;

  if (!name || name.trim() === 0) return res.status(400).json({ message: req.t('INVALID_NAME') });
  if (!email || !validator.isEmail(email)) return res.status(400).json({ message: req.t('INVALID_EMAIL') });
  if (!phone || phone.trim() === 0) return res.status(400).json({ message: req.t('INVALID_PHONE') });

  const leadModel = models.Lead({
    name,
    email,
    phone,
    observations,
    createdBy: user.id,
  });
  const leadSaved = await leadModel.save();

  return res.json({
    lead: leadSaved,
  });
});

router.put('/', authenticate(), async (req, res) => {
  const { models } = req.context;
  const {
    leadId,
    name,
    email,
    phone,
    observations,
  } = req.body;

  let leadModel = null;
  if (mongoose.Types.ObjectId.isValid(leadId)) {
    leadModel = await models.Lead.findById(leadId);
  }

  if (!leadModel) return res.status(400).json({ message: req.t('LEAD_NOT_FOUND') });

  const updateModel = {};
  if (name !== undefined) {
    if (!name || name.trim() === 0) return res.status(400).json({ message: req.t('INVALID_NAME') });

    updateModel.name = name;
  }
  if (email !== undefined) {
    if (!email || !validator.isEmail(email)) return res.status(400).json({ message: req.t('INVALID_EMAIL') });

    updateModel.email = email;
  }
  if (phone !== undefined) {
    if (!phone || phone.trim() === 0) return res.status(400).json({ message: req.t('INVALID_PHONE') });

    updateModel.phone = phone;
  }
  if (observations !== undefined) updateModel.observations = observations;

  const leadUpdate = await leadModel.updateOne(updateModel);
  const leadUpdated = await models.Lead.findById(leadId);

  return res.json({
    lead: leadUpdated,
    update: leadUpdate,
  });
});

router.delete('/', authenticate(), async (req, res) => {
  const { models } = req.context;
  const { leadId } = req.body;

  let leadModel = null;
  if (mongoose.Types.ObjectId.isValid(leadId)) {
    leadModel = await models.Lead.findById(leadId);
  }

  if (!leadModel) return res.status(400).json({ message: req.t('LEAD_NOT_FOUND') });

  const deleted = await leadModel.remove();

  return res.json({
    deleted,
  });
});

export default router;
