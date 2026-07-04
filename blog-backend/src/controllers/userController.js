import Tag from '../models/Tag.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, avatar, bio } = req.body;
  user.name = name || user.name;
  user.avatar = avatar || user.avatar;
  user.bio = bio || user.bio;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    bio: updatedUser.bio,
    role: updatedUser.role,
  });
};

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { oldPassword, newPassword } = req.body;
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

export const getTagsForUsers = async (req, res) => {
  try {
    const tags = await Tag.find().sort("name"); 
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tags" });
  }
};
