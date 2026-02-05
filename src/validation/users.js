import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(100),
}).min(1);
