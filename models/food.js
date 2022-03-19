// import dependencies
const mongoose = require('./connection');

// import user model for populate
const User = require('./user');

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose;

const foodSchema = new Schema(
  {
    foodName: { type: String, required: true },
    protein: { type: Number, required: true },
    fats: { type: Number, required: true },
    carbs: { type: Number, required: true },
    amount: { type: Number, required: true },
    owner: {
      type: Schema.Types.ObjectID,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Food = model('Food', foodSchema);

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Food;
