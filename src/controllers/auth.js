import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.js';
import { REFRESH_TOKEN_LIFETIME } from '../constants/index.js';

const setupCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
};

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { user, session } = await loginUser({ email, password });

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const { user, session } = await refreshSession(refreshToken);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Session refreshed successfully',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  await requestPasswordReset(email);

  res.status(200).json({
    status: 200,
    message: 'If the email exists, a password reset link has been sent',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  await resetPassword(token, password);

  res.status(200).json({
    status: 200,
    message: 'Password reset successful',
    data: {},
  });
};
