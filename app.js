const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors")
const morgan = require('morgan');
const { client } = require('./db');

client.connect();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client', 'dist')));



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
