import Joi from 'joi';

export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).required(),
  tag: Joi.string().max(50).allow(null, ''),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  content: Joi.string().min(1),
  tag: Joi.string().max(50).allow(null, ''),
}).min(1);
