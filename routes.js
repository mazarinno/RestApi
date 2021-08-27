'use strict';
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models').User;
const Course = require('./models').Course;
const { asyncHandler } = require('./middleware/async-handler');
const { catchError } = require('./middleware/catchError');
const { authenticateUser } = require('./middleware/auth-user');

// route that returns currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const authUser = req.currentUser;

  try {
    const user = await User.findByPk(authUser.id);
    res.status(200).json(user);
  } catch {
    res.status(401).json({ message: "User not found"});
  }
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

  try {
    await User.create(user);
    res.status(201).location('/').end();
  } catch (error) {
      catchError(res, error);
  }  
}));

// returns all courses
router.get('/courses', asyncHandler(async(req, res) => {
	let courses = await Course.findAll({include: [{ model: User }]});
  res.status(200).json(courses);
}));

// allows an authenticated user to add a course
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
  const authUser = req.currentUser;

  try {
    await User.findByPk(authUser.id);
    const course = await Course.create(req.body);
    res.status(201).location('/courses/' + course.id).end();
  } catch (error) {
      catchError(res, error);
  }  
}));

// returns a specific course by id number
router.get('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id, {include: [{ model: User }]});
  res.status(200).json(course);
}));

// allows an authenticated user to udpate an existing course
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  const authUser = req.currentUser;
  const errors = [];

  if (!req.body.title) {  // if no title or description in the put body, it is denied
    errors.push('Please provide a title');
    res.status(400).json({ errors });
  } else if (!req.body.description) {
    errors.push('Please provide a description');
    res.status(400).json({ errors });
  } else {
    try {
      await User.findByPk(authUser.id);
      await course.update(req.body);
      res.status(204).end();
    } catch (error) {
        catchError(res, error);
    }
  }
}));

// allows an authenticated user to delete an existing course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  const authUser = req.currentUser;
  
  try {
    await User.findByPk(authUser.id);
    await course.destroy();
    res.status(204).end();
  } catch (error) {
      catchError(res, error);
  }
}));

module.exports = router;