'use strict';
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models').User;
const Course = require('./models').Course;

function asyncHandler(cb){
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(err) {
      next(err);
    }
  }
}

function catchError() {  // i reused this code a lot, so i have made it into a function
  console.log('ERROR: ', error.name);

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(err => err.message);
    res.status(400).json({ errors });   
  } else {
    throw error;
  }
}

// route that gets all users
router.get('/users', asyncHandler(async (req, res) => {
  let users = await User.findAll();
  res.json(users);
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async(req, res) => {
  // Get the user from the request body.
  const user = req.body;
  const errors = [];

  if (!user.password) { // i am using this prelim. error catcher to preemptively hash the password
    errors.push('Please provide a value for "password"');
  } else {
    user.password = bcrypt.hashSync(user.password, 10);
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    try {
      await User.create(user);
      res.status(201).location('/').end();
    } catch (error) {
        catchError();
    }  
  }
}));

router.get('/courses', asyncHandler(async(req, res) => {
	let courses = await Course.findAll();
  res.status(200).json(courses);
}));

router.post('/courses', asyncHandler(async(req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).location('/courses/' + course.id).end();
  } catch (error) {
      catchError();
  }  
}));

router.get('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  res.status(200).json(course);
}));

router.put('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  const errors = [];

  if (!req.body.title || !req.body.description) {  // if no title or description in the put body, it is denied
    errors.push('Please provide a title and description');
    res.status(400).json({ errors });
  } else {
    try {
      await course.update(req.body);
      res.status(204).end();
    } catch (error) {
        catchError();
    }
  }
}));

router.delete('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);

  try {
    await course.destroy();
    res.status(204).end();
  } catch (error) {
      catchError();
  }
}));

module.exports = router;