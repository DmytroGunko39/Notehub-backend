import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.log('ERROR OBJECT:', err);
  console.log('isHttpError:', isHttpError(err));
  console.log('statusCode:', err.statusCode);

  if (isHttpError(err)) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      data: err,
    });
    return;
  }
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};
