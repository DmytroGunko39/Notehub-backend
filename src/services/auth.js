import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import SessionsCollection from '../db/models/session.js';
import { createTokens } from '../utils/createTokens.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
  RESET_PASSWORD_TOKEN_LIFETIME,
} from '../constants/index.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  const { accessToken, refreshToken } = createTokens();

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  return { user, session };
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.findByIdAndDelete(sessionId);
};

export const refreshSession = async (refreshToken) => {
  const session = await SessionsCollection.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await SessionsCollection.findByIdAndDelete(session._id);
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await UsersCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  await SessionsCollection.findByIdAndDelete(session._id);

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    createTokens();

  const newSession = await SessionsCollection.create({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  return { user, session: newSession };
};

export const requestPasswordReset = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(
    Date.now() + RESET_PASSWORD_TOKEN_LIFETIME,
  );
  await user.save();

  const frontendUrl = getEnvVar('FRONTEND_URL', 'http://localhost:3000');
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await UsersCollection.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createHttpError(400, 'Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  await SessionsCollection.deleteMany({ userId: user._id });
};

export const getSessionByAccessToken = async (accessToken) => {
  const session = await SessionsCollection.findOne({ accessToken });
  if (!session) {
    return null;
  }

  if (new Date() > session.accessTokenValidUntil) {
    return null;
  }

  return session;
};
