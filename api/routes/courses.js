import express from 'express';
import mongoose from 'mongoose';
import expressGraphQL from 'express-graphql';
import { root, schemas } from '../graphql/index.js';
import authenticate from '../utils/authenticateMiddleware.js';

const { Router } = express;
const router = Router();
const { graphqlHTTP } = expressGraphQL;

router.get('/', authenticate(), graphqlHTTP({
  schema: schemas.CoursesSchema,
  rootValue: root.CoursesRoot,
}));

router.post('/', authenticate(), async (req, res) => {
  const { user } = req;
  const { models } = req.context;
  const {
    name,
  } = req.body;

  if (!name || name.trim() === 0) return res.status(400).json({ message: req.t('INVALID_NAME') });

  const courseModel = models.Course({
    name,
    createdBy: user.id,
  });
  const courseSaved = await courseModel.save();

  return res.json({
    course: courseSaved,
  });
});

router.put('/', authenticate(), async (req, res) => {
  const { models } = req.context;
  const {
    courseId,
    name,
  } = req.body;

  let courseModel = null;
  if (mongoose.Types.ObjectId.isValid(courseId)) {
    courseModel = await models.Course.findById(courseId);
  }

  if (!courseModel) return res.status(400).json({ message: req.t('COURSE_NOT_FOUND') });

  const updateModel = {};
  if (name !== undefined) {
    if (!name || name.trim() === 0) return res.status(400).json({ message: req.t('INVALID_NAME') });

    updateModel.name = name;
  }

  const courseUpdate = await courseModel.updateOne(updateModel);
  const courseUpdated = await models.Course.findById(courseId);

  return res.json({
    course: courseUpdated,
    update: courseUpdate,
  });
});

router.delete('/', authenticate(), async (req, res) => {
  const { models } = req.context;
  const { courseId } = req.body;

  let courseModel = null;
  if (mongoose.Types.ObjectId.isValid(courseId)) {
    courseModel = await models.Course.findById(courseId);
  }

  if (!courseModel) return res.status(400).json({ message: req.t('COURSE_NOT_FOUND') });

  const deleted = await courseModel.remove();

  return res.json({
    deleted,
  });
});

export default router;
