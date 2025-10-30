import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (you'll need to implement User model)
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    res.status(201).json({ message: 'User registered successfully', user: { name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // For now, return success (implement proper authentication later)
    const token = jwt.sign(
      { userId: '12345', email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;