const { client } = require('../db');
const jwt = require('jsonwebtoken')
const router = require('express').Router();
const { getUserById } = require('../db/users')

router.use('/', async (req, res, next) => {
  const prefix = 'Bearer '
  const auth = req.header('Authorization')
  if (!auth) {
    next()
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length)
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET)
      if (id) {
        req.user = await getUserById(id)
        next()
      }
    } catch ({ name, message }) {
      next({ name, message })
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`
    })
  }
})

router.get('/health', async (req, res, next) => {
  try {
    const uptime = process.uptime();

    const {
      rows: [dbConnection],
    } = await client.query(`SELECT NOW();`);

    const currentTime = new Date();

    const lastRestart = new Intl.DateTimeFormat('en', {
      timestyle: 'long',
      dateStyle: 'long',
      timeZone: 'America/New_York',
    }).format(currentTime - uptime * 1000);

    res.send({
      message: 'The api is healthy!',
      uptime,
      dbConnection,
      currentTime,
      lastRestart,
    });
  } catch (error) {
    next(error);
  }
});

//api/users
router.use('/users', require('./users'));

//api/products
router.use('/products', require('./products'))

//api/artists
router.use('/artists', require('./artists'))

router.use("/*", (error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
})

module.exports = router;
