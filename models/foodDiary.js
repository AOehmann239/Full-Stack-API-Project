// import dependencies
const mongoose = require('./connection');

// import user model for populate
const User = require('./user');

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose;

const foodDiarySchema = new Schema(
  {
    dateEntered: { type: Date, required: true },
    foods: [{ type: Schema.Types.ObjectID, ref: 'Food' }],

    owner: {
      type: Schema.Types.ObjectID,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const FoodDiaryEntry = model('FoodDiaryEntry', foodDiarySchema);

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = FoodDiaryEntry;
