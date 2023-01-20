const { getUserByUsername } = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const router = require('express').Router();

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if(!username || !password) {
      next({
        name: 'Missing Credentials',
        message: 'Please provide both username and password',
      });
    }

    const user = await getUserByUsername(username);
    const hashedPassword = user.password
    const match = await bcrypt.compare(password, hashedPassword)
    if (user && match) {
      delete user.password;
      const token = jwt.sign(
        { id: user.id, username: user.username}, process.env.JWT_SECRET);
        res.send({
          message: "You're Logged in!",
          token
        });
    } else {
      next({
        name: 'Incorrect Credentials',
        message: 'Username or Password is incorrect'
      })
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
