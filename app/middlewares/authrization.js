const { HttpException } = require('../error/HttpException');

const isSuperAdmin = (req, res, next) => {
  try {
    // Check the user's role in the JWT token
    if (req.user && req.user.role === 'superadmin') {
      next(); // User is a superadmin, proceed
    } else {
      throw new HttpException(401, 'Permission denied. You are not a superadmin');
    }
  } catch (error) {
    // Handle the error and send a response
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

const isAdmin = (req, res, next) => {
  try {
    // Check the user's role in the JWT token
    if (req.user && req.user.role === 'admin') {
      next(); // User is an admin, proceed
    } else {
      throw new HttpException(401, 'Permission denied. You are not an admin');
    }
  } catch (error) {
    // Handle the error and send a response
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

const isEmployee = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'employee') {
      next();
    } else {
      throw new HttpException(401, 'Permission denied. You are not an employee');
    }
  } catch (error) {
    // Handle the error and send a response
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = { isSuperAdmin, isAdmin, isEmployee };
