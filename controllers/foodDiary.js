// Import Dependencies
const express = require('express');
const FoodDiaryEntry = require('../models/foodDiary');
const Food = require('../models/food');
const req = require('express/lib/request');

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

//add the info for the diary entry to the data of saved entries
router.post('/add', (req, res) => {
  req.body.owner = req.session.userId;
  // req.body.foodName = foodName;
  // req.body.protein = protein;
  // req.body.fats = fats;
  // req.body.carbs = carbs;
  console.log('this is the new diary entry', req.body);
  FoodDiaryEntry.create(req.body)
    .then((entry) => {
      //console.log('this is the food', food);
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.json({ err });
    });
});

// index that shows only the user's foodDiary entries
router.get('/mine', (req, res) => {
  // find the foods
  FoodDiaryEntry.find({ owner: req.session.userId })
    // then render a template AFTER they're found
    .then((foodDiaryEntries) => {
      //console.log('these are the foods', foods);
      const username = req.session.username;
      const loggedIn = req.session.loggedIn;

      res.render('foodDiary/mine', { foodDiaryEntries, username, loggedIn });
    })
    // show an error if there is one
    .catch((error) => {
      console.log(error);
      res.json({ error });
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

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
  // we need to get the id
  const entryId = req.params.id;
  FoodDiaryEntry.findById(entryId)
    .then((foodDiaryEntry) => {
      res.render('foodDiary/edit', { foodDiaryEntry });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

// update route -> sends a put request to our database
router.put('/:id', (req, res) => {
  // get the id
  const entryId = req.params.id;
  // tell mongoose to update the food
  FoodDiaryEntry.findByIdAndUpdate(entryId, req.body, { new: true })
    .then((foodDiaryEntry) => {
      res.redirect(`/foodDiaryEntry/${foodDiaryEntry.id}`);
    })
    .catch((error) => res.json(error));
});

// SHOW ROUTE FOR INDIVIDUAL FOOD ENTERED BEFORE SAVING TO DB
router.get('/:id', (req, res) => {
  // first, we need to get the id
  const entryId = req.params.id;
  // then we can find a fruit by its id
  FoodDiaryEntry.findById(entryId)
    .then((foodDiaryEntry) => {
      console.log('the entry we got\n', foodDiaryEntry);
      const username = req.session.username;
      const loggedIn = req.session.loggedIn;
      const userId = req.session.userId;
      res.render('foodDiary/show', {
        foodDiaryEntry,
        username,
        loggedIn,
        userId,
        // amount,
      });
    })
    // if there is an error, show that instead
    .catch((err) => {
      console.log(err);
      res.json({ err });
    });
});

// delete route
router.delete('/:id', (req, res) => {
  const entryId = req.params.id;
  FoodDiaryEntry.findByIdAndRemove(entryId)
    .then((foodDiaryEntry) => {
      res.redirect('/foodDiary/mine');
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});
// Export the Router
module.exports = router;
