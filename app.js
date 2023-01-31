const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors")
const morgan = require('morgan');
const { client } = require('./db');
client.connect();

// Stripe with public sample test API key
// REMOVE BEFORE PRODUCTION
const stripe = require("stripe")('sk_test_4eC39HqLyjWDarjtT1zdp7dc')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client', 'dist')));

// -------STRIPE-------


// Tracks the user's payment lifecycle, ensures secure payments and only charges the user once.
app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body
  
  const calculateOrderAmount = (items) => {
    // func for determining order amount to prevent manipulation on frontend
    // call db to return total for cart.
    return 1400
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
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

// -------API-------
app.use('/api', require('./api'));

app.use((req, res, next) => {
  try {
    res.status(404).send("Sorry, can't find that! :/");
  } catch (error) {
    console.errror(error);
    throw error;
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

module.exports = { app };
