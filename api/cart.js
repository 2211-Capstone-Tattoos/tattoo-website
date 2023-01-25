const router = require('express').Router();
const {
  createCart,
  getCartByUserId
} = require('../db/cart')

router.get("/:userId", async (req, res, next) => {
  debugger
  const userId = req.params.userId
  if (!req.user) {
    next({
      name: 'AuthorizationError',
      message: 'Must be logged in to view cart'
    })
  }
  if (userId != req.user.id) {
    next({
      name: 'UnauthorizedUserError',
      message: 'You can not view another users cart'
    })
  }
  try {
    const cart = await getCartByUserId(userId);
    res.send(cart);
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

module.exports = router