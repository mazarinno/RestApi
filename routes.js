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
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }  
  }
}));

router.get('/courses', asyncHandler(async(req, res) => {
	let courses = await Course.findAll();
  res.status(200).json(courses);
}));

router.post('/courses', asyncHandler(async(req, res) => {
  try {
    const course = Course.create(req.body);
    res.status(201).location('/courses/' + course.id).end();
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }  
}));

router.get('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  res.status(200).json(course);
}));

router.put('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);

  try {
    await course.update(req.body);
    res.status(204).end();
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

router.delete('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);

  try {
    await course.destroy();
    res.status(204).end();
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

module.exports = router;