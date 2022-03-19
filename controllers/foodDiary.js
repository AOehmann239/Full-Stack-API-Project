// Import Dependencies
const express = require('express');
const FoodDiaryEntry = require('../models/foodDiary');

// Create router
const router = express.Router();

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted.
router.use((req, res, next) => {
  // checking the loggedIn boolean of our session
  if (req.session.loggedIn) {
    // if they're logged in, go to the next thing(thats the controller)
    next();
  } else {
    // if they're not logged in, send them to the login page
    res.redirect('/auth/login');
  }
});

// Routes

router.get('/new', (req, res) => {
  const username = req.session.username;
  const loggedIn = req.session.loggedIn;
  res.render('foodDiary/new', { username, loggedIn });
});

router.post('/', (req, res) => {
  req.body.owner = req.session.userId;
  const dateEntered = req.body.dateEntered;
  res.render('foodDiary/show', {
    dateEntered,
  });
});

router.post('/add', (req, res) => {
  req.body.owner = req.session.userId;
  console.log('this is the new Diary Entry', req.body);
  FoodDiaryEntry.create(req.body)
    .then((food) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.json({ err });
    });
});
// Export the Router
module.exports = router;
