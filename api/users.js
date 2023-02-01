const { getUserByUsername, createUser, getUserByEmail, updateUser, getAllUsers, getUserById } = require('../db');
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
        user
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

    delete user.password
    res.send({
      message: "Thank you for signing up!",
      token: token,
      user
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

// GET /api/users/me
router.get('/me', async (req, res, next) => {
  try {
    if (req.user) {
      res.send(req.user)
    } else {
      next({
        name: 'UnauthorizedError',
        message: 'You must have a valid token to view this user',
        error: 'UnauthorizedError'
      })
    }

  } catch (error) {
    next(error)
  }
})

// PATCH api/users/:userId
router.patch('/:userId', async (req, res, next) => {
  const userId = req.params.userId
  console.log("this is req.user.admin in api", req.user.admin)
  try {
    if(req.user.admin) {
        const updatedUser = await updateUser(userId, req.body)
        console.log(updatedUser)
        res.send(updatedUser)
      
    } else {
      next({
        name: 'Unauthorized Error',
        message: 'You need to be an Admin',
        error: 'UnauthorizedError'
      })
    }
  } catch (error) {
    next(error);
  }
})

router.use("/*", (error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
})

module.exports = router;
