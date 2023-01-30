const router = require('express').Router();
const {
  createCart,
  getCartByUserId,
  clearCart,
  removeProductFromCart,
  editProductQuantities,
  addProductToCart
} = require('../db/cart')
const { createUser } = require('../db/users')
const { completeOrder } = require('../db/orders')


// Get user cart
router.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId
  
  try {
    if (!req.user) {
      next({
        name: 'AuthorizationError',
        message: 'Must be logged in to view cart'
      })
    } else { 
      if (userId != req.user.id) {
      next({
        name: 'UnauthorizedUserError',
        message: 'You can not view another users cart'
      }) 
    } else {
    const cart = await getCartByUserId(userId);
    res.send(cart);}
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
})


//Add item to cart
router.post("/:userId/:productId", async (req, res, next) => {
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
    debugger
    const addedProduct = await addProductToCart({ orderId: cart.id, productId: req.params.productId, quantity: req.body.quantity })
    res.send(addedProduct);
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


//Purchase cart

router.post('/purchase', async (req, res, next) => {
  try {
    const { email, products } = req.body
    let user
    debugger
    //if no user, creates user and cart
    if (!req.user) {
      user = await createUser({ email: email })
    } else {
      user = req.user
    }
    const cart = await getCartByUserId(user.id)
    if (products) {
      await Promise.all(products.map(async (product) => {
        await addProductToCart({ orderId: cart.id, productId: product.id, quantity: product.quantity })
      }))
    }
    const completedOrder = await completeOrder(user.id, cart.id)
    console.log(completedOrder)
    res.send(completedOrder)
  } catch ({ name, message }) {
    next({ name, message });
  }
})
//adds products from state/storage to new cart
//run purchase cart func'






router.use("/*", (error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
})

module.exports = router