import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (paramName = 'noteId') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.isValidObjectId(id)) {
      return next(createHttpError(400, `Invalid ${paramName} format`));
    }

    next();
  };
};
