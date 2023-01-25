const { getUserByUsername, createUser } = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const router = require('express').Router();

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
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
        { id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1W" });
      res.send({
        message: "You're Logged in!",
        token,
        user: { id: user.id, username: user.username, isArtist: user.is_artist }
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

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  try {
    const {
      email,
      username,
      password,
      fullname,
      profileImg,
      location,
      isArtist } = req.body;
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UsernameTaken",
        message: `This username ${_user.username} is already taken.`
      })
    }

    if (password.length < 8) {
      next({
        name: "InsufficientPassword",
        message: "Password is too short!"
      })
    }

    const user = await createUser({
      email,
      username,
      password,
      fullname,
      profileImg,
      location,
      isArtist
    });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1W" });

    res.send({
      message: "Thank you for signing up!",
      token: token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    next(error);
  }
})



//api/users/:userId/cart
router.use('/:userId/cart', require('./cart'))

router.use("/*", (error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
})

module.exports = router;
