const { getUserByUsername, createUser, getUserByEmail, updateUser, getAllUsers, getUserById, deleteUser } = require('../db');
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
    if (!user) {
      res.status(401)
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
          user: { id: user.id, username: user.username, isArtist: user.is_artist }
        });
      } else {
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


// PATCH api/users/:userId
router.patch('/:userId', async (req, res, next) => {

  const userId = req.params.userId
  console.log(req.user)
  try {
    if (req.user?.admin || req.user?.id === userId) {
      if (!req.user?.admin && req.body.admin) {
        next({
          name: 'Unauthorized Error',
          message: 'You need to be an Authorized User',
          error: 'UnauthorizedError'
        })
      } else {
        const updatedUser = await updateUser(userId, req.body)
        console.log(updatedUser)
        res.send(updatedUser)
      }
    } else {
      next({
        name: 'Unauthorized Error',
        message: 'You need to be an Authorized User',
        error: 'UnauthorizedError'
      })
    }
  } catch (error) {
    console.error(error)
    next(error);
  }
})

router.delete('/:userId', async (req, res, next) => {
  const userId = req.params.userId
  try {
    if (req.user.admin || req.user.id === userId) {
      console.log("before deletedUsser")
      const deletedUser = await deleteUser(userId)
      console.log("after deletedUsser", deletedUser)
      res.send(deletedUser);
    } else {
      res.status(403)
      next({
        name: "UnauthorizedError",
        message: "You must be owner",
        error: "UnauthorizedError"
      })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router;
