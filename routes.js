'use strict';

var express = require('express');
var router = express.Router();
const users = [];

router.get('/users', (req, res) => {
	res.json(users);
});

// Route that creates a new user.
router.post('/users', (req, res) => {
  // Get the user from the request body.
  const user = req.body;
  const errors = [];

  if (!user.name) {
    errors.push('Please provide a value for "name"');
  }


  if (!user.email) {
    errors.push('Please provide a value for "email"');
  }


  if (errors.length > 0) {
    // Return the validation errors to the client.
    res.status(400).json({ errors });
  } else {
    // Add the user to the `users` array.
    users.push(user);

    // Set the status to 201 Created and end the response.
    res.status(201).end();
  }
});

module.exports = router;