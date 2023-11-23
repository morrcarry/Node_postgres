const jwt = require('jsonwebtoken');

const { SECRETKEY } = process.env;
const { HttpException } = require('../error/HttpException');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw new HttpException(401, 'Token not provided');
  }
  try {
    const decoded = jwt.verify(token, SECRETKEY);
    req.token = token;
    req.user = decoded.userFound;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpException(401, 'Invalid token');
    } else {
      throw new HttpException(500, 'Internal Server Error');
    }
  }
};

module.exports = auth;
