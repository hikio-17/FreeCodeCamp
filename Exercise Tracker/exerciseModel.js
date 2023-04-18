const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
   userId: String,
   username: String,
   description: {
      type: String,
      max: [200, 'description not a long'],
   },
   duration: Number,
   date: String,
});

const Exercises = mongoose.model('Exercises', exerciseSchema);

module.exports = Exercises;