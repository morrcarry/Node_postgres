const { SECRETKEY } = process.env;
const ethers = require('ethers');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { HttpException } = require('../error/HttpException');
const { validateUser, validateLogin } = require('../validators/user.validator');
const passKey = require('../utils/passKey');

function createToken(data) {
  return jwt.sign(data, SECRETKEY, {
    expiresIn: 2400,
  });
}

const registerSuperAdmin = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      // return res.status(400).json({ error: error.details[0].message });
      throw new HttpException(400, error.details[0].message);
    }

    const data = req.body;
    const { name, email, phone } = data;
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      throw new HttpException(400, 'Email is already registered');
    }

    const { privateKey, pubKey } = passKey();// Getting private and public key from utils

    const newUser = await User.create({
      name,
      email,
      phone,
      public_key: pubKey,
      role: 'superadmin',
    });

    res.status(201).json({ user: newUser, message: `Super admin registered successfully with private key ${privateKey}` });
  } catch (error) {
    console.error('Error creating :', error);
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      // return res.status(400).json({ error: error.details[0].message });
      throw new HttpException(400, error.details[0].message);
    }

    const { email, privateKey } = req.body;
    const wallet = new ethers.Wallet(privateKey);
    const pubKey = wallet.signingKey.publicKey;

    const userFound = await User.findOne({ where: { email: email } });
    console.log(userFound);

    if (!userFound) {
      // next(error);
      throw new HttpException(400, 'User not found');
    } else if (userFound.public_key !== pubKey) {
      throw new HttpException(400, 'Wrong credentials');
    } else {
      // Return user data and token

      const token = createToken({ userFound });

      res.status(201).json({ user: userFound, token });
    }
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = { registerSuperAdmin, loginUser };
