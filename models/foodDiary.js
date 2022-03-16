// import dependencies
const mongoose = require('./connection');

// import user model for populate
const User = require('./user');

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose;

const foodDiarySchema = new Schema(
  {
    date: { type: Date, required: true },
    food: { type: String, required: true },
    amount: { type: Number, required: true },
    owner: {
      type: Schema.Types.ObjectID,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const DiaryEntry = model('DiaryEntry', foodDiarySchema);

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = DiaryEntry;
