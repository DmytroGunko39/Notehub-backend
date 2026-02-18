import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';

export const getUserById = async (userId) => {
  return await UsersCollection.findById(userId);
};

export const updateUser = async (userId, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  try {
    const user = await UsersCollection.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Email already in use');
    }
    throw error;
  }
};
