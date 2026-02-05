import createHttpError from 'http-errors';
import { getSessionByAccessToken } from '../services/auth.js';
import UsersCollection from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Access token required'));
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const session = await getSessionByAccessToken(accessToken);
    if (!session) {
      return next(createHttpError(401, 'Invalid or expired access token'));
    }

    const user = await UsersCollection.findById(session.userId);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};
