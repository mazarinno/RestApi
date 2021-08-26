exports.catchError = (res, error) => {  
  console.log('ERROR: ', error.name);

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(err => err.message);
    res.status(400).json({ errors });   
  } else {
    throw error;
  }
}