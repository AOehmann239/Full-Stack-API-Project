// Import Dependencies
const express = require('express');
const FoodDiaryEntry = require('../models/foodDiary');
const fetch = require('node-fetch');
const req = require('express/lib/request');
const ApplicationID = process.env.ApplicationID;
const ApplicationKey = process.env.ApplicationKey;

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

// index ALL
router.get('/', (req, res) => {
  res.render('index');
});

// // index that shows only the user's food diary entries
// router.get('/mine', (req, res) => {
//   // destructure user info from req.session
//   const { username, userId, loggedIn } = req.session;
//   FoodDiary.find({ owner: userId })
//     .then((foodEntries) => {
//       res.render('foodDiaryEntries/index', { foodEntries, username, loggedIn });
//     })
//     .catch((error) => {
//       res.redirect(`/error?error=${error}`);
//     });
// });

// // new route -> GET route that renders our page with the form
// router.get('/new', (req, res) => {
//   const { username, userId, loggedIn } = req.session;
//   res.render('foodDiaryEntries/new', { username, loggedIn });
// });

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
  req.body.owner = req.session.userId;
  const foodSearch = req.body.foodSearch;
  let foodName = '';
  let protein = '';
  let fats = '';
  let carbs = '';
  const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${ApplicationID}&app_key=${ApplicationKey}&ingr=${foodSearch}&nutrition-type=logging`;
  fetch(url)
    .then((responseData) => {
      return responseData.json();
    })
    // parse out what data you want from the json data
    .then((jsonData) => {
      //   let foodData = jsonData;
      foodName = jsonData.text;
      protein = jsonData.parsed[0].food.nutrients.PROCNT;
      fats = jsonData.parsed[0].food.nutrients.FAT;
      carbs = jsonData.parsed[0].food.nutrients.CHOCDF;
      console.log(foodName);
      console.log(protein);
      console.log(fats);
      console.log(carbs);
    });
});

// req.body.foodName = foodName
// req.body.protein = protein

//   Food.create(req.body)
//     .then((food) => {
//       console.log('this was returned from create', food);
//       res.redirect('/foodDiaryEntries');
//     })
//     .catch((error) => {
//       res.redirect(`/error?error=${error}`);
//     });

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
  // we need to get the id
  const foodId = req.params.id;
  FoodDiaryEntry.findById(foodId)
    .then((food) => {
      res.render('foodDiaryEntries/edit', { food });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

// update route
router.put('/:id', (req, res) => {
  const foodId = req.params.id;
  req.body.ready = req.body.ready === 'on' ? true : false;

  FoodDiaryEntry.findByIdAndUpdate(foodId, req.body, { new: true })
    .then((food) => {
      res.redirect(`/foodDiaryEntries/${food.id}`);
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

// show route
router.get('/:id', (req, res) => {
  const foodId = req.params.id;
  FoodDiaryEntry.findById(foodId)
    .then((food) => {
      const { username, loggedIn, userId } = req.session;
      res.render('foodDiaryEntries/show', { food, username, loggedIn, userId });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

// delete route
router.delete('/:id', (req, res) => {
  const foodId = req.params.id;
  FoodDiaryEntry.findByIdAndRemove(foodId)
    .then((food) => {
      res.redirect('/foodDiaryEntries');
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

// Export the Router
module.exports = router;