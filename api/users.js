const { getUserByUsername, createUser, getUserByEmail, updateUser, getAllUsers } = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const router = require('express').Router();

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  debugger
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      next({
        name: 'Missing Credentials',
        message: 'Please provide both username and password',
      });
    }

    let user = await getUserByUsername(username);
    if (!user) {
      user = await getUserByEmail(username)
    }
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
    } = req.body;
    let user
    let _user = await getUserByUsername(username);
    if (!_user) {
      _user = await getUserByEmail(email)
    }
    if (_user) {
      if (_user.password) {
        next({
          name: "UsernameTaken",
          message: `This username ${_user.username} is already taken.`
        })
      } else {
        debugger
        if (password.length < 8) {
          next({
            name: "InsufficientPassword",
            message: "Password is too short!"
          })
        }
        user = await updateUser(_user.id, req.body)
      }
    } else {
      if (password.length < 8) {
        next({
          name: "InsufficientPassword",
          message: "Password is too short!"
        })
      }
      user = await createUser(req.body);
    }

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

// POST /api/users
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    res.send(allUsers)
  } catch (error) {
    next(error)
  }
})

router.use("/*", (error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
})

module.exports = router;
