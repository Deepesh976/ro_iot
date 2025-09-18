const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { user, phoneNo, password, location } = req.body;

    if (!user?.trim() || !phoneNo?.trim() || !password || !location?.trim()) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ phoneNo });
    if (existingUser) {
      return res.status(409).json({ message: 'Phone number already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      user: user.trim(),
      phoneNo: phoneNo.trim(),
      password: hashedPassword,
      location: location.trim(),
      uuid: uuidv4(), // Generate unique UUID
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', uuid: newUser.uuid });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { phoneNo, password } = req.body;

    if (!phoneNo || !password) {
      return res.status(400).json({ message: 'Phone number and password are required' });
    }

    const user = await User.findOne({ phoneNo });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, phoneNo: user.phoneNo },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get all users (excluding passwords)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get a single user by ID
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Fetch User Error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { user, phoneNo, password, location } = req.body;

    const updateFields = {
      ...(user && { user: user.trim() }),
      ...(phoneNo && { phoneNo: phoneNo.trim() }),
      ...(location && { location: location.trim() }),
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      select: '-password'
    });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
