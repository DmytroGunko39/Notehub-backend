import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(createHttpError(400, message));
    }

    req.body = value;
    next();
  };
};
