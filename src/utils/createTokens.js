import crypto from 'node:crypto';

export const createTokens = () => {
  const accessToken = crypto.randomBytes(32).toString('base64');
  const refreshToken = crypto.randomBytes(32).toString('base64');
  return { accessToken, refreshToken };
};
