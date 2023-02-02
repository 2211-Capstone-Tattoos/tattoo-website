const router = require('express').Router();
const { getOrdersByUserId } = require('../db/orders')

router.get("/:userId", async (req, res, next) => {
  debugger
  try {
    const userId = req.params.userId
    if (!req.user) {
      res.status(401)
      next({
        name: 'AuthorizationError',
        message: 'Must be logged in to view orders'
      })
    } else if (userId != req.user.id) {
      res.status(403)
      next({
        name: 'UnauthorizedUserError',
        message: 'You can not view another users orders'
      })
    } else {
      const allOrders = await getOrdersByUserId(userId);
      res.send(allOrders);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
})


router.use("/*", (error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
})

module.exports = router