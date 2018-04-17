const express = require("express");
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Load User Model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ message: "Hello world!" }));

// @route POST api/users/register
// @desc Register route
// @access Public
router.post("/register", (req, res) => {
  // Find User By Email
  User.findOne({
    email: req.body.email
  }).then(user => {
    // Check For User
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      // Grab Avatar
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      // Create New User
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // Create Password Hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) { throw err; }
          newUser.password = hash; // Update password with hash
          newUser.save()
            .then(user => res.json(user))
            .catch(err => err);
        })
      });

    }
  });
});

// @route POST api/users/login
// @desc Login route / Returning JWT Token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find User By Email
  User.findOne({
    email: req.body.email
  }).then(user => {
    // Check For User
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: 'Success' });
      } else {
        return res.status(404).json({ password: 'Password incorrect' });
      }
    });
  });
});

module.exports = router;
