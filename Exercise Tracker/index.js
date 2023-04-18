const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Users = require('./userModel');
const Exercises = require('./exerciseModel');
require('dotenv').config();

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/freecodecamp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('MONGODB IS CONNECT') }, err => {
    console.log(err)
});

// midleware
app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// default endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// function create user
async function createUser(username) {
  return await new Users({ username }).save();
};

// function find user
async function findUser(username) {
  return await Users.findOne({ username }).select('_id username');
};

// get user by _id
async function findUserById(id) {
  return await Users.findById(id)
};

// function get all users
async function getAllUsers() {
  return await Users.find({}).select('_id username');
};

// function findExerciseByUserId
async function findExerciseByUserId(userId) {
  return await Exercises.find({ userId }).select('description duration date');
}

// create new exercise function
async function addExercise(userId, username, description, duration, date) {
  return await new Exercises({ userId, username, description, duration, date }).save();
};

// create user endpoint
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  const user = await findUser(username);

  if (!user) {
    const newUser = await createUser(username);
    return res.json(newUser);
  }
  return res.json(user);
});

// get all users endpoint
app.get('/api/users', async (req, res) => {
  const users = await getAllUsers();
  return res.json(users);
});

// create exercise endpoint
app.post('/api/users/:_id/exercises', async (req, res) => {
  let { description, duration, date } = req.body;

  // validation req body
  if (description === '' || duration === '') {
    return res.send('input cannot be empty');
  };

  // chek date empty or not
  if (date === '' || date === undefined) {
    date = new Date().toISOString().split('T')[0];
  }

  // get user
  const { _id, username } = await findUserById(req.params._id);

  // save exercise
  const newExercise = await addExercise(_id, username, description, duration, date);

  res.json({
    username: newExercise.username,
    _id: newExercise.userId,
    description: newExercise.description,
    duration: newExercise.duration,
    date: new Date(newExercise.date).toDateString(),
  });
});

app.get('/api/users/:_id/logs?', async (req, res) => {
  const { from, to, limit } = req.query;
  const userId = req.params._id;

  // get user
  const user = await findUserById(userId);

  // getExersice
  let exercises = await findExerciseByUserId(userId);

  if (from) {
    exercises = exercises.filter((ele) => Date.parse(ele.date) >= Date.parse(from));
  }
  if (to) {
    exercises = exercises.filter((ele) => Date.parse(ele.date) <= Date.parse(to));
  }
  if (limit) {
    exercises = exercises.slice(0, parseInt(limit));
  }

  let log = [];

  exercises.forEach((ele) => {
    log.push({
      description: ele.description,
      duration: ele.duration,
      date: new Date(ele.date).toDateString(),
    });
  });

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
