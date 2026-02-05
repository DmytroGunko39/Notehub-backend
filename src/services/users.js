import bcrypt from 'bcrypt';
import UsersCollection from '../db/models/user.js';

export const getUserById = async (userId) => {
  return await UsersCollection.findById(userId);
};

export const updateUser = async (userId, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const user = await UsersCollection.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  return user;
};
