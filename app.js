const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config()

const booksRoutes = require ('./routes/books')
const userRoutes  = require ('./routes/user')
const path = require('path');

console.log(process.env.PORT)

mongoose.connect(process.env.mongodb)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cors());

app.use(bodyParser.json());

app.use ('/api/books', booksRoutes)
app.use ('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;