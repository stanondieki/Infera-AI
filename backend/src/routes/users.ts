import express from 'express';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Mock user data
    const user = {
      id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      skills: ['Python', 'JavaScript', 'Machine Learning'],
      projects: 5,
      totalEarnings: 2500,
      rating: 4.8,
      joinDate: '2024-01-15'
    };

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, skills, bio } = req.body;

    // Mock update
    res.json({ 
      message: 'Profile updated successfully',
      user: { name, skills, bio }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;