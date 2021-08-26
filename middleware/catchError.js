function catchError() {  // i reused this code a lot, so i have made it into a function
  console.log('ERROR: ', error.name);

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(err => err.message);
    res.status(400).json({ errors });   
  } else {
    throw error;
  }
}