////////////////////
//  Dependencies  //
////////////////////
require('dotenv').config(); // make env variables available
const express = require('express');
const middleware = require('./utils/middleware');
const FoodDiaryRouter = require('./controllers/foodDiary');
const UserRouter = require('./controllers/user');
const FoodRouter = require('./controllers/food');
const ClientRouter = require('./controllers/client');
const User = require('./models/user');
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require('liquid-express-views')(express());

middleware(app);

////////////////////
//    Routes      //
////////////////////

app.use('/auth', UserRouter);
app.use('/foodDiary', FoodDiaryRouter);
app.use('/food', FoodRouter);
app.use('/client', ClientRouter);

app.get('/', (req, res) => {
  const { username, userId, loggedIn } = req.session;
  res.render('home.liquid', { loggedIn, username, userId });
});

app.get('/error', (req, res) => {
  const error = req.query.error || 'This Page Does Not Exist';
  const { username, loggedIn, userId } = req.session;
  res.render('error.liquid', { error, username, loggedIn, userId });
});

// if page is not found, send to error page
app.all('*', (req, res) => {
  res.redirect('/error');
});

//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
