// Import Dependencies
const express = require('express');
const FoodDiaryEntry = require('../models/foodDiary');
const Food = require('../models/food');
const Client = require('../models/client');
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
  res.render('clients/new', { username, loggedIn });
});

router.post('/', (req, res) => {
  const clientAge = req.body.ageEntered;
  const clientHeight = req.body.heightEntered;
  const clientWeight = req.body.weightEntered;

  const totalCals = 10 * clientWeight + 6.25 * clientHeight - 5 * clientAge + 5;
  // the client values for prot fat car are in grams
  const clientProtein = clientWeight.value; // does this give you the value without changing the property client weight?
  const clientFats = clientWeight.value * 0.4;
  const clientCarbs =
    (totalCals - clientProtein.value * 4 - clientFats.value * 9) * 4;
});

//add the info for the diary entry to the data of saved entries
router.post('/add', (req, res) => {
  req.body.owner = req.session.userId;
  // req.body.foodName = foodName;
  // req.body.protein = protein;
  // req.body.fats = fats;
  // req.body.carbs = carbs;
  console.log('this is the new bio setup', req.body);
  Client.create(req.body)
    .then((client) => {
      //console.log('this is the client', client);
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.json({ err });
    });
});

// index that shows only the user's bio
router.get('/myBio', (req, res) => {
  // find the foods
  Client.find({ owner: req.session.userId })
    // then render a template AFTER they're found
    .then((client) => {
      //console.log('these are the foods', foods);
      const username = req.session.username;
      const loggedIn = req.session.loggedIn;

      res.render('client/myBio', { client, username, loggedIn });
    })
    // show an error if there is one
    .catch((error) => {
      console.log(error);
      res.json({ error });
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

// //SHOW ROUTE FOR INDIVIDUAL DAY
// router.get('/:id', (req, res) => {
//   // first, we need to get the id
//   const entryId = req.params.id;
//   // then we can find a fruit by its id
//   FoodDiaryEntry.findById(entryId).then((foodDiaryEntry) => {
//     console.log('the entry we got\n', foodDiaryEntry);
//     // console.log('this is all of the my foods', allFoods);
//     const username = req.session.username;
//     const loggedIn = req.session.loggedIn;
//     const userId = req.session.userId;

//     Food.find({ owner: req.session.userId })
//       .then((foods) => {
//         //console.log('these are the foods', foods);
//         res.render('foodDiary/show', {
//           foods,
//           foodDiaryEntry,
//           username,
//           loggedIn,
//           userId,
//         });
//       })
//       // if there is an error, show that instead
//       .catch((err) => {
//         console.log(err);
//         res.json({ err });
//       });
//   });
// });
// update route
router.put('/:id', (req, res) => {
  // get the id
  const entryId = req.params.id;
  req.body.addedToDay = req.body.addedToDay === 'on' ? true : false;
  // tell mongoose to update the food
  FoodDiaryEntry.findByIdAndUpdate(entryId, req.body, { new: true })
    .then((foodDiaryEntry) => {
      // console.log('the updated fruit', fruit);

      res.update(`/foodDiary/${foodDiaryEntry.id}`);
    })
    .catch((error) => res.json(error));
});

// delete route
router.delete('/:id', (req, res) => {
  const entryId = req.params.id;
  Client.findByIdAndRemove(entryId)
    .then((client) => {
      res.redirect('/client/myBio');
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});
// Export the Router
module.exports = router;
