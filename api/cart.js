const router = require('express').Router();
require('dotenv').config()
const {
  createCart,
  getCartByUserId,
  clearCart,
  removeProductFromCart,
  editProductQuantity,
  addProductToCart,
  createUser,
  completeOrder,
  getProductsByOrderId
} = require('../db')

// Stripe with public sample test API key
// REMOVE BEFORE PRODUCTION
const stripe = require("stripe")(process.env.STRIPE_SK)


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
        res.send(cart);
      }
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
    } else {
      if (req.user.id === cart.userId || req.user.admin) {
        console.log("for some reason we are running this too")
        const deletedCart = await clearCart(cart.id)
        res.send(deletedCart);
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You can not edit another users cart'
        })
      }
    }
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
    const editedProducts = await editProductQuantity(req.body)
    res.send(editedProducts);
  } catch ({ name, message }) {
    next({ name, message });
  }
})

//Checkout cart

router.post('/checkout', async (req, res, next) => {
  try {

  } catch ({ name, message }) {
    next({ name, message })
  }
}

)

//Purchase cart

router.post('/purchase', async (req, res, next) => {
  debugger
  try {
    const { email, products } = req.body
    let user
    //if no user, creates user and cart
    if (!req.user) {
      user = await createUser({ email: email })
      if (products) {
        const cart = await getCartByUserId(user.id)
        await Promise.all(products.map(async (product) => {
          await addProductToCart({ orderId: cart.id, productId: product.id, quantity: product.quantity })
        }))
      }
    } else {
      user = req.user
    }
    const cart = await getCartByUserId(user.id)
    const completedOrder = await completeOrder(user.id, cart.id)
    console.log(completedOrder)
    res.send(completedOrder)
  } catch ({ name, message }) {
    next({ name, message });
  }
})
//adds products from state/storage to new cart
//run purchase cart func'

// -------STRIPE-------
// Tracks the user's payment lifecycle, ensures secure payments and only charges the user once.
router.post('/create-payment-intent', async (req, res) => {
  let cart
  debugger
  //check if logged in. if not make dummy user and load cart
  if (!req.user) {
    const { products } = req.body
    const user = await createUser('')
    cart = await getCartByUserId(user.id)
    await Promise.all(products.map(async (item) => {
      await addProductToCart({
        orderId: cart.id,
        productId: item.id,
        quantity: item.quantity
      })
    }))
  } else {
    cart = await getCartByUserId(req.user.id)
  }

  //add prices from db
  const calculateOrderAmount = async (cartId) => {
    const products = await getProductsByOrderId(cartId)
    let total = products.reduce((acc, current) => {
      return acc + (+current.price.slice(1) * current.quantity)
    }, 0)
    total *= 100
    return total
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: await calculateOrderAmount(cart.id),
    currency: 'usd',
    payment_method_types: ['card']
    /* automatic_payment_methods: {
      enabled: true,
    } */
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
  })
})





router.use("/*", (error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
})

module.exports = router