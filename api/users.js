const { getUserByUsername, createUser, getUserByEmail, updateUser, getAllUsers, getUserById, deleteUser } = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const router = require('express').Router();

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  debugger
  try {
    let { username, password } = req.body;
    username = username.toLowerCase()
    if (!username || !password) {
      res.status(401)
      next({
        name: 'Missing Credentials',
        message: 'Please provide both username and password',
      });
    }
    let user = await getUserByUsername(username);
    if (!user) {
      user = await getUserByEmail(username)
    }
    if (!user) {
      res.status(404)
      next({
        name: 'UserDoesntExistError',
        message: 'User does not exist'
      })
    } else {
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
        res.status(401)
        next({
          name: 'Incorrect Credentials',
          message: 'Username or Password is incorrect'
        })
      }
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  debugger
  try {
    const {
      email,
      username,
      password,
      location,
      isArtist,
      admin
    } = req.body;
    let user
    let _user = await getUserByUsername(username);
    if (!_user) {
      _user = await getUserByEmail(email)
    }
    if (_user) {
      if (_user.password) {
        res.status(401)
        next({
          name: "UsernameTaken",
          message: `This username ${_user.username} is already taken.`
        })
      } else {
        debugger
        if (password.length < 8) {
          res.status(401)
          next({
            name: "InsufficientPassword",
            message: "Password is too short!"
          })
        }
        user = await updateUser(_user.id, req.body)
      }
    } else {
      if (password.length < 8) {
        res.status(401)
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

// PATCH api/users/:userId
router.patch('/:userId', async (req, res, next) => {

  const userId = req.params.userId
  try {
    if (req.user?.admin || req.user?.id === userId) {
      if (!req.user?.admin && req.body.admin) {
        res.status(403)
        next({
          name: 'Unauthorized Error',
          message: 'You need to be an Authorized User',
          error: 'UnauthorizedError'
        })
      } else {
        const updatedUser = await updateUser(userId, req.body)
        res.send(updatedUser)
      }
    } else {
      res.status(403)
      next({
        name: 'Unauthorized Error',
        message: 'You must be the owner',
        error: 'UnauthorizedError'
      })
    }
  } catch (error) {
    console.error(error)
    next(error);
  }
})

//Delete user

router.delete('/:userId', async (req, res, next) => {
  try {

    const user = await getUserById(req.params.userId)
    if (user.admin) {
      res.status(400)
      next({
        name: 'CannotDeleteUser',
        message: 'Can not delete a user with admin privileges',
        error: 'CannotDeleteUser'
      })
    } else {
      const deletedUser = await deleteUser(user.id)
      res.send(deletedUser)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router;
