import createHttpError from 'http-errors';
import { getUserById, updateUser } from '../services/users.js';

export const getMeController = async (req, res) => {
  const user = await getUserById(req.user._id);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'User profile retrieved successfully',
    data: user,
  });
};

export const updateMeController = async (req, res) => {
  const { name, email, password } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (password !== undefined) updateData.password = password;

  if (Object.keys(updateData).length === 0) {
    throw createHttpError(400, 'No fields to update');
  }

  const user = await updateUser(req.user._id, updateData);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'User profile updated successfully',
    data: user,
  });
};
