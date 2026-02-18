import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  if (isHttpError(err)) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
  });
};
