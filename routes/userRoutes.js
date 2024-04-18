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
        userId: newUser?._id
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
        userId: user?._id
    }});
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });


router.get('/users-record/:id', async (req, res) => {
  try {
    const user = await User.findOne({_id: req?.params?.id});
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } 
      res.status(200).json({user});

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post("/user-update", async(req,res)=>{
  try{
    const { firstName, lastName, email, id } = req.body;
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { firstName, lastName, email } },
    );
    res.status(200).json({message: "User update successfully."})
  }catch(e){
    res.status(500).json({ error: e });
  }
})


router.post("/update-Password", async(req,res)=>{
  try{
    const { id, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: id });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ _id: id }, { password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  }catch(e){
    res.status(500).json({ message: 'Internal server error' });
  }
})
module.exports = router;
