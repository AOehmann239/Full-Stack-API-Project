// Import Dependencies
const express = require('express');
const Food = require('../models/food');
const fetch = require('node-fetch');
const req = require('express/lib/request');
const ApplicationID = process.env.ApplicationID;
const ApplicationKey = process.env.ApplicationKey;

// Create router
const router = express.Router();
let foodArray = [];

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
// router.get('/', (req, res) => {
//   res.render('index');
// });
router.get('/new', (req, res) => {
  const username = req.session.username;
  const loggedIn = req.session.loggedIn;
  res.render('foods/new', { username, loggedIn });
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
let foodName = '';
let protein = '';
let fats = '';
let carbs = '';
//
router.post('/', (req, res) => {
  req.body.owner = req.session.userId;
  const foodSearch = req.body.foodSearch;
  const amount = req.body.amountEntered;

  const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${ApplicationID}&app_key=${ApplicationKey}&ingr=${foodSearch}&nutrition-type=logging`;
  fetch(url)
    .then((responseData) => {
      return responseData.json();
    })
    // parse out what data you want from the json data
    .then((jsonData) => {
      console.log(jsonData);
      foodName = jsonData.text;
      protein = jsonData.parsed[0].food.nutrients.PROCNT;
      fats = jsonData.parsed[0].food.nutrients.FAT;
      carbs = jsonData.parsed[0].food.nutrients.CHOCDF;
      let amount = req.body.amountEntered;
      //   console.log(foodName);
      //   console.log(protein);
      //   console.log(fats);
      //   console.log(carbs);
      res.render('foods/show', {
        foodName,
        protein,
        fats,
        carbs,
        amount,
      });
    });
});
//add the info for the food to the data of saved foods
router.post('/add', (req, res) => {
  req.body.owner = req.session.userId;
  //   req.body.foodName = foodName;
  //   req.body.protein = protein;
  //   req.body.fats = fats;
  //   req.body.carbs = carbs;
  console.log('this is the new food', req.body);
  Food.create(req.body)
    .then((food) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.json({ err });
    });
});

// index that shows only the user's fruits
router.get('/mine', (req, res) => {
  // find the fruits
  Food.find({ owner: req.session.userId })
    // then render a template AFTER they're found
    .then((foods) => {
      // console.log(fruits)
      const username = req.session.username;
      const loggedIn = req.session.loggedIn;

      res.render('food/index', { fruits, username, loggedIn });
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
  const foodId = req.params.id;
  Food.findById(foodId)
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

  Food.findByIdAndUpdate(foodId, req.body, { new: true })
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
  Food.findById(foodId)
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
  Food.findByIdAndRemove(foodId)
    .then((food) => {
      res.redirect('/foodDiaryEntries');
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

// Export the Router
module.exports = router;
