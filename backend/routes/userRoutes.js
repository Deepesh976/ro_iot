const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers, // ✅ Make sure this matches exactly
  getSingleUser,
  updateUser,
  deleteUser
} = require('../controllers/userController'); // ✅ Correct path to your controller

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/all', getAllUsers); // ✅ This line uses imported function
router.get('/:id', getSingleUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
