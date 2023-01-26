const router = require('express').Router();
const {
  createCart,
  getCartByUserId,
  clearCart,
  removeProductFromCart,
  editProductQuantities
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
  } catch ({ name, message }) {
    next({ name, message });
  }
})


// Clear Cart
router.delete("/:userId", async (req, res, next) => {
  debugger
  if (!req.user) {
    next({
      name: 'AuthorizationError',
      message: 'Must be logged in to edit cart'
    })
  }
  try {
    const cart = await getCartByUserId(req.params.userId);
    if (!cart) {
      next({
        name: "NotFoundError",
        message: "Oops! There's nothing here!"
      })
    }
    if (req.user.id != cart.userId) {
      next({
        name: 'UnauthorizedUserError',
        message: 'You can not edit another users cart'
      })
    }
    const deletedCart = await clearCart(cart.id)
    res.send(deletedCart);
  } catch ({ name, message }) {
    next({ name, message });
  }
})

// Remove item from cart
router.delete("/:userId/:productId", async (req, res, next) => {
  debugger
  if (!req.user) {
    next({
      name: 'AuthorizationError',
      message: 'Must be logged in to edit cart'
    })
  }
  try {
    const cart = await getCartByUserId(req.params.userId);
    if (!cart) {
      next({
        name: "NotFoundError",
        message: "Oops! There's nothing here!"
      })
    }
    if (req.user.id != cart.userId) {
      next({
        name: 'UnauthorizedUserError',
        message: 'You can not edit another users cart'
      })
    }
    const removedItem = await removeProductFromCart(cart.id, req.params.productId)
    res.send(removedItem);
  } catch ({ name, message }) {
    next({ name, message });
  }
})

// Edit item quantity in cart
router.patch('/:userId', async (req, res, next) => {
  if (!req.user) {
    next({
      name: 'AuthorizationError',
      message: 'Must be logged in to edit cart'
    })
  }
  try {
    const cart = await getCartByUserId(req.params.userId);
    if (!cart) {
      next({
        name: "NotFoundError",
        message: "Oops! There's nothing here!"
      })
    }
    if (req.user.id != cart.userId) {
      next({
        name: 'UnauthorizedUserError',
        message: 'You can not edit another users cart'
      })
    }
    const editedProducts = await editProductQuantities(req.body)
    res.send(editedProducts);
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