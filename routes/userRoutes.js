const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user-model');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      cryptocurrency: req.body.cryptocurrency,
      password: hashedPassword,
      emailNotifications: req.body.emailNotifications || false,
      agreeTerms: req.body.agreeTerms
    });
    
    const savedUser = await newUser.save();
    res.status(201).json({message: "User register successfully.", result: {
        first_name: savedUser?.firstName,
        last_name: savedUser?.lastName,
        email: savedUser?.email,
    }});
  } catch (err) {
    res.status(500).json({ error: "Could not register user" });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Invalid credentials' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    
      res.status(200).json({message: "User Login successfully.", result: {
        first_name: user?.firstName,
        last_name: user?.lastName,
        email: user?.email,
    }});
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;
