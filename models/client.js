// import dependencies
const mongoose = require('./connection');

// import user model for populate
const User = require('./user');

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose;

const clientSchema = new Schema(
  {
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    // goal: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectID,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Client = model('Client', clientSchema);

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Client;
