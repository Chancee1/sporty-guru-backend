const express = require('express');
const ejs = require('ejs');
const path = require('path');
require("dotenv").config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true, useNewUrlParser: true })
  .then(result => {
      console.log('CONNECTED TO DATABASE');
      app.listen(process.env.PORT);
  }).catch(err=> console.log(err))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

const userController = require('./controllers/user.controller');
app.use('/',userController);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

